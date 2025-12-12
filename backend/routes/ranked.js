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

    console.log(`🎮 [Ranked] Queue request from ${userName} (${userId}) for ${subject}/${difficulty}`)

    // Check if user already has a pending match
    if (pendingMatches.has(userId)) {
      const matchId = pendingMatches.get(userId)
      const match = activeMatches.get(matchId)
      if (match) {
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
      } else {
        pendingMatches.delete(userId)
      }
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

    console.log(`📝 [Ranked] Answer submitted: ${matchId}, user ${userId}, Q${questionIndex}, answer ${answer}`)

    let match = activeMatches.get(matchId) || await Match.findOne({ matchId })
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
      console.log(`🤖 [Ranked] Bot answered Q${questionIndex}: ${botResponse.answer}`)
    }

    await match.save()
    activeMatches.set(matchId, match)

    const bothAnswered = match.bothAnswered(questionIndex)
    console.log(`📝 [Ranked] Q${questionIndex} - P1: ${match.questions[questionIndex].player1Answer}, P2: ${match.questions[questionIndex].player2Answer}, bothAnswered: ${bothAnswered}`)

    res.json({
      success: true,
      correct: result.correct,
      correctAnswer: result.correctAnswer,
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

// Next question - sync state and advance if ready
router.post('/match/:matchId/next', async (req, res) => {
  try {
    const { matchId } = req.params
    const { userId, clientQuestionIndex } = req.body

    // Always get fresh from database to avoid stale cache issues
    let match = await Match.findOne({ matchId })
    if (!match) {
      // Try cache as fallback
      match = activeMatches.get(matchId)
      if (!match) {
        return res.status(404).json({ success: false, error: 'Match not found' })
      }
    }
    
    // Update cache
    activeMatches.set(matchId, match)

    const playerNum = match.player1.userId === userId ? 1 : 2
    const serverQ = match.currentQuestion

    console.log(`⏭️ [Ranked] Next from P${playerNum} (${userId.slice(-4)}), serverQ: ${serverQ}, clientQ: ${clientQuestionIndex}`)

    // If match is already completed, just return the result
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

    // If client is behind, tell them to sync
    if (clientQuestionIndex !== undefined && clientQuestionIndex < serverQ) {
      console.log(`🔄 [Ranked] Client behind, telling to sync: client ${clientQuestionIndex} -> server ${serverQ}`)
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

    // Both answered - advance to next question
    // Use atomic update to prevent race condition
    const updateResult = await Match.findOneAndUpdate(
      { matchId, currentQuestion: serverQ },  // Only update if still on same question
      { 
        $inc: { currentQuestion: 1 },
        $set: { questionStartedAt: new Date() }
      },
      { new: true }
    )

    if (updateResult) {
      match = updateResult
      activeMatches.set(matchId, match)
      console.log(`⏭️ [Ranked] Advanced to Q${match.currentQuestion}`)
    } else {
      // Another request already advanced - refetch
      match = await Match.findOne({ matchId })
      activeMatches.set(matchId, match)
    }

    // Check if match is over
    if (match.currentQuestion >= match.totalQuestions) {
      // Use lock to prevent double finalization
      if (finalizingMatches.has(matchId)) {
        // Wait for finalization to complete
        await new Promise(resolve => setTimeout(resolve, 500))
        match = await Match.findOne({ matchId })
      }

      if (match.status !== 'completed') {
        finalizingMatches.add(matchId)
        
        try {
          match.finalize()
          
          const player1Won = match.winner === 'player1'
          const player2Won = match.winner === 'player2'
          const isDraw = match.winner === 'draw'
          
          console.log(`🏆 [Ranked] Match result - P1: ${match.player1Score}, P2: ${match.player2Score}, Winner: ${match.winner}`)
          
          // Update player 1 rank
          let player1Rank = await UserRank.findOne({ userId: match.player1.userId })
          if (!player1Rank) {
            player1Rank = new UserRank({ userId: match.player1.userId, userName: match.player1.userName })
          }
          const p1Result = player1Rank.updateAfterMatch(match.subject, match.difficulty, player1Won, isDraw)
          await player1Rank.save()
          match.player1PointChange = p1Result.pointChange
          console.log(`📊 [Ranked] P1: ${player1Won ? 'WIN' : isDraw ? 'DRAW' : 'LOSS'}, ${p1Result.pointChange > 0 ? '+' : ''}${p1Result.pointChange}`)

          // Update player 2 rank (if not bot)
          if (!match.player2.isBot) {
            let player2Rank = await UserRank.findOne({ userId: match.player2.userId })
            if (!player2Rank) {
              player2Rank = new UserRank({ userId: match.player2.userId, userName: match.player2.userName })
            }
            const p2Result = player2Rank.updateAfterMatch(match.subject, match.difficulty, player2Won, isDraw)
            await player2Rank.save()
            match.player2PointChange = p2Result.pointChange
            console.log(`📊 [Ranked] P2: ${player2Won ? 'WIN' : isDraw ? 'DRAW' : 'LOSS'}, ${p2Result.pointChange > 0 ? '+' : ''}${p2Result.pointChange}`)
          }

          await match.save()
          activeMatches.set(matchId, match)
          
          // Clean up
          pendingMatches.delete(match.player1.userId)
          if (!match.player2.isBot) {
            pendingMatches.delete(match.player2.userId)
          }

          console.log(`🏁 [Ranked] Match ${matchId} completed!`)
        } finally {
          finalizingMatches.delete(matchId)
        }
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

