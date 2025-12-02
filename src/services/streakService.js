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
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]
    
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
        const lastLogin = new Date(lastLoginDate)
        lastLogin.setHours(0, 0, 0, 0)
        const lastLoginStr = lastLogin.toISOString().split('T')[0]
        
        const daysDiff = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 0) {
          // 今天已经登录过了，不更新，也不显示模态框
          return {
            currentStreak,
            longestStreak,
            lastLoginDate,
            isNewStreak: false,
            shouldShowModal: false
          }
        } else if (daysDiff === 1) {
          // 连续登录，增加 streak
          currentStreak += 1
          isNewStreak = true
        } else {
          // 中断了，重置 streak
          currentStreak = 1
          isNewStreak = true
        }
      } else {
        // 第一次登录
        currentStreak = 1
        isNewStreak = true
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
    }
    
    // 保存到 Firebase
    await setDoc(userProgressRef, {
      currentStreak,
      longestStreak,
      lastLoginDate: todayStr,
      updatedAt: new Date().toISOString()
    }, { merge: true })
    
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

