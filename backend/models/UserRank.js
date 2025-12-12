import mongoose from 'mongoose'

// Rank tiers configuration
export const RANK_TIERS = {
  BRONZE: { name: 'Bronze', minPoints: 0, maxPoints: 499, icon: '🥉' },
  SILVER: { name: 'Silver', minPoints: 500, maxPoints: 999, icon: '🥈' },
  GOLD: { name: 'Gold', minPoints: 1000, maxPoints: 1499, icon: '🥇' },
  PLATINUM: { name: 'Platinum', minPoints: 1500, maxPoints: 1999, icon: '💎' },
  DIAMOND: { name: 'Diamond', minPoints: 2000, maxPoints: 2499, icon: '💠' },
  MASTER: { name: 'Master', minPoints: 2500, maxPoints: Infinity, icon: '👑' }
}

// Point calculation based on difficulty
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

// Subject rank schema (embedded in UserRank)
const SubjectRankSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  tier: {
    type: String,
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER'],
    default: 'BRONZE'
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  winStreak: {
    type: Number,
    default: 0
  },
  bestWinStreak: {
    type: Number,
    default: 0
  },
  lastMatchAt: {
    type: Date
  }
}, { _id: false })

// Main UserRank schema
const UserRankSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userName: {
    type: String,
    default: 'Unknown Player'
  },
  userAvatar: {
    type: String
  },
  // Overall stats
  totalWins: {
    type: Number,
    default: 0
  },
  totalLosses: {
    type: Number,
    default: 0
  },
  totalMatches: {
    type: Number,
    default: 0
  },
  // Subject-specific ranks
  subjectRanks: {
    type: [SubjectRankSchema],
    default: []
  },
  // Season info
  currentSeason: {
    type: Number,
    default: 1
  },
  seasonHighestTier: {
    type: String,
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER'],
    default: 'BRONZE'
  }
}, {
  timestamps: true
})

// Index for leaderboard queries
UserRankSchema.index({ 'subjectRanks.subject': 1, 'subjectRanks.points': -1 })

// Get or create subject rank
UserRankSchema.methods.getSubjectRank = function(subject) {
  let subjectRank = this.subjectRanks.find(sr => sr.subject === subject)
  if (!subjectRank) {
    subjectRank = {
      subject,
      points: 0,
      tier: 'BRONZE',
      wins: 0,
      losses: 0,
      winStreak: 0,
      bestWinStreak: 0
    }
    this.subjectRanks.push(subjectRank)
  }
  return subjectRank
}

// Update rank after match
UserRankSchema.methods.updateAfterMatch = function(subject, difficulty, won, isDraw = false) {
  const subjectRank = this.getSubjectRank(subject)
  
  // Calculate point change
  let pointChange
  if (isDraw) {
    // In draw, both players get small points (half of win)
    pointChange = Math.floor(POINT_RULES[difficulty].win / 2)
  } else if (won) {
    pointChange = POINT_RULES[difficulty].win
  } else {
    pointChange = POINT_RULES[difficulty].lose
  }
  
  // Update points (minimum 0)
  const oldPoints = subjectRank.points
  subjectRank.points = Math.max(0, subjectRank.points + pointChange)
  
  // Update tier
  const newTier = getTierFromPoints(subjectRank.points)
  const oldTier = subjectRank.tier
  subjectRank.tier = newTier
  
  // Update win/loss stats
  if (isDraw) {
    // Draw doesn't count as win or loss, but resets streak
    subjectRank.winStreak = 0
  } else if (won) {
    subjectRank.wins++
    subjectRank.winStreak++
    if (subjectRank.winStreak > subjectRank.bestWinStreak) {
      subjectRank.bestWinStreak = subjectRank.winStreak
    }
    this.totalWins++
  } else {
    subjectRank.losses++
    subjectRank.winStreak = 0
    this.totalLosses++
  }
  
  subjectRank.lastMatchAt = new Date()
  this.totalMatches++
  
  // Update season highest tier
  const tierOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER']
  if (tierOrder.indexOf(newTier) > tierOrder.indexOf(this.seasonHighestTier)) {
    this.seasonHighestTier = newTier
  }
  
  console.log(`📊 [UserRank] ${this.userName} - ${subject}: ${oldPoints} + ${pointChange} = ${subjectRank.points} (${oldTier} -> ${newTier})`)
  
  return {
    pointChange,
    oldPoints,
    newPoints: subjectRank.points,
    oldTier,
    newTier,
    tierChanged: oldTier !== newTier,
    promoted: tierOrder.indexOf(newTier) > tierOrder.indexOf(oldTier)
  }
}

const UserRank = mongoose.model('UserRank', UserRankSchema)

export default UserRank

