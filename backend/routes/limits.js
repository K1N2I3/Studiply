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

// Get current week identifier (YYYY-WW format, where WW is week number)
// Week starts on Monday (ISO 8601 standard)
const getCurrentWeek = (timezone = 'UTC') => {
  const now = new Date()
  
  // Get date in user's timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long'
  })
  
  const parts = formatter.formatToParts(now)
  const year = parseInt(parts.find(p => p.type === 'year').value)
  const month = parseInt(parts.find(p => p.type === 'month').value)
  const day = parseInt(parts.find(p => p.type === 'day').value)
  
  // Create a date object for the user's timezone
  // Note: We need to work with UTC and adjust for timezone offset
  const utcDate = new Date(Date.UTC(year, month - 1, day))
  const tzOffset = now.getTimezoneOffset() * 60000
  const localDate = new Date(utcDate.getTime() - tzOffset)
  
  // Get the Monday of the current week
  const dayOfWeek = localDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Sunday = 0, so offset by -6
  const monday = new Date(localDate)
  monday.setDate(localDate.getDate() + mondayOffset)
  
  // Get the first Monday of the year
  const yearStart = new Date(year, 0, 1)
  const firstMonday = new Date(yearStart)
  const firstMondayOffset = yearStart.getDay() === 0 ? -6 : 1 - yearStart.getDay()
  firstMonday.setDate(yearStart.getDate() + firstMondayOffset)
  
  // Calculate week number
  const weekNumber = Math.floor((monday - firstMonday) / (7 * 24 * 60 * 60 * 1000)) + 1
  
  return `${year}-W${String(weekNumber).padStart(2, '0')}`
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

// Get or create user limits for today (for session requests - daily)
const getOrCreateUserLimits = async (userId, timezone) => {
  const currentDate = getCurrentDate(timezone)
  const currentWeek = getCurrentWeek(timezone)
  
  let userLimits = await UserLimits.findOne({ userId, date: currentDate })
  
  if (!userLimits) {
    // Check if we need to reset (different date)
    const lastLimits = await UserLimits.findOne({ userId }).sort({ date: -1 })
    
    if (lastLimits && lastLimits.date !== currentDate) {
      // Reset sessionRequests for new day, but keep videoCalls if same week
      const lastWeek = lastLimits.week || getCurrentWeek(timezone)
      const videoCalls = (lastWeek === currentWeek) ? (lastLimits.videoCalls || 0) : 0
      
      userLimits = new UserLimits({
        userId,
        date: currentDate,
        week: currentWeek,
        sessionRequests: 0,
        videoCalls: videoCalls,
        lastResetDate: currentDate
      })
    } else {
      // First time creating limits
      userLimits = new UserLimits({
        userId,
        date: currentDate,
        week: currentWeek,
        sessionRequests: 0,
        videoCalls: 0,
        lastResetDate: currentDate
      })
    }
    
    await userLimits.save()
  } else {
    // Check if date changed (timezone change or day rollover)
    if (userLimits.date !== currentDate) {
      // Reset sessionRequests for new day
      userLimits.sessionRequests = 0
      userLimits.date = currentDate
      userLimits.lastResetDate = currentDate
      
      // Check if week changed, reset videoCalls if new week
      if (userLimits.week !== currentWeek) {
        userLimits.videoCalls = 0
        userLimits.week = currentWeek
      }
      
      await userLimits.save()
    } else if (userLimits.week !== currentWeek) {
      // Week changed but same day (shouldn't happen, but handle it)
      userLimits.videoCalls = 0
      userLimits.week = currentWeek
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
    // Video calls: weekly limits based on subscription tier
    let videoCallLimit = 1 // Default: no pass
    if (subscription.hasStudiplyPass) {
      if (subscription.subscription === 'pro') {
        videoCallLimit = Infinity // Pro: unlimited
      } else {
        videoCallLimit = 3 // Basic: 3 per week
      }
    }
    
    const limits = {
      sessionRequests: subscription.hasStudiplyPass ? Infinity : 3, // Daily limit
      videoCalls: videoCallLimit // Weekly limit
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
    // Video calls: weekly limits based on subscription tier
    let videoCallLimit = 1 // Default: no pass
    if (subscription.hasStudiplyPass) {
      if (subscription.subscription === 'pro') {
        videoCallLimit = Infinity // Pro: unlimited
      } else {
        videoCallLimit = 3 // Basic: 3 per week
      }
    }
    
    const limits = {
      sessionRequests: subscription.hasStudiplyPass ? Infinity : 3, // Daily limit
      videoCalls: videoCallLimit // Weekly limit
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
      // For Pro users, videoCallLimit is Infinity, so they can always make calls
      if (videoCallLimit !== Infinity && userLimits.videoCalls >= limits.videoCalls) {
        return res.status(403).json({
          success: false,
          error: 'Weekly video call limit reached',
          limit: limits.videoCalls
        })
      }
      // Only increment if not unlimited
      if (videoCallLimit !== Infinity) {
        userLimits.videoCalls += 1
      }
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

