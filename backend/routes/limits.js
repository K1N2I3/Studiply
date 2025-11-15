import express from 'express'
import UserLimits from '../models/userLimits.js'
import admin from 'firebase-admin'

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'study-hub-1297a',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
  }
}

const db = admin.firestore()

const router = express.Router()

// Get current date in user's timezone (YYYY-MM-DD format)
const getCurrentDate = (timezone = 'UTC') => {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  const parts = formatter.formatToParts(now)
  const year = parts.find(p => p.type === 'year').value
  const month = parts.find(p => p.type === 'month').value
  const day = parts.find(p => p.type === 'day').value
  return `${year}-${month}-${day}`
}

// Get user's subscription status from Firestore
const getUserSubscriptionStatus = async (userId) => {
  try {
    const userRef = db.collection('users').doc(userId)
    const userDoc = await userRef.get()
    
    if (userDoc.exists) {
      const userData = userDoc.data()
      return {
        hasStudiplyPass: userData.hasStudiplyPass || false,
        subscription: userData.subscription || null
      }
    }
    
    return { hasStudiplyPass: false, subscription: null }
  } catch (error) {
    console.error('Error getting user subscription:', error)
    return { hasStudiplyPass: false, subscription: null }
  }
}

// Get or create user limits for today
const getOrCreateUserLimits = async (userId, timezone) => {
  const currentDate = getCurrentDate(timezone)
  
  let userLimits = await UserLimits.findOne({ userId, date: currentDate })
  
  if (!userLimits) {
    // Check if we need to reset (different date)
    const lastLimits = await UserLimits.findOne({ userId }).sort({ date: -1 })
    
    if (lastLimits && lastLimits.date !== currentDate) {
      // Reset counters for new day
      userLimits = new UserLimits({
        userId,
        date: currentDate,
        sessionRequests: 0,
        videoCalls: 0,
        lastResetDate: currentDate
      })
    } else {
      // First time creating limits
      userLimits = new UserLimits({
        userId,
        date: currentDate,
        sessionRequests: 0,
        videoCalls: 0,
        lastResetDate: currentDate
      })
    }
    
    await userLimits.save()
  } else {
    // Check if date changed (timezone change or day rollover)
    if (userLimits.date !== currentDate) {
      userLimits.sessionRequests = 0
      userLimits.videoCalls = 0
      userLimits.date = currentDate
      userLimits.lastResetDate = currentDate
      await userLimits.save()
    }
  }
  
  return userLimits
}

// Get current limits and usage
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const timezone = req.query.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      })
    }

    const subscription = await getUserSubscriptionStatus(userId)
    const userLimits = await getOrCreateUserLimits(userId, timezone)
    
    // Determine limits based on subscription
    const limits = {
      sessionRequests: subscription.hasStudiplyPass ? Infinity : 3,
      videoCalls: subscription.hasStudiplyPass ? 3 : 1
    }
    
    const usage = {
      sessionRequests: userLimits.sessionRequests,
      videoCalls: userLimits.videoCalls
    }
    
    const remaining = {
      sessionRequests: subscription.hasStudiplyPass 
        ? Infinity 
        : Math.max(0, limits.sessionRequests - usage.sessionRequests),
      videoCalls: Math.max(0, limits.videoCalls - usage.videoCalls)
    }
    
    res.json({
      success: true,
      limits,
      usage,
      remaining,
      hasStudiplyPass: subscription.hasStudiplyPass,
      date: userLimits.date,
      timezone
    })
  } catch (error) {
    console.error('Error getting user limits:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get user limits'
    })
  }
})

// Increment usage counter
router.post('/:userId/increment', async (req, res) => {
  try {
    const { userId } = req.params
    const { type } = req.body // 'sessionRequest' or 'videoCall'
    const timezone = req.query.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    
    if (!userId || !type) {
      return res.status(400).json({
        success: false,
        error: 'User ID and type are required'
      })
    }

    if (type !== 'sessionRequest' && type !== 'videoCall') {
      return res.status(400).json({
        success: false,
        error: 'Type must be "sessionRequest" or "videoCall"'
      })
    }

    const subscription = await getUserSubscriptionStatus(userId)
    const userLimits = await getOrCreateUserLimits(userId, timezone)
    
    // Check limits before incrementing
    const limits = {
      sessionRequests: subscription.hasStudiplyPass ? Infinity : 3,
      videoCalls: subscription.hasStudiplyPass ? 3 : 1
    }
    
    if (type === 'sessionRequest') {
      if (!subscription.hasStudiplyPass && userLimits.sessionRequests >= limits.sessionRequests) {
        return res.status(403).json({
          success: false,
          error: 'Daily session request limit reached',
          limit: limits.sessionRequests
        })
      }
      userLimits.sessionRequests += 1
    } else if (type === 'videoCall') {
      if (userLimits.videoCalls >= limits.videoCalls) {
        return res.status(403).json({
          success: false,
          error: 'Daily video call limit reached',
          limit: limits.videoCalls
        })
      }
      userLimits.videoCalls += 1
    }
    
    await userLimits.save()
    
    const remaining = {
      sessionRequests: subscription.hasStudiplyPass 
        ? Infinity 
        : Math.max(0, limits.sessionRequests - userLimits.sessionRequests),
      videoCalls: Math.max(0, limits.videoCalls - userLimits.videoCalls)
    }
    
    res.json({
      success: true,
      usage: {
        sessionRequests: userLimits.sessionRequests,
        videoCalls: userLimits.videoCalls
      },
      remaining,
      hasStudiplyPass: subscription.hasStudiplyPass
    })
  } catch (error) {
    console.error('Error incrementing usage:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to increment usage'
    })
  }
})

export default router

