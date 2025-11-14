import { doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

// 在线状态阈值（毫秒）- 30秒内活跃算在线（非常灵敏）
const ONLINE_THRESHOLD = 30 * 1000 // 30秒

/**
 * 更新用户的最后活跃时间
 */
export const updateUserPresence = async (userId) => {
  if (!userId) return

  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      lastSeen: serverTimestamp(),
      isOnline: true
    })
  } catch (error) {
    console.error('Error updating user presence:', error)
  }
}

/**
 * 检查用户是否在线
 * @param {Object} userData - 用户数据对象
 * @returns {boolean} - 是否在线
 */
export const isUserOnline = (userData) => {
  if (!userData) return false
  
  // 如果明确标记为在线，直接返回true
  if (userData.isOnline === true) {
    return true
  }
  
  // 如果明确标记为离线，立即返回false（更快响应离线状态）
  if (userData.isOnline === false) {
    // 但是，如果lastSeen非常新（10秒内），可能是网络延迟，仍然认为在线
    if (userData.lastSeen) {
      const lastSeenTime = userData.lastSeen?.toDate ? userData.lastSeen.toDate() : new Date(userData.lastSeen)
      const now = new Date()
      const timeDiff = now - lastSeenTime
      
      // 如果lastSeen在10秒内，可能是网络延迟，仍然认为在线
      if (timeDiff < 10 * 1000) {
        return true
      }
    }
    return false
  }
  
  // 如果没有isOnline标记，根据lastSeen判断
  if (userData.lastSeen) {
    const lastSeenTime = userData.lastSeen?.toDate ? userData.lastSeen.toDate() : new Date(userData.lastSeen)
    const now = new Date()
    const timeDiff = now - lastSeenTime
    
    return timeDiff < ONLINE_THRESHOLD
  }
  
  return false
}

/**
 * 监听用户在线状态变化
 * @param {string} userId - 用户ID
 * @param {Function} callback - 回调函数，接收 (isOnline, lastSeen) 参数
 * @returns {Function} - 清理函数
 */
export const listenToUserPresence = (userId, callback) => {
  if (!userId) return () => {}

  const userRef = doc(db, 'users', userId)
  
  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.data()
      const online = isUserOnline(userData)
      callback(online, userData.lastSeen)
    } else {
      callback(false, null)
    }
  }, (error) => {
    console.error('Error listening to user presence:', error)
    callback(false, null)
  })

  return unsubscribe
}

/**
 * 初始化在线状态更新（定期更新 + 用户活动监听）
 * @param {string} userId - 用户ID
 * @returns {Function} - 清理函数
 */
export const initPresenceUpdates = (userId) => {
  if (!userId) return () => {}

  // 立即更新一次
  updateUserPresence(userId)

  // 使用防抖机制，避免过于频繁的更新
  let updateTimeout = null
  let lastUpdateTime = 0
  const MIN_UPDATE_INTERVAL = 2000 // 最小更新间隔2秒
  
  const debouncedUpdate = () => {
    const now = Date.now()
    if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
      // 如果距离上次更新不到2秒，延迟更新
      if (updateTimeout) {
        clearTimeout(updateTimeout)
      }
      updateTimeout = setTimeout(() => {
        updateUserPresence(userId)
        lastUpdateTime = Date.now()
      }, MIN_UPDATE_INTERVAL - (now - lastUpdateTime))
    } else {
      // 立即更新
      updateUserPresence(userId)
      lastUpdateTime = now
    }
  }

  // 每10秒更新一次（非常频繁）
  const interval = setInterval(() => {
    updateUserPresence(userId)
    lastUpdateTime = Date.now()
  }, 10 * 1000)

  // 页面可见性变化时更新
  let hiddenTimeout = null
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // 页面可见时，立即更新并清除隐藏定时器
      if (hiddenTimeout) {
        clearTimeout(hiddenTimeout)
        hiddenTimeout = null
      }
      updateUserPresence(userId)
    } else {
      // 页面隐藏时，延迟标记为离线（给切换标签页的时间）
      if (hiddenTimeout) {
        clearTimeout(hiddenTimeout)
      }
      hiddenTimeout = setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          const userRef = doc(db, 'users', userId)
          updateDoc(userRef, {
            isOnline: false
          }).catch(console.error)
        }
      }, 30000) // 30秒后标记为离线（更快响应）
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // 监听用户活动（鼠标移动、键盘输入、滚动等）- 增加更多事件
  const activityEvents = [
    'mousemove', 
    'mousedown', 
    'mouseup',
    'keypress', 
    'keydown',
    'scroll', 
    'touchstart', 
    'touchmove',
    'click',
    'focus',
    'resize'
  ]
  
  // 使用节流，避免过于频繁
  let activityThrottle = null
  const handleUserActivity = () => {
    if (document.visibilityState === 'visible') {
      if (!activityThrottle) {
        debouncedUpdate()
        activityThrottle = setTimeout(() => {
          activityThrottle = null
        }, 1000) // 1秒内最多触发一次
      }
    }
  }

  activityEvents.forEach(event => {
    window.addEventListener(event, handleUserActivity, { passive: true })
  })

  // 页面卸载时立即标记为离线
  const handleBeforeUnload = () => {
    const userRef = doc(db, 'users', userId)
    // 使用 sendBeacon 或同步方式确保请求发送
    updateDoc(userRef, {
      isOnline: false
    }).catch(console.error)
  }
  window.addEventListener('beforeunload', handleBeforeUnload)

  // 返回清理函数
  return () => {
    clearInterval(interval)
    if (updateTimeout) {
      clearTimeout(updateTimeout)
    }
    if (activityThrottle) {
      clearTimeout(activityThrottle)
    }
    if (hiddenTimeout) {
      clearTimeout(hiddenTimeout)
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('beforeunload', handleBeforeUnload)
    activityEvents.forEach(event => {
      window.removeEventListener(event, handleUserActivity)
    })
    
    // 标记为离线
    const userRef = doc(db, 'users', userId)
    updateDoc(userRef, {
      isOnline: false
    }).catch(console.error)
  }
}

