import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

/**
 * 获取所有用户的排行榜数据
 * @param {string} type - 排行榜类型: 'streak' | 'level' | 'quests'
 * @param {number} topN - 获取前 N 名，默认 100
 * @returns {Promise<Array>} 排行榜数据数组
 */
export const getLeaderboard = async (type = 'streak', topN = 100) => {
  try {
    const studyProgressRef = collection(db, 'studyprogress')
    const allProgressDocs = await getDocs(studyProgressRef)
    
    const leaderboardData = []
    
    // 遍历所有用户进度数据
    for (const progressDoc of allProgressDocs.docs) {
      const progressData = progressDoc.data()
      const userId = progressDoc.id
      
      // 获取用户基本信息
      let userName = 'Anonymous'
      let userAvatar = null
      try {
        const userRef = doc(db, 'users', userId)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          const userData = userDoc.data()
          userName = userData.name || userData.email?.split('@')[0] || 'Anonymous'
          userAvatar = userData.avatar || null
        }
      } catch (error) {
        console.warn(`Failed to fetch user data for ${userId}:`, error)
      }
      
      // 根据类型获取对应的值
      let value = 0
      switch (type) {
        case 'streak':
          value = progressData.currentStreak || 0
          break
        case 'level':
          value = progressData.currentLevel || 1
          break
        case 'quests':
          value = (progressData.completedQuests || []).length
          break
        default:
          value = 0
      }
      
      // 只添加有值的用户
      if (value > 0) {
        leaderboardData.push({
          userId,
          userName,
          userAvatar,
          value,
          // 额外信息
          totalXP: progressData.totalXP || 0,
          gold: progressData.gold || 0
        })
      }
    }
    
    // 按值降序排序
    leaderboardData.sort((a, b) => b.value - a.value)
    
    // 返回前 N 名
    return leaderboardData.slice(0, topN)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

/**
 * 获取用户在排行榜中的排名
 * @param {string} userId - 用户 ID
 * @param {string} type - 排行榜类型: 'streak' | 'level' | 'quests'
 * @returns {Promise<{rank: number, value: number}>} 用户排名和值
 */
export const getUserRank = async (userId, type = 'streak') => {
  try {
    const leaderboard = await getLeaderboard(type, 1000) // 获取更多数据以确保找到用户
    const userIndex = leaderboard.findIndex(item => item.userId === userId)
    
    if (userIndex === -1) {
      return { rank: null, value: 0 }
    }
    
    return {
      rank: userIndex + 1,
      value: leaderboard[userIndex].value
    }
  } catch (error) {
    console.error('Error getting user rank:', error)
    return { rank: null, value: 0 }
  }
}

