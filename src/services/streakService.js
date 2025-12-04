import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * 检查并更新用户的登录 streak
 * @param {string} userId - 用户 ID
 * @returns {Promise<{currentStreak: number, longestStreak: number, lastLoginDate: string, isNewStreak: boolean}>}
 */
export const checkAndUpdateStreak = async (userId) => {
  try {
    const userProgressRef = doc(db, 'studyprogress', userId)
    const userProgressDoc = await getDoc(userProgressRef)
    
    // 使用 UTC 日期来避免时区问题
    const today = new Date()
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
    const todayStr = todayUTC.toISOString().split('T')[0]
    
    let currentStreak = 0
    let longestStreak = 0
    let lastLoginDate = null
    let isNewStreak = false
    
    if (userProgressDoc.exists()) {
      const data = userProgressDoc.data()
      currentStreak = data.currentStreak || 0
      longestStreak = data.longestStreak || 0
      lastLoginDate = data.lastLoginDate || null
      
      if (lastLoginDate) {
        // 确保 lastLoginDate 是字符串格式 (YYYY-MM-DD)
        let lastLoginStr = lastLoginDate
        if (lastLoginDate instanceof Date) {
          lastLoginStr = lastLoginDate.toISOString().split('T')[0]
        } else if (typeof lastLoginDate === 'string') {
          // 如果是 ISO 字符串，提取日期部分
          lastLoginStr = lastLoginDate.split('T')[0]
        }
        
        // 直接比较日期字符串，避免时区问题
        if (lastLoginStr === todayStr) {
          // 今天已经登录过了，不更新，也不显示模态框
          console.log('Streak already checked today, skipping update')
          return {
            currentStreak,
            longestStreak,
            lastLoginDate: lastLoginStr,
            isNewStreak: false,
            shouldShowModal: false
          }
        }
        
        // 计算日期差（使用日期字符串比较）
        const lastLoginDateObj = new Date(lastLoginStr + 'T00:00:00Z')
        const todayDateObj = new Date(todayStr + 'T00:00:00Z')
        const daysDiff = Math.floor((todayDateObj - lastLoginDateObj) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1) {
          // 连续登录，增加 streak
          currentStreak += 1
          isNewStreak = true
          console.log(`Streak increased: ${currentStreak} days`)
        } else if (daysDiff > 1) {
          // 中断了，重置 streak
          currentStreak = 1
          isNewStreak = true
          console.log(`Streak reset: ${daysDiff} days gap`)
        } else {
          // daysDiff < 0 或异常情况，不更新
          console.warn(`Unexpected daysDiff: ${daysDiff}, keeping current streak`)
          return {
            currentStreak,
            longestStreak,
            lastLoginDate: lastLoginStr,
            isNewStreak: false,
            shouldShowModal: false
          }
        }
      } else {
        // 第一次登录
        currentStreak = 1
        isNewStreak = true
        console.log('First login, starting streak')
      }
      
      // 更新最长 streak
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }
    } else {
      // 新用户，第一次登录
      currentStreak = 1
      longestStreak = 1
      isNewStreak = true
      console.log('New user, starting streak')
    }
    
    // 保存到 Firebase（只有在需要更新时才保存）
    await setDoc(userProgressRef, {
      currentStreak,
      longestStreak,
      lastLoginDate: todayStr,
      updatedAt: new Date().toISOString()
    }, { merge: true })
    
    console.log(`Streak updated: ${currentStreak} days, lastLoginDate: ${todayStr}`)
    
    return {
      currentStreak,
      longestStreak,
      lastLoginDate: todayStr,
      isNewStreak,
      shouldShowModal: isNewStreak // 只有新 streak 时才显示模态框
    }
  } catch (error) {
    console.error('Error checking streak:', error)
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null,
      isNewStreak: false
    }
  }
}

/**
 * 获取用户的 streak 信息
 * @param {string} userId - 用户 ID
 * @returns {Promise<{currentStreak: number, longestStreak: number, lastLoginDate: string}>}
 */
export const getUserStreak = async (userId) => {
  try {
    const userProgressRef = doc(db, 'studyprogress', userId)
    const userProgressDoc = await getDoc(userProgressRef)
    
    if (userProgressDoc.exists()) {
      const data = userProgressDoc.data()
      return {
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        lastLoginDate: data.lastLoginDate || null
      }
    }
    
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null
    }
  } catch (error) {
    console.error('Error getting user streak:', error)
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null
    }
  }
}

