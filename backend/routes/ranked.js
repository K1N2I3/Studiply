import express from 'express'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import UserRank, { RANK_TIERS, POINT_RULES, getTierFromPoints } from '../models/UserRank.js'
import Match from '../models/Match.js'

const router = express.Router()

// In-memory matchmaking queue (in production, use Redis)
const matchmakingQueue = new Map() // key: `${subject}_${tier}_${difficulty}`, value: [{userId, userName, userAvatar, joinedAt}]

// Active matches for quick lookup
const activeMatches = new Map() // key: matchId, value: match document

// Generate unique match ID
const generateMatchId = () => `match_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`

// AI Client (same as other routes)
const getAIClient = () => {
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      client: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      provider: 'claude',
      isAnthropic: true
    }
  } else if (process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      provider: 'openai'
    }
  } else if (process.env.DEEPSEEK_API_KEY) {
    return {
      client: new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1'
      }),
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      provider: 'deepseek'
    }
  }
  throw new Error('No AI API key configured')
}

// Subject names
const subjectNames = {
  'mathematics': 'Mathematics',
  'physics': 'Physics',
  'chemistry': 'Chemistry',
  'biology': 'Biology',
  'english': 'English',
  'italian': 'Italian',
  'spanish': 'Spanish',
  'french': 'French',
  'history': 'History',
  'geography': 'Geography',
  'computerScience': 'Computer Science'
}

