const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

// Get user's current limits and usage
export const getUserLimits = async (userId) => {
  try {
    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    
    const response = await fetch(`${API_BASE_URL}/limits/${userId}?timezone=${encodeURIComponent(timezone)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        limits: result.limits,
        usage: result.usage,
        remaining: result.remaining,
        hasStudiplyPass: result.hasStudiplyPass,
        date: result.date,
        timezone: result.timezone
      }
    } else {
      return {
        success: false,
        error: result.error || 'Failed to get user limits'
      }
    }
  } catch (error) {
    console.error('Error getting user limits:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}

// Check if user can perform an action
export const checkLimit = async (userId, type) => {
  try {
    const limits = await getUserLimits(userId)
    
    if (!limits.success) {
      return {
        success: false,
        canPerform: false,
        error: limits.error
      }
    }

    const { remaining, hasStudiplyPass } = limits

    if (type === 'sessionRequest') {
      const canPerform = hasStudiplyPass || remaining.sessionRequests > 0
      return {
        success: true,
        canPerform,
        remaining: remaining.sessionRequests,
        hasStudiplyPass
      }
    } else if (type === 'videoCall') {
      const canPerform = remaining.videoCalls > 0
      return {
        success: true,
        canPerform,
        remaining: remaining.videoCalls,
        hasStudiplyPass
      }
    }

    return {
      success: false,
      canPerform: false,
      error: 'Invalid action type'
    }
  } catch (error) {
    console.error('Error checking limit:', error)
    return {
      success: false,
      canPerform: false,
      error: 'Network error. Please try again.'
    }
  }
}

// Increment usage counter
export const incrementUsage = async (userId, type) => {
  try {
    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    
    const response = await fetch(`${API_BASE_URL}/limits/${userId}/increment?timezone=${encodeURIComponent(timezone)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type
      })
    })

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        usage: result.usage,
        remaining: result.remaining,
        hasStudiplyPass: result.hasStudiplyPass
      }
    } else {
      return {
        success: false,
        error: result.error || 'Failed to increment usage',
        limit: result.limit
      }
    }
  } catch (error) {
    console.error('Error incrementing usage:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}

// Subscribe to limits changes (polling every minute)
export const subscribeToLimits = (userId, callback) => {
  let intervalId = null
  let lastData = null

  const fetchLimits = async () => {
    const result = await getUserLimits(userId)
    if (result.success) {
      // Only call callback if data changed
      const dataString = JSON.stringify(result)
      if (dataString !== JSON.stringify(lastData)) {
        lastData = result
        callback(result)
      }
    }
  }

  // Fetch immediately
  fetchLimits()

  // Then fetch every minute
  intervalId = setInterval(fetchLimits, 60000)

  // Return unsubscribe function
  return () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}

