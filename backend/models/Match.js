import mongoose from 'mongoose'

// Question schema for match
const MatchQuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  player1Answer: {
    type: Number,
    default: -1 // -1 means not answered
  },
  player1AnswerTime: {
    type: Number // milliseconds
  },
  player2Answer: {
    type: Number,
    default: -1
  },
  player2AnswerTime: {
    type: Number
  }
}, { _id: false })

// Match schema
const MatchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Match settings
  subject: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  // Players
  player1: {
    userId: { type: String, required: true },
    userName: { type: String, default: 'Player 1' },
    userAvatar: String,
    tier: { type: String, default: 'BRONZE' },
    points: { type: Number, default: 0 }
  },
  player2: {
    userId: { type: String, required: true },
    userName: { type: String, default: 'Player 2' },
    userAvatar: String,
    tier: { type: String, default: 'BRONZE' },
    points: { type: Number, default: 0 },
    isBot: { type: Boolean, default: false }
  },
  // Match state
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  currentQuestion: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 5
  },
  // Questions
  questions: {
    type: [MatchQuestionSchema],
    default: []
  },
  // Scores
  player1Score: {
    type: Number,
    default: 0
  },
  player2Score: {
    type: Number,
    default: 0
  },
  // Result
  winner: {
    type: String, // 'player1', 'player2', or 'draw'
    default: null
  },
  // Point changes
  player1PointChange: {
    type: Number,
    default: 0
  },
  player2PointChange: {
    type: Number,
    default: 0
  },
  // Timing
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  questionStartedAt: {
    type: Date
  },
  timePerQuestion: {
    type: Number,
    default: 15000 // 15 seconds
  }
}, {
  timestamps: true
})

// Index for querying user matches
MatchSchema.index({ 'player1.userId': 1, createdAt: -1 })
MatchSchema.index({ 'player2.userId': 1, createdAt: -1 })
MatchSchema.index({ subject: 1, status: 1 })

// Record player answer
MatchSchema.methods.recordAnswer = function(playerNum, questionIndex, answer, timeMs) {
  if (questionIndex < 0 || questionIndex >= this.questions.length) {
    return { success: false, error: 'Invalid question index' }
  }
  
  const question = this.questions[questionIndex]
  
  if (playerNum === 1) {
    if (question.player1Answer !== -1) {
      return { success: false, error: 'Already answered' }
    }
    question.player1Answer = answer
    question.player1AnswerTime = timeMs
    if (answer === question.correctAnswer) {
      this.player1Score++
    }
  } else {
    if (question.player2Answer !== -1) {
      return { success: false, error: 'Already answered' }
    }
    question.player2Answer = answer
    question.player2AnswerTime = timeMs
    if (answer === question.correctAnswer) {
      this.player2Score++
    }
  }
  
  return { 
    success: true, 
    correct: answer === question.correctAnswer,
    correctAnswer: question.correctAnswer
  }
}

// Check if both players answered current question
MatchSchema.methods.bothAnswered = function(questionIndex) {
  if (questionIndex < 0 || questionIndex >= this.questions.length) {
    return false
  }
  const q = this.questions[questionIndex]
  return q.player1Answer !== -1 && q.player2Answer !== -1
}

// Finalize match
MatchSchema.methods.finalize = function() {
  this.status = 'completed'
  this.completedAt = new Date()
  
  if (this.player1Score > this.player2Score) {
    this.winner = 'player1'
  } else if (this.player2Score > this.player1Score) {
    this.winner = 'player2'
  } else {
    this.winner = 'draw'
  }
  
  return this.winner
}

const Match = mongoose.model('Match', MatchSchema)

export default Match

