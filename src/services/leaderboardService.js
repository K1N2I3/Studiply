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
    console.log(`📊 Fetching leaderboard for type: ${type}`)
    
    // 先从 users 集合获取所有用户
    const usersRef = collection(db, 'users')
    const allUsersDocs = await getDocs(usersRef)
    console.log(`👥 Found ${allUsersDocs.docs.length} users`)
    
    const leaderboardData = []
    
    // 遍历所有用户
    for (const userDoc of allUsersDocs.docs) {
      const userData = userDoc.data()
      const userId = userDoc.id
      
      // 跳过被封禁的用户
      if (userData.banned === true) {
        continue
      }
      
      // 获取用户基本信息
      const userName = userData.name || userData.email?.split('@')[0] || 'Anonymous'
      const userAvatar = userData.avatar || null
      
      // 获取用户的进度数据
      let progressData = {}
      try {
        const progressRef = doc(db, 'studyprogress', userId)
        const progressDoc = await getDoc(progressRef)
        if (progressDoc.exists()) {
          progressData = progressDoc.data()
        }
      } catch (error) {
        console.warn(`Failed to fetch progress for user ${userId}:`, error)
      }
      
      // 根据类型获取对应的值
      let value = 0
      switch (type) {
        case 'streak':
          value = progressData.currentStreak || 0
          break
        case 'level':
          value = progressData.currentLevel || 1 // 默认等级为 1
          break
        case 'quests':
          value = (progressData.completedQuests || []).length
          break
        default:
          value = 0
      }
      
      // 添加所有用户（包括值为 0 的）
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
    
    console.log(`📈 Processed ${leaderboardData.length} users for leaderboard`)
    
    // 按值降序排序
    leaderboardData.sort((a, b) => b.value - a.value)
    
    // 返回前 N 名
    const result = leaderboardData.slice(0, topN)
    console.log(`✅ Returning top ${result.length} users`)
    return result
  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error)
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

