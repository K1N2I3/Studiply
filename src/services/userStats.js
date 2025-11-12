import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  setDoc,
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from '../firebase/config'

// 用户统计数据结构
export const createUserStats = async (userId) => {
  try {
    const statsRef = doc(db, 'userStats', userId)
    const initialStats = {
      studyHours: 0,
      sessionsTutored: 0,
      rating: 0,
      badgesEarned: 0,
      totalRating: 0,
      ratingCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    await setDoc(statsRef, initialStats)
    return { success: true, stats: initialStats }
  } catch (error) {
    console.error('Error creating user stats:', error)
    return { success: false, error: error.message }
  }
}

// 获取用户统计数据
export const getUserStats = async (userId) => {
  try {
    const statsRef = doc(db, 'userStats', userId)
    const statsDoc = await getDoc(statsRef)
    
    if (statsDoc.exists()) {
      const stats = statsDoc.data()
      // 计算平均评分
      const averageRating = stats.ratingCount > 0 ? stats.totalRating / stats.ratingCount : 0
      
      return {
        success: true,
        stats: {
          studyHours: stats.studyHours || 0,
          sessionsTutored: stats.sessionsTutored || 0,
          rating: Math.round(averageRating * 10) / 10, // 保留一位小数
          badgesEarned: stats.badgesEarned || 0
        }
      }
    } else {
      // 如果不存在，创建初始统计
      const result = await createUserStats(userId)
      return result
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return { 
      success: false, 
      stats: { studyHours: 0, sessionsTutored: 0, rating: 0, badgesEarned: 0 },
      error: error.message 
    }
  }
}

// 更新学习时间
export const updateStudyTime = async (userId, hours) => {
  try {
    const statsRef = doc(db, 'userStats', userId)
    await updateDoc(statsRef, {
      studyHours: hours,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating study time:', error)
    return { success: false, error: error.message }
  }
}

// 增加辅导会话数
export const incrementTutoringSessions = async (userId) => {
  try {
    const statsRef = doc(db, 'userStats', userId)
    await updateDoc(statsRef, {
      sessionsTutored: increment(1),
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error incrementing tutoring sessions:', error)
    return { success: false, error: error.message }
  }
}

// 更新评分
export const updateRating = async (userId, newRating) => {
  try {
    const statsRef = doc(db, 'userStats', userId)
    await updateDoc(statsRef, {
      totalRating: increment(newRating),
      ratingCount: increment(1),
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating rating:', error)
    return { success: false, error: error.message }
  }
}

// 增加徽章数
export const incrementBadges = async (userId, count = 1) => {
  try {
    const statsRef = doc(db, 'userStats', userId)
    await updateDoc(statsRef, {
      badgesEarned: increment(count),
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error incrementing badges:', error)
    return { success: false, error: error.message }
  }
}
