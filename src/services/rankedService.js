/**
 * Ranked Mode Service
 * Handles all ranked mode API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

// Rank tier configuration (must match backend)
export const RANK_TIERS = {
  BRONZE: { name: 'Bronze', minPoints: 0, maxPoints: 499, color: '#CD7F32', iconName: 'Shield' },
  SILVER: { name: 'Silver', minPoints: 500, maxPoints: 999, color: '#C0C0C0', iconName: 'Medal' },
  GOLD: { name: 'Gold', minPoints: 1000, maxPoints: 1499, color: '#FFD700', iconName: 'Trophy' },
  PLATINUM: { name: 'Platinum', minPoints: 1500, maxPoints: 1999, color: '#40E0D0', iconName: 'Gem' },
  DIAMOND: { name: 'Diamond', minPoints: 2000, maxPoints: 2499, color: '#B9F2FF', iconName: 'Diamond' },
  MASTER: { name: 'Master', minPoints: 2500, maxPoints: Infinity, color: '#FFD700', iconName: 'Crown' }
}

// Point rules
export const POINT_RULES = {
  easy: { win: 15, lose: -25 },
  medium: { win: 20, lose: -20 },
  hard: { win: 30, lose: -10 }
}

// Get tier from points
export const getTierFromPoints = (points) => {
  if (points >= 2500) return 'MASTER'
  if (points >= 2000) return 'DIAMOND'
  if (points >= 1500) return 'PLATINUM'
  if (points >= 1000) return 'GOLD'
  if (points >= 500) return 'SILVER'
  return 'BRONZE'
}

// Calculate progress to next tier
export const getProgressToNextTier = (points) => {
  const tier = getTierFromPoints(points)
  const tierInfo = RANK_TIERS[tier]
  
  if (tier === 'MASTER') {
    return { progress: 100, pointsToNext: 0, nextTier: null }
  }
  
  const tierKeys = Object.keys(RANK_TIERS)
  const currentIndex = tierKeys.indexOf(tier)
  const nextTier = tierKeys[currentIndex + 1]
  const nextTierInfo = RANK_TIERS[nextTier]
  
  const pointsInTier = points - tierInfo.minPoints
  const tierRange = tierInfo.maxPoints - tierInfo.minPoints + 1
  const progress = Math.min(100, (pointsInTier / tierRange) * 100)
  const pointsToNext = nextTierInfo.minPoints - points
  
  return { progress, pointsToNext, nextTier }
}

/**
 * Get user's overall rank status
 */
export const getRankStatus = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/status/${userId}`)
    const result = await response.json()
    
    if (response.ok && result.success) {
      return { success: true, rank: result.rank }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error getting rank status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get user's rank for specific subject
 */
export const getSubjectRank = async (userId, subject) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/status/${userId}/${subject}`)
    const result = await response.json()
    
    if (response.ok && result.success) {
      return { success: true, subjectRank: result.subjectRank }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error getting subject rank:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Join matchmaking queue
 */
export const joinQueue = async ({ userId, userName, userAvatar, subject, difficulty }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName, userAvatar, subject, difficulty })
    })
    const result = await response.json()
    
    if (response.ok && result.success) {
      return { 
        success: true, 
        status: result.status,
        matchId: result.matchId,
        opponent: result.opponent,
        queuePosition: result.queuePosition
      }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error joining queue:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check queue status / poll for match
 */
export const checkQueueStatus = async ({ userId, subject, difficulty, tier }) => {
  try {
    const params = new URLSearchParams({ subject, difficulty, tier })
    const response = await fetch(`${API_BASE_URL}/ranked/queue/status/${userId}?${params}`)
    const result = await response.json()
    
    if (response.ok && result.success) {
      return {
        success: true,
        status: result.status,
        matchId: result.matchId,
        opponent: result.opponent,
        waitTime: result.waitTime,
        queuePosition: result.queuePosition
      }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error checking queue status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Leave matchmaking queue
 */
export const leaveQueue = async ({ userId, subject, difficulty, tier }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/queue/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subject, difficulty, tier })
    })
    const result = await response.json()
    return { success: result.success }
  } catch (error) {
    console.error('Error leaving queue:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get match state
 */
export const getMatch = async (matchId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/match/${matchId}?userId=${userId}`)
    const result = await response.json()
    
    if (response.ok && result.success) {
      return { success: true, match: result.match }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error getting match:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Start match
 */
export const startMatch = async (matchId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/match/${matchId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    return { success: result.success, status: result.status }
  } catch (error) {
    console.error('Error starting match:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Submit answer
 */
export const submitAnswer = async ({ matchId, userId, questionIndex, answer, answerTime }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/match/${matchId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, questionIndex, answer, answerTime })
    })
    const result = await response.json()
    
    if (response.ok && result.success) {
      return {
        success: true,
        correct: result.correct,
        correctAnswer: result.correctAnswer,
        player1Score: result.player1Score,
        player2Score: result.player2Score,
        bothAnswered: result.bothAnswered
      }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error submitting answer:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Move to next question
 */
export const nextQuestion = async (matchId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/match/${matchId}/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    
    if (response.ok && result.success) {
      return {
        success: true,
        status: result.status,
        currentQuestion: result.currentQuestion,
        winner: result.winner,
        player1Score: result.player1Score,
        player2Score: result.player2Score,
        player1PointChange: result.player1PointChange,
        player2PointChange: result.player2PointChange,
        player1NewRank: result.player1NewRank
      }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error moving to next question:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get match result
 */
export const getMatchResult = async (matchId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/match/${matchId}/result?userId=${userId}`)
    const result = await response.json()
    
    if (response.ok && result.success) {
      return { success: true, result: result.result }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error getting match result:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get leaderboard
 */
export const getLeaderboard = async (subject, limit = 100) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ranked/leaderboard/${subject}?limit=${limit}`)
    const result = await response.json()
    
    if (response.ok && result.success) {
      return { success: true, leaderboard: result.leaderboard, subject: result.subject }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get match history
 */
export const getMatchHistory = async (userId, subject = null, limit = 20) => {
  try {
    let url = `${API_BASE_URL}/ranked/history/${userId}?limit=${limit}`
    if (subject) {
      url += `&subject=${subject}`
    }
    
    const response = await fetch(url)
    const result = await response.json()
    
    if (response.ok && result.success) {
      return { success: true, history: result.history }
    }
    return { success: false, error: result.error }
  } catch (error) {
    console.error('Error getting match history:', error)
    return { success: false, error: error.message }
  }
}

export default {
  RANK_TIERS,
  POINT_RULES,
  getTierFromPoints,
  getProgressToNextTier,
  getRankStatus,
  getSubjectRank,
  joinQueue,
  checkQueueStatus,
  leaveQueue,
  getMatch,
  startMatch,
  submitAnswer,
  nextQuestion,
  getMatchResult,
  getLeaderboard,
  getMatchHistory
}

