import mongoose from 'mongoose'

const userLimitsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true,
    index: true
  },
  sessionRequests: {
    type: Number,
    default: 0
  },
  videoCalls: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Compound index for efficient queries
userLimitsSchema.index({ userId: 1, date: 1 }, { unique: true })

// Update the updatedAt field before saving
userLimitsSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const UserLimits = mongoose.model('UserLimits', userLimitsSchema)

export default UserLimits