// Generate AI questions for battle
const generateBattleQuestions = async (subject, difficulty, count = 5) => {
  const aiConfig = getAIClient()
  const subjectName = subjectNames[subject] || subject
  
  const difficultyDesc = {
    easy: 'basic, straightforward questions suitable for beginners',
    medium: 'intermediate questions requiring good understanding',
    hard: 'challenging questions requiring deep knowledge and critical thinking'
  }

  const systemPrompt = `You are a quiz master creating competitive battle questions. Generate exactly ${count} multiple-choice questions for a ${subjectName} ranked battle.

Requirements:
- Difficulty: ${difficulty} - ${difficultyDesc[difficulty]}
- Each question must have exactly 4 options
- Questions should be clear and unambiguous
- Include variety in topics within the subject
- Questions should be answerable within 15 seconds

Return JSON format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}`

  const userPrompt = `Generate ${count} ${difficulty} ${subjectName} questions for a competitive quiz battle.`

  let response
  if (aiConfig.isAnthropic) {
    const message = await aiConfig.client.messages.create({
      model: aiConfig.model,
      max_tokens: 2048,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
    response = message.content[0].text
  } else {
    const completion = await aiConfig.client.chat.completions.create({
      model: aiConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' }
    })
    response = completion.choices[0].message.content
  }

  // Parse response
  let parsed
  try {
    parsed = JSON.parse(response)
  } catch (e) {
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1])
    } else {
      throw new Error('Failed to parse AI response')
    }
  }

  return parsed.questions.map((q, i) => ({
    questionId: `q_${Date.now()}_${i}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer
  }))
}

// Bot answer simulation
const simulateBotAnswer = (difficulty, correctAnswer) => {
  const accuracyRates = { easy: 0.6, medium: 0.75, hard: 0.9 }
  const accuracy = accuracyRates[difficulty]
  
  // Random time between 2-12 seconds
  const answerTime = 2000 + Math.random() * 10000
  
  // Determine if bot answers correctly
  const isCorrect = Math.random() < accuracy
  
  if (isCorrect) {
    return { answer: correctAnswer, time: answerTime }
  } else {
    // Pick wrong answer
    let wrongAnswer
    do {
      wrongAnswer = Math.floor(Math.random() * 4)
    } while (wrongAnswer === correctAnswer)
    return { answer: wrongAnswer, time: answerTime }
  }
}

// ============ API Routes ============

// Get user rank status
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    
    let userRank = await UserRank.findOne({ userId })
    if (!userRank) {
      userRank = new UserRank({ userId })
      await userRank.save()
    }

    res.json({
      success: true,
      rank: {
        userId: userRank.userId,
        userName: userRank.userName,
        totalWins: userRank.totalWins,
        totalLosses: userRank.totalLosses,
        totalMatches: userRank.totalMatches,
        subjectRanks: userRank.subjectRanks,
        seasonHighestTier: userRank.seasonHighestTier
      }
    })
  } catch (error) {
    console.error('Error getting rank status:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get rank for specific subject
router.get('/status/:userId/:subject', async (req, res) => {
  try {
    const { userId, subject } = req.params
    
    let userRank = await UserRank.findOne({ userId })
    if (!userRank) {
      userRank = new UserRank({ userId })
      await userRank.save()
    }

    const subjectRank = userRank.getSubjectRank(subject)
    
    res.json({
      success: true,
      subjectRank: {
        ...subjectRank,
        tierInfo: RANK_TIERS[subjectRank.tier]
      }
    })
  } catch (error) {
    console.error('Error getting subject rank:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Join matchmaking queue
router.post('/queue', async (req, res) => {
  try {
    const { userId, userName, userAvatar, subject, difficulty } = req.body

    if (!userId || !subject || !difficulty) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }

    // Get user's tier for this subject
    let userRank = await UserRank.findOne({ userId })
    if (!userRank) {
      userRank = new UserRank({ userId, userName })
      await userRank.save()
    }
    
    // Update username if provided
    if (userName && userName !== userRank.userName) {
      userRank.userName = userName
      await userRank.save()
    }

    const subjectRank = userRank.getSubjectRank(subject)
    const tier = subjectRank.tier

    const queueKey = `${subject}_${tier}_${difficulty}`
    
    // Check if already in queue
    if (!matchmakingQueue.has(queueKey)) {
      matchmakingQueue.set(queueKey, [])
    }
    
    const queue = matchmakingQueue.get(queueKey)
    const existingIndex = queue.findIndex(p => p.userId === userId)
    
    if (existingIndex !== -1) {
      return res.json({ success: true, status: 'already_in_queue', queuePosition: existingIndex + 1 })
    }

    // Add to queue
    queue.push({
      userId,
      userName: userName || userRank.userName,
      userAvatar,
      tier,
      points: subjectRank.points,
      joinedAt: Date.now()
    })

    console.log(`🎮 [Ranked] ${userName} joined queue: ${queueKey} (${queue.length} in queue)`)

    // Check for match
    if (queue.length >= 2) {
      const player1 = queue.shift()
      const player2 = queue.shift()
      
      // Create match
      const matchId = generateMatchId()
      const questions = await generateBattleQuestions(subject, difficulty, 5)
      
      const match = new Match({
        matchId,
        subject,
        difficulty,
        player1: {
          userId: player1.userId,
          userName: player1.userName,
          userAvatar: player1.userAvatar,
          tier: player1.tier,
          points: player1.points
        },
        player2: {
          userId: player2.userId,
          userName: player2.userName,
          userAvatar: player2.userAvatar,
          tier: player2.tier,
          points: player2.points,
          isBot: false
        },
        status: 'pending',
        questions,
        totalQuestions: questions.length
      })
      
      await match.save()
      activeMatches.set(matchId, match)

      console.log(`🎮 [Ranked] Match created: ${matchId} - ${player1.userName} vs ${player2.userName}`)

      return res.json({
        success: true,
        status: 'matched',
        matchId,
        opponent: {
          userName: player2.userName,
          tier: player2.tier,
          isBot: false
        }
      })
    }

    res.json({
      success: true,
      status: 'waiting',
      queuePosition: queue.length,
      queueKey
    })
  } catch (error) {
    console.error('Error joining queue:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Check queue status / wait for match
router.get('/queue/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { subject, difficulty, tier } = req.query

    const queueKey = `${subject}_${tier}_${difficulty}`
    const queue = matchmakingQueue.get(queueKey) || []
    
    const playerInQueue = queue.find(p => p.userId === userId)
    
    if (!playerInQueue) {
      // Check if there's an active match for this user
      for (const [matchId, match] of activeMatches) {
        if (match.player1.userId === userId || match.player2.userId === userId) {
          return res.json({
            success: true,
            status: 'matched',
            matchId,
            opponent: match.player1.userId === userId ? match.player2 : match.player1
          })
        }
      }
      return res.json({ success: true, status: 'not_in_queue' })
    }

    const waitTime = Date.now() - playerInQueue.joinedAt

    // After 30 seconds, create bot match
    if (waitTime > 30000) {
      // Remove from queue
      const index = queue.findIndex(p => p.userId === userId)
      if (index !== -1) {
        queue.splice(index, 1)
      }

      // Create bot match
      const matchId = generateMatchId()
      const questions = await generateBattleQuestions(subject, difficulty, 5)
      
      const botNames = ['StudyBot Alpha', 'QuizMaster AI', 'BrainBot Pro', 'Scholar AI', 'Genius Bot']
      const botName = botNames[Math.floor(Math.random() * botNames.length)]

      const match = new Match({
        matchId,
        subject,
        difficulty,
        player1: {
          userId: playerInQueue.userId,
          userName: playerInQueue.userName,
          userAvatar: playerInQueue.userAvatar,
          tier: playerInQueue.tier,
          points: playerInQueue.points
        },
        player2: {
          userId: `bot_${Date.now()}`,
          userName: botName,
          tier: playerInQueue.tier,
          points: playerInQueue.points,
          isBot: true
        },
        status: 'pending',
        questions,
        totalQuestions: questions.length
      })
      
      await match.save()
      activeMatches.set(matchId, match)

      console.log(`🤖 [Ranked] Bot match created: ${matchId} - ${playerInQueue.userName} vs ${botName}`)

      return res.json({
        success: true,
        status: 'matched',
        matchId,
        opponent: {
          userName: botName,
          tier: playerInQueue.tier,
          isBot: true
        }
      })
    }

    res.json({
      success: true,
      status: 'waiting',
      waitTime,
      queuePosition: queue.findIndex(p => p.userId === userId) + 1
    })
  } catch (error) {
    console.error('Error checking queue status:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Leave queue
router.post('/queue/leave', async (req, res) => {
  try {
    const { userId, subject, difficulty, tier } = req.body

    const queueKey = `${subject}_${tier}_${difficulty}`
    const queue = matchmakingQueue.get(queueKey)
    
    if (queue) {
      const index = queue.findIndex(p => p.userId === userId)
      if (index !== -1) {
        queue.splice(index, 1)
        console.log(`🎮 [Ranked] ${userId} left queue: ${queueKey}`)
      }
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Error leaving queue:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get match state
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params
    const { userId } = req.query

    let match = activeMatches.get(matchId)
    if (!match) {
      match = await Match.findOne({ matchId })
      if (match) {
        activeMatches.set(matchId, match)
      }
    }

    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' })
    }

    // Determine player number
    const playerNum = match.player1.userId === userId ? 1 : 2

    // Don't reveal correct answers in ongoing match
    const safeQuestions = match.questions.map((q, i) => ({
      questionId: q.questionId,
      question: q.question,
      options: q.options,
      // Only reveal answers for completed questions
      ...(i < match.currentQuestion ? { 
        correctAnswer: q.correctAnswer,
        player1Answer: q.player1Answer,
        player2Answer: q.player2Answer
      } : {})
    }))

    res.json({
      success: true,
      match: {
        matchId: match.matchId,
        subject: match.subject,
        difficulty: match.difficulty,
        status: match.status,
        player1: match.player1,
        player2: match.player2,
        currentQuestion: match.currentQuestion,
        totalQuestions: match.totalQuestions,
        questions: safeQuestions,
        player1Score: match.player1Score,
        player2Score: match.player2Score,
        winner: match.winner,
        playerNum,
        timePerQuestion: match.timePerQuestion,
        questionStartedAt: match.questionStartedAt
      }
    })
  } catch (error) {
    console.error('Error getting match:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Start match
router.post('/match/:matchId/start', async (req, res) => {
  try {
    const { matchId } = req.params
    
    let match = activeMatches.get(matchId) || await Match.findOne({ matchId })
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' })
    }

    match.status = 'in_progress'
    match.startedAt = new Date()
    match.questionStartedAt = new Date()
    
    await match.save()
    activeMatches.set(matchId, match)

    res.json({ success: true, status: 'started' })
  } catch (error) {
    console.error('Error starting match:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Submit answer
router.post('/match/:matchId/answer', async (req, res) => {
  try {
    const { matchId } = req.params
    const { userId, questionIndex, answer, answerTime } = req.body

    let match = activeMatches.get(matchId) || await Match.findOne({ matchId })
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' })
    }

    const playerNum = match.player1.userId === userId ? 1 : 2
    const result = match.recordAnswer(playerNum, questionIndex, answer, answerTime)

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error })
    }

    // If playing against bot, simulate bot answer
    if (match.player2.isBot && playerNum === 1) {
      const question = match.questions[questionIndex]
      const botResponse = simulateBotAnswer(match.difficulty, question.correctAnswer)
      
      // Delay bot answer slightly
      setTimeout(async () => {
        match.recordAnswer(2, questionIndex, botResponse.answer, botResponse.time)
        await match.save()
        activeMatches.set(matchId, match)
      }, botResponse.time)
    }

    await match.save()
    activeMatches.set(matchId, match)

    res.json({
      success: true,
      correct: result.correct,
      correctAnswer: result.correctAnswer,
      player1Score: match.player1Score,
      player2Score: match.player2Score,
      bothAnswered: match.bothAnswered(questionIndex)
    })
  } catch (error) {
    console.error('Error submitting answer:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Next question
router.post('/match/:matchId/next', async (req, res) => {
  try {
    const { matchId } = req.params

    let match = activeMatches.get(matchId) || await Match.findOne({ matchId })
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' })
    }

    match.currentQuestion++
    match.questionStartedAt = new Date()

    // Check if match is over
    if (match.currentQuestion >= match.totalQuestions) {
      match.finalize()
      
      // Update player ranks
      const player1Won = match.winner === 'player1'
      const player2Won = match.winner === 'player2'
      
      // Update player 1 rank
      let player1Rank = await UserRank.findOne({ userId: match.player1.userId })
      if (!player1Rank) {
        player1Rank = new UserRank({ userId: match.player1.userId, userName: match.player1.userName })
      }
      const p1Result = player1Rank.updateAfterMatch(match.subject, match.difficulty, player1Won || match.winner === 'draw')
      await player1Rank.save()
      match.player1PointChange = p1Result.pointChange

      // Update player 2 rank (if not bot)
      if (!match.player2.isBot) {
        let player2Rank = await UserRank.findOne({ userId: match.player2.userId })
        if (!player2Rank) {
          player2Rank = new UserRank({ userId: match.player2.userId, userName: match.player2.userName })
        }
        const p2Result = player2Rank.updateAfterMatch(match.subject, match.difficulty, player2Won || match.winner === 'draw')
        await player2Rank.save()
        match.player2PointChange = p2Result.pointChange
      }

      await match.save()
      activeMatches.delete(matchId) // Clean up

      return res.json({
        success: true,
        status: 'completed',
        winner: match.winner,
        player1Score: match.player1Score,
        player2Score: match.player2Score,
        player1PointChange: match.player1PointChange,
        player2PointChange: match.player2PointChange,
        player1NewRank: p1Result
      })
    }

    await match.save()
    activeMatches.set(matchId, match)

    res.json({
      success: true,
      status: 'continue',
      currentQuestion: match.currentQuestion
    })
  } catch (error) {
    console.error('Error moving to next question:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get match result
router.get('/match/:matchId/result', async (req, res) => {
  try {
    const { matchId } = req.params
    const { userId } = req.query

    const match = await Match.findOne({ matchId })
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' })
    }

    const playerNum = match.player1.userId === userId ? 1 : 2
    const userWon = (playerNum === 1 && match.winner === 'player1') || 
                    (playerNum === 2 && match.winner === 'player2')
    const isDraw = match.winner === 'draw'

    res.json({
      success: true,
      result: {
        matchId,
        winner: match.winner,
        playerNum,
        userWon,
        isDraw,
        player1Score: match.player1Score,
        player2Score: match.player2Score,
        player1PointChange: match.player1PointChange,
        player2PointChange: match.player2PointChange,
        questions: match.questions
      }
    })
  } catch (error) {
    console.error('Error getting match result:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get leaderboard
router.get('/leaderboard/:subject', async (req, res) => {
  try {
    const { subject } = req.params
    const { limit = 100 } = req.query

    const leaderboard = await UserRank.aggregate([
      { $unwind: '$subjectRanks' },
      { $match: { 'subjectRanks.subject': subject } },
      { $sort: { 'subjectRanks.points': -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          userId: 1,
          userName: 1,
          userAvatar: 1,
          points: '$subjectRanks.points',
          tier: '$subjectRanks.tier',
          wins: '$subjectRanks.wins',
          losses: '$subjectRanks.losses',
          winStreak: '$subjectRanks.winStreak'
        }
      }
    ])

    res.json({
      success: true,
      subject,
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry,
        tierInfo: RANK_TIERS[entry.tier]
      }))
    })
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get user's match history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20, subject } = req.query

    const query = {
      $or: [
        { 'player1.userId': userId },
        { 'player2.userId': userId }
      ],
      status: 'completed'
    }

    if (subject) {
      query.subject = subject
    }

    const matches = await Match.find(query)
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .select('matchId subject difficulty player1 player2 player1Score player2Score winner completedAt')

    const history = matches.map(match => {
      const isPlayer1 = match.player1.userId === userId
      const opponent = isPlayer1 ? match.player2 : match.player1
      const userScore = isPlayer1 ? match.player1Score : match.player2Score
      const opponentScore = isPlayer1 ? match.player2Score : match.player1Score
      const won = (isPlayer1 && match.winner === 'player1') || (!isPlayer1 && match.winner === 'player2')
      
      return {
        matchId: match.matchId,
        subject: match.subject,
        difficulty: match.difficulty,
        opponent: {
          userName: opponent.userName,
          tier: opponent.tier,
          isBot: opponent.isBot
        },
        userScore,
        opponentScore,
        won,
        isDraw: match.winner === 'draw',
        completedAt: match.completedAt
      }
    })

    res.json({ success: true, history })
  } catch (error) {
    console.error('Error getting match history:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router

