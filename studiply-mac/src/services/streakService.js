import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Get user's streak data from Firebase
 */
export async function getUserStreak(userId) {
  try {
    const streakRef = doc(db, 'streaks', userId)
    const streakDoc = await getDoc(streakRef)
    
    if (streakDoc.exists()) {
      const data = streakDoc.data()
      return {
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        lastActiveDate: data.lastActiveDate || null,
      }
    }
    
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    }
  } catch (error) {
    console.error('Error fetching streak:', error)
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    }
  }
}

/**
 * Get user's study progress from Firebase
 */
export async function getUserProgress(userId) {
  try {
    const progressRef = doc(db, 'studyprogress', userId)
    const progressDoc = await getDoc(progressRef)
    
    if (progressDoc.exists()) {
      const data = progressDoc.data()
      return {
        totalXP: data.totalXP || 0,
        currentLevel: data.currentLevel || 1,
        completedQuests: data.completedQuests?.length || 0,
        focusTime: data.focusTime || 0,
      }
    }
    
    return {
      totalXP: 0,
      currentLevel: 1,
      completedQuests: 0,
      focusTime: 0,
    }
  } catch (error) {
    console.error('Error fetching progress:', error)
    return {
      totalXP: 0,
      currentLevel: 1,
      completedQuests: 0,
      focusTime: 0,
    }
  }
}

