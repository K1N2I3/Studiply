import express from 'express'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import UserRank, { RANK_TIERS, POINT_RULES, getTierFromPoints } from '../models/UserRank.js'
import Match from '../models/Match.js'

const router = express.Router()

// In-memory matchmaking queue (in production, use Redis)
const matchmakingQueue = new Map() // key: `${subject}_${difficulty}`, value: [{userId, userName, userAvatar, tier, joinedAt}]

// Active matches for quick lookup
const activeMatches = new Map() // key: matchId, value: match document

// Pending matches - when a match is created, store it here so both players can find it
const pendingMatches = new Map() // key: odice - userId, value: matchId

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
    
    // Convert mongoose document to plain object to ensure all fields are included
    const subjectRankObj = subjectRank.toObject ? subjectRank.toObject() : {
      subject: subjectRank.subject,
      points: subjectRank.points || 0,
      tier: subjectRank.tier || 'BRONZE',
      wins: subjectRank.wins || 0,
      losses: subjectRank.losses || 0,
      winStreak: subjectRank.winStreak || 0,
      bestWinStreak: subjectRank.bestWinStreak || 0,
      lastMatchAt: subjectRank.lastMatchAt
    }
    
    res.json({
      success: true,
      subjectRank: {
        ...subjectRankObj,
        tierInfo: RANK_TIERS[subjectRankObj.tier]
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

    console.log(`🎮 [Ranked] Queue request from ${userName} (${userId}) for ${subject}/${difficulty}`)

    // Check if user already has a pending match
    if (pendingMatches.has(userId)) {
      const matchId = pendingMatches.get(userId)
      const match = activeMatches.get(matchId)
      if (match) {
        // Check if match is still active (not completed or cancelled)
        if (match.status === 'completed' || match.status === 'cancelled') {
          // Old match - clean it up
          console.log(`🧹 [Ranked] Cleaning up old match ${matchId} for user ${userId}`)
          activeMatches.delete(matchId)
          pendingMatches.delete(userId)
          // Also delete from DB if it exists
          try {
            await Match.deleteOne({ matchId })
          } catch (err) {
            console.error('Error deleting old match from DB:', err)
          }
        } else {
          // Active match - return it
          const isPlayer1 = match.player1.userId === userId
          const opponent = isPlayer1 ? match.player2 : match.player1
          console.log(`🎮 [Ranked] User ${userId} already has pending match: ${matchId}`)
          return res.json({
            success: true,
            status: 'matched',
            matchId,
            opponent: {
              userName: opponent.userName,
              tier: opponent.tier,
              isBot: opponent.isBot || false
            }
          })
        }
      } else {
        // Match not in memory - check DB and clean up if needed
        try {
          const dbMatch = await Match.findOne({ matchId })
          if (dbMatch && (dbMatch.status === 'completed' || dbMatch.status === 'cancelled')) {
            console.log(`🧹 [Ranked] Cleaning up old DB match ${matchId} for user ${userId}`)
            await Match.deleteOne({ matchId })
          }
        } catch (err) {
          console.error('Error checking/cleaning DB match:', err)
        }
        pendingMatches.delete(userId)
      }
    }
    
    // Also check for any active matches in DB for this user and clean them up
    try {
      const oldMatches = await Match.find({
        $or: [
          { 'player1.userId': userId },
          { 'player2.userId': userId }
        ],
        status: { $in: ['completed', 'cancelled'] }
      })
      if (oldMatches.length > 0) {
        console.log(`🧹 [Ranked] Cleaning up ${oldMatches.length} old matches for user ${userId}`)
        await Match.deleteMany({
          $or: [
            { 'player1.userId': userId },
            { 'player2.userId': userId }
          ],
          status: { $in: ['completed', 'cancelled'] }
        })
      }
    } catch (err) {
      console.error('Error cleaning up old matches:', err)
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

    // Use subject + difficulty as queue key (not tier, so different tiers can match)
    const queueKey = `${subject}_${difficulty}`
    
    // Check if already in queue
    if (!matchmakingQueue.has(queueKey)) {
      matchmakingQueue.set(queueKey, [])
    }
    
    const queue = matchmakingQueue.get(queueKey)
    
    // Remove user from queue if already exists (refresh their position)
    const existingIndex = queue.findIndex(p => p.userId === userId)
    if (existingIndex !== -1) {
      queue.splice(existingIndex, 1)
    }

    // Find opponent (anyone else in queue)
    const opponentIndex = queue.findIndex(p => p.userId !== userId)
    
    if (opponentIndex !== -1) {
      // Found an opponent! Create match immediately
      const opponent = queue.splice(opponentIndex, 1)[0]
      
      const matchId = generateMatchId()
      console.log(`🎮 [Ranked] Generating questions for match ${matchId}...`)
      
      const questions = await generateBattleQuestions(subject, difficulty, 5)
      
      const match = new Match({
        matchId,
        subject,
        difficulty,
        player1: {
          userId: opponent.userId,
          userName: opponent.userName,
          userAvatar: opponent.userAvatar,
          tier: opponent.tier,
          points: opponent.points
        },
        player2: {
          userId: userId,
          userName: userName || userRank.userName,
          userAvatar: userAvatar,
          tier: tier,
          points: subjectRank.points,
          isBot: false
        },
        status: 'pending',
        questions,
        totalQuestions: questions.length
      })
      
      await match.save()
      activeMatches.set(matchId, match)
      
      // Store pending match for BOTH players
      pendingMatches.set(opponent.userId, matchId)
      pendingMatches.set(userId, matchId)

      console.log(`🎮 [Ranked] Match created: ${matchId} - ${opponent.userName} vs ${userName}`)

      return res.json({
        success: true,
        status: 'matched',
        matchId,
        opponent: {
          userName: opponent.userName,
          tier: opponent.tier,
          isBot: false
        }
      })
    }

    // No opponent found, add to queue
    queue.push({
      userId,
      userName: userName || userRank.userName,
      userAvatar,
      tier,
      points: subjectRank.points,
      joinedAt: Date.now()
    })

    console.log(`🎮 [Ranked] ${userName} added to queue: ${queueKey} (${queue.length} in queue)`)

    res.json({
      success: true,
      status: 'waiting',
      queuePosition: queue.length,
      queueKey,
      tier
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

    console.log(`🔍 [Ranked] Checking queue status for ${userId}`)

    // First, check if user has a pending match
    if (pendingMatches.has(userId)) {
      const matchId = pendingMatches.get(userId)
      const match = activeMatches.get(matchId)
      if (match) {
        const isPlayer1 = match.player1.userId === userId
        const opponent = isPlayer1 ? match.player2 : match.player1
        console.log(`✅ [Ranked] Found pending match for ${userId}: ${matchId}`)
        return res.json({
          success: true,
          status: 'matched',
          matchId,
          opponent: {
            userName: opponent.userName,
            tier: opponent.tier,
            isBot: opponent.isBot || false
          }
        })
      } else {
        // Match no longer exists, clean up
        pendingMatches.delete(userId)
      }
    }

    // Check active matches (fallback)
    for (const [matchId, match] of activeMatches) {
      if (match.player1.userId === userId || match.player2.userId === userId) {
        const isPlayer1 = match.player1.userId === userId
        const opponent = isPlayer1 ? match.player2 : match.player1
        console.log(`✅ [Ranked] Found active match for ${userId}: ${matchId}`)
        return res.json({
          success: true,
          status: 'matched',
          matchId,
          opponent: {
            userName: opponent.userName,
            tier: opponent.tier,
            isBot: opponent.isBot || false
          }
        })
      }
    }

    const queueKey = `${subject}_${difficulty}`
    const queue = matchmakingQueue.get(queueKey) || []
    
    const playerInQueue = queue.find(p => p.userId === userId)
    
    if (!playerInQueue) {
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

      console.log(`🤖 [Ranked] Creating bot match for ${userId} after timeout`)

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
      pendingMatches.set(userId, matchId)

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

    // Remove from queue
    const queueKey = `${subject}_${difficulty}`
    const queue = matchmakingQueue.get(queueKey)
    
    if (queue) {
      const index = queue.findIndex(p => p.userId === userId)
      if (index !== -1) {
        queue.splice(index, 1)
        console.log(`🎮 [Ranked] ${userId} left queue: ${queueKey}`)
      }
    }

    // Also remove pending match reference
    pendingMatches.delete(userId)

    res.json({ success: true })
  } catch (error) {
    console.error('Error leaving queue:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get queue count for a subject/difficulty
router.get('/queue/count', async (req, res) => {
  try {
    const { subject, difficulty } = req.query
    const queueKey = `${subject}_${difficulty}`
    const queue = matchmakingQueue.get(queueKey) || []
    
    // Also count all players across all difficulties for this subject
    let totalForSubject = 0
    for (const [key, q] of matchmakingQueue) {
      if (key.startsWith(subject + '_')) {
        totalForSubject += q.length
      }
    }
    
    res.json({ 
      success: true, 
      count: queue.length,
      totalForSubject,
      queueKey
    })
  } catch (error) {
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

    // Use in-memory cache for speed
    let match = activeMatches.get(matchId)
    if (!match) {
      match = await Match.findOne({ matchId })
      if (match) activeMatches.set(matchId, match)
    }
    
    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' })
    }

    const playerNum = match.player1.userId === userId ? 1 : 2
    const result = match.recordAnswer(playerNum, questionIndex, answer, answerTime)

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error })
    }

    // If playing against bot, simulate bot answer immediately
    if (match.player2.isBot && playerNum === 1) {
      const question = match.questions[questionIndex]
      const botResponse = simulateBotAnswer(match.difficulty, question.correctAnswer)
      match.recordAnswer(2, questionIndex, botResponse.answer, botResponse.time)
    }

    // Update in-memory cache (don't save to DB yet for speed)
    activeMatches.set(matchId, match)

    const bothAnswered = match.bothAnswered(questionIndex)
    
    // Only reveal correct answer if both have answered
    res.json({
      success: true,
      answered: true,
      // Only show if answer is correct AFTER both answered
      correct: bothAnswered ? result.correct : null,
      correctAnswer: bothAnswered ? result.correctAnswer : null,
      player1Score: match.player1Score,
      player2Score: match.player2Score,
      bothAnswered,
      currentQuestion: match.currentQuestion
    })
  } catch (error) {
    console.error('Error submitting answer:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Match finalization lock to prevent race conditions
const finalizingMatches = new Set()

// Get queue stats
router.get('/queue/stats', async (req, res) => {
  try {
    const stats = {}
    let totalInQueue = 0
    
    for (const [key, queue] of matchmakingQueue) {
      stats[key] = queue.length
      totalInQueue += queue.length
    }
    
    res.json({
      success: true,
      totalInQueue,
      queues: stats
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Next question - PURE IN-MEMORY for speed, no DB during gameplay
router.post('/match/:matchId/next', async (req, res) => {
  try {
    const { matchId } = req.params
    const { userId, clientQuestionIndex } = req.body

    // Check in-memory first, then DB
    let match = activeMatches.get(matchId)
    
    // If not in memory, check DB (might have been forfeited)
    if (!match) {
      try {
        match = await Match.findOne({ matchId })
      } catch (dbError) {
        console.error('Error querying DB for match:', dbError)
      }
      
      // If match doesn't exist in DB either, it was deleted (forfeited)
      if (!match) {
        console.log(`⚠️ [Ranked] Match ${matchId} not found in memory or DB - forfeited/deleted`)
        return res.json({
          success: true,
          status: 'forfeited',
          error: 'Match was forfeited by opponent',
          player1PointChange: 0,
          player2PointChange: 0
        })
      }
      
      // If found in DB but status is cancelled, it was forfeited
      if (match.status === 'cancelled') {
        const playerNum = match.player1.userId === userId ? 1 : 2
        const pointChange = playerNum === 1 ? (match.player1PointChange || 0) : (match.player2PointChange || 0)
        return res.json({
          success: true,
          status: 'forfeited',
          winner: match.winner,
          playerNum,
          player1Score: match.player1Score || 0,
          player2Score: match.player2Score || 0,
          player1PointChange: match.player1PointChange || 0,
          player2PointChange: match.player2PointChange || 0,
          pointChange
        })
      }
      
      // Add back to memory if found and active
      if (match.status !== 'completed' && match.status !== 'cancelled') {
        activeMatches.set(matchId, match)
      }
    }

    // Now we know match exists, determine player number
    const playerNum = match.player1.userId === userId ? 1 : 2
    const serverQ = match.currentQuestion

    // If match is already completed, return result immediately
    if (match.status === 'completed') {
      const pointChange = playerNum === 1 ? match.player1PointChange : match.player2PointChange
      return res.json({
        success: true,
        status: 'completed',
        winner: match.winner,
        playerNum,
        player1Score: match.player1Score,
        player2Score: match.player2Score,
        player1PointChange: match.player1PointChange,
        player2PointChange: match.player2PointChange,
        pointChange
      })
    }

    // If match is cancelled/forfeited, return forfeited status
    if (match.status === 'cancelled') {
      const pointChange = playerNum === 1 ? match.player1PointChange : match.player2PointChange
      return res.json({
        success: true,
        status: 'forfeited',
        winner: match.winner,
        playerNum,
        player1Score: match.player1Score,
        player2Score: match.player2Score,
        player1PointChange: match.player1PointChange,
        player2PointChange: match.player2PointChange,
        pointChange
      })
    }

    // If client is behind, tell them to sync
    if (clientQuestionIndex !== undefined && clientQuestionIndex < serverQ) {
      return res.json({
        success: true,
        status: 'sync',
        currentQuestion: serverQ,
        player1Score: match.player1Score,
        player2Score: match.player2Score
      })
    }

    // Check if both players have answered the current question
    if (!match.bothAnswered(serverQ)) {
      return res.json({
        success: true,
        status: 'waiting',
        currentQuestion: serverQ,
        player1Score: match.player1Score,
        player2Score: match.player2Score
      })
    }

    // Both answered - advance in memory (no DB)
    if (match.currentQuestion === serverQ) {
      match.currentQuestion++
      match.questionStartedAt = new Date()
      activeMatches.set(matchId, match)
    }

    // Check if match is over
    if (match.currentQuestion >= match.totalQuestions) {
      // Prevent double finalization
      if (match.status === 'completed' || finalizingMatches.has(matchId)) {
        const pointChange = playerNum === 1 ? match.player1PointChange : match.player2PointChange
        return res.json({
          success: true,
          status: 'completed',
          winner: match.winner,
          playerNum,
          player1Score: match.player1Score,
          player2Score: match.player2Score,
          player1PointChange: match.player1PointChange,
          player2PointChange: match.player2PointChange,
          pointChange
        })
      }

      finalizingMatches.add(matchId)
      
      try {
        match.finalize()
        
        const player1Won = match.winner === 'player1'
        const player2Won = match.winner === 'player2'
        const isDraw = match.winner === 'draw'
        
        console.log(`🏆 [Ranked] Match ${matchId} - P1: ${match.player1Score}, P2: ${match.player2Score}, Winner: ${match.winner}`)
        
        // Update player 1 rank - ALWAYS save
        let player1Rank = await UserRank.findOne({ userId: match.player1.userId })
        if (!player1Rank) {
          player1Rank = new UserRank({ userId: match.player1.userId, userName: match.player1.userName })
        }
        const p1Result = player1Rank.updateAfterMatch(match.subject, match.difficulty, player1Won, isDraw)
        await player1Rank.save()
        match.player1PointChange = p1Result.pointChange
        console.log(`📊 P1 ${match.player1.userName}: ${player1Won ? 'WIN' : isDraw ? 'DRAW' : 'LOSS'} (${p1Result.pointChange > 0 ? '+' : ''}${p1Result.pointChange})`)

        // Update player 2 rank (if not bot) - ALWAYS save
        if (!match.player2.isBot) {
          let player2Rank = await UserRank.findOne({ userId: match.player2.userId })
          if (!player2Rank) {
            player2Rank = new UserRank({ userId: match.player2.userId, userName: match.player2.userName })
          }
          const p2Result = player2Rank.updateAfterMatch(match.subject, match.difficulty, player2Won, isDraw)
          await player2Rank.save()
          match.player2PointChange = p2Result.pointChange
          console.log(`📊 P2 ${match.player2.userName}: ${player2Won ? 'WIN' : isDraw ? 'DRAW' : 'LOSS'} (${p2Result.pointChange > 0 ? '+' : ''}${p2Result.pointChange})`)
        } else {
          // Bot always gets 0 point change
          match.player2PointChange = 0
        }

        // IMPORTANT: Delete match from DB after completion (don't keep old matches)
        // We only save match history in a separate collection if needed
        try {
          await Match.deleteOne({ matchId })
          console.log(`🗑️ [Ranked] Match ${matchId} deleted from DB after completion`)
        } catch (deleteError) {
          console.error('Error deleting completed match from DB:', deleteError)
        }
        
        // Remove from active matches and pending matches
        activeMatches.delete(matchId)
        pendingMatches.delete(match.player1.userId)
        pendingMatches.delete(match.player2.userId)

        console.log(`🏁 [Ranked] Match ${matchId} completed and cleaned up!`)
      } catch (err) {
        console.error(`❌ [Ranked] Error finalizing match:`, err)
      } finally {
        finalizingMatches.delete(matchId)
      }

      const pointChange = playerNum === 1 ? match.player1PointChange : match.player2PointChange

      return res.json({
        success: true,
        status: 'completed',
        winner: match.winner,
        playerNum,
        player1Score: match.player1Score,
        player2Score: match.player2Score,
        player1PointChange: match.player1PointChange,
        player2PointChange: match.player2PointChange,
        pointChange
      })
    }

    // Not complete yet - continue to next question
    res.json({
      success: true,
      status: 'continue',
      currentQuestion: match.currentQuestion,
      player1Score: match.player1Score,
      player2Score: match.player2Score
    })
  } catch (error) {
    console.error('Error in next question:', error)
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

// Clear all ranked data (admin endpoint)
router.post('/admin/clear', async (req, res) => {
  try {
    console.log('🧹 [Ranked] Clearing all ranked data...')
    
    // Clear in-memory data
    const queueCount = matchmakingQueue.size
    const matchCount = activeMatches.size
    const pendingCount = pendingMatches.size
    
    matchmakingQueue.clear()
    activeMatches.clear()
    pendingMatches.clear()
    finalizingMatches.clear()
    
    // Optionally clear MongoDB matches (uncomment if needed)
    // await Match.deleteMany({ status: { $ne: 'completed' } })
    
    console.log(`🧹 [Ranked] Cleared: ${queueCount} queues, ${matchCount} matches, ${pendingCount} pending`)
    
    res.json({
      success: true,
      message: 'All ranked data cleared',
      cleared: {
        queues: queueCount,
        activeMatches: matchCount,
        pendingMatches: pendingCount
      }
    })
  } catch (error) {
    console.error('Error clearing ranked data:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Clear all user ranks (reset all points and stats)
router.post('/admin/clear-ranks', async (req, res) => {
  try {
    console.log('🧹 [Ranked] Clearing all user ranks...')
    
    // DELETE ALL UserRank documents - this removes all ranks, points, stats, and leaderboard data
    const deleteResult = await UserRank.deleteMany({})
    
    console.log(`🧹 [Ranked] Deleted ${deleteResult.deletedCount} user rank documents`)
    
    // Also delete all Match documents (match history)
    const matchDeleteResult = await Match.deleteMany({})
    
    console.log(`🧹 [Ranked] Deleted ${matchDeleteResult.deletedCount} match documents`)
    
    // Clear in-memory data as well
    matchmakingQueue.clear()
    activeMatches.clear()
    pendingMatches.clear()
    finalizingMatches.clear()
    
    console.log(`🧹 [Ranked] All ranked data completely deleted`)
    
    res.json({
      success: true,
      message: 'All ranked data completely deleted',
      deleted: {
        userRanks: deleteResult.deletedCount,
        matches: matchDeleteResult.deletedCount
      }
    })
  } catch (error) {
    console.error('Error clearing user ranks:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Forfeit/Exit match
router.post('/match/:matchId/forfeit', async (req, res) => {
  try {
    const { matchId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' })
    }

    // Get match from memory or DB
    let match = activeMatches.get(matchId)
    if (!match) {
      match = await Match.findOne({ matchId })
    }

    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' })
    }

    // Check if match is already completed
    if (match.status === 'completed' || match.status === 'cancelled') {
      return res.json({ success: true, message: 'Match already ended' })
    }

    const playerNum = match.player1.userId === userId ? 1 : 2
    const isPlayer1 = playerNum === 1

    console.log(`🚪 [Ranked] Player ${playerNum} (${userId}) forfeiting match ${matchId}`)

    // Determine winner (opponent wins)
    const winner = isPlayer1 ? 'player2' : 'player1'
    match.winner = winner
    match.status = 'cancelled'
    match.completedAt = new Date()

    // Calculate point changes
    const pointRules = POINT_RULES[match.difficulty]
    
    // Forfeiter loses points (lose is already negative in POINT_RULES)
    if (isPlayer1) {
      match.player1PointChange = pointRules.lose // Already negative
    } else {
      match.player2PointChange = pointRules.lose // Already negative
    }

    // Opponent wins points (if not bot)
    if (!match.player2.isBot) {
      if (isPlayer1) {
        match.player2PointChange = pointRules.win
      } else {
        match.player1PointChange = pointRules.win
      }
    } else {
      // Bot doesn't get points
      if (isPlayer1) {
        match.player2PointChange = 0
      } else {
        match.player1PointChange = 0
      }
    }

    // Update ranks
    try {
      // Update forfeiter's rank (lose)
      let forfeiterRank = await UserRank.findOne({ userId: isPlayer1 ? match.player1.userId : match.player2.userId })
      if (!forfeiterRank) {
        forfeiterRank = new UserRank({ 
          userId: isPlayer1 ? match.player1.userId : match.player2.userId,
          userName: isPlayer1 ? match.player1.userName : match.player2.userName
        })
      }
      forfeiterRank.updateAfterMatch(match.subject, match.difficulty, false, false)
      await forfeiterRank.save()

      // Update opponent's rank (win, if not bot)
      if (!match.player2.isBot) {
        const opponentId = isPlayer1 ? match.player2.userId : match.player1.userId
        let opponentRank = await UserRank.findOne({ userId: opponentId })
        if (!opponentRank) {
          opponentRank = new UserRank({ 
            userId: opponentId,
            userName: isPlayer1 ? match.player2.userName : match.player1.userName
          })
        }
        opponentRank.updateAfterMatch(match.subject, match.difficulty, true, false)
        await opponentRank.save()
      }
    } catch (rankError) {
      console.error('Error updating ranks on forfeit:', rankError)
    }

    // IMPORTANT: Delete match from database completely (not just mark as cancelled)
    try {
      await Match.deleteOne({ matchId })
      console.log(`🗑️ [Ranked] Match ${matchId} deleted from database`)
    } catch (deleteError) {
      console.error('Error deleting match from DB:', deleteError)
      // Still continue even if delete fails
    }

    // Remove from active matches and pending matches IMMEDIATELY
    activeMatches.delete(matchId)
    pendingMatches.delete(match.player1.userId)
    pendingMatches.delete(match.player2.userId)

    console.log(`✅ [Ranked] Match ${matchId} forfeited and deleted. Winner: ${winner}`)

    res.json({
      success: true,
      message: 'Match forfeited and deleted',
      winner,
      player1PointChange: match.player1PointChange,
      player2PointChange: match.player2PointChange
    })
  } catch (error) {
    console.error('Error forfeiting match:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get queue count for UI display
router.get('/queue/count', (req, res) => {
  try {
    const { subject, difficulty } = req.query
    
    let totalInQueue = 0
    let totalInMatches = 0
    const queueCounts = {}
    
    for (const [key, queue] of matchmakingQueue) {
      queueCounts[key] = queue.length
      totalInQueue += queue.length
      
      // If specific subject/difficulty requested
      if (subject && difficulty && key === `${subject}_${difficulty}`) {
        return res.json({
          success: true,
          count: queue.length,
          key
        })
      }
    }
    
    totalInMatches = activeMatches.size * 2 // 2 players per match
    
    res.json({
      success: true,
      totalInQueue,
      totalInMatches,
      totalOnline: totalInQueue + totalInMatches,
      queueCounts
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Debug endpoint - view queue status
router.get('/debug/queue', async (req, res) => {
  try {
    const queueStatus = {}
    for (const [key, queue] of matchmakingQueue) {
      queueStatus[key] = queue.map(p => ({
        userId: p.userId,
        userName: p.userName,
        tier: p.tier,
        waitTime: Date.now() - p.joinedAt
      }))
    }

    const pendingMatchList = {}
    for (const [userId, matchId] of pendingMatches) {
      pendingMatchList[userId] = matchId
    }

    const activeMatchList = []
    for (const [matchId, match] of activeMatches) {
      activeMatchList.push({
        matchId,
        player1: match.player1.userName,
        player2: match.player2.userName,
        status: match.status,
        currentQuestion: match.currentQuestion
      })
    }

    res.json({
      success: true,
      queues: queueStatus,
      pendingMatches: pendingMatchList,
      activeMatches: activeMatchList
    })
  } catch (error) {
    console.error('Error getting debug info:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router

