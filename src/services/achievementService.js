import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * 检查并解锁成就
 * @param {string} userId - 用户 ID
 * @param {object} userProgress - 当前用户进度数据
 * @returns {Promise<{newAchievements: string[], allAchievements: string[]}>} 新解锁的成就列表和所有成就列表
 */
export const checkAndUnlockAchievements = async (userId, userProgress) => {
  try {
    const currentAchievements = userProgress?.achievements || []
    const newAchievements = []
    
    // 获取当前统计数据
    const totalXP = userProgress?.totalXP || 0
    const currentLevel = userProgress?.currentLevel || 1
    const gold = userProgress?.gold || 0
    const completedQuests = userProgress?.completedQuests || []
    const totalQuests = completedQuests.length
    const currentStreak = userProgress?.currentStreak || 0
    
    // 检查各种成就条件
    const achievementChecks = {
      // 第一个 quest
      'first_quest': totalQuests >= 1,
      
      // 等级成就（注意：这些成就会在升级时自动解锁，但这里也检查以确保同步）
      'level_5': currentLevel >= 5,
      'level_10': currentLevel >= 10,
      'level_20': currentLevel >= 20,
      'level_30': currentLevel >= 30,
      'level_50': currentLevel >= 50,
      
      // Gold 成就
      'gold_1000': gold >= 1000,
      
      // Quest 数量成就
      'quest_master': totalQuests >= 50,
      
      // Streak 成就
      'streak_7': currentStreak >= 7,
      'streak_30': currentStreak >= 30,
    }
    
    // 去重：确保不会重复添加已存在的成就
    const uniqueNewAchievements = newAchievements.filter(id => !currentAchievements.includes(id))
    
    // 检查每个成就
    for (const [achievementId, isUnlocked] of Object.entries(achievementChecks)) {
      // 如果成就已解锁但不在列表中，添加它
      if (isUnlocked && !currentAchievements.includes(achievementId)) {
        newAchievements.push(achievementId)
      }
    }
    
    // 更新当前成就列表（包含新解锁的）
    const updatedAchievements = [...currentAchievements, ...newAchievements]
    
    // 如果有新成就，更新到 Firebase
    if (newAchievements.length > 0) {
      console.log('🎉 New achievements unlocked:', newAchievements)
      
      const userProgressRef = doc(db, 'studyprogress', userId)
      await setDoc(userProgressRef, {
        achievements: updatedAchievements,
        updatedAt: new Date().toISOString()
      }, { merge: true })
    }
    
    return {
      newAchievements,
      allAchievements: updatedAchievements
    }
  } catch (error) {
    console.error('Error checking achievements:', error)
    return {
      newAchievements: [],
      allAchievements: userProgress?.achievements || []
    }
  }
}

/**
 * 获取成就信息
 * @param {string} achievementId - 成就 ID
 * @returns {object|null} 成就信息
 */
export const getAchievementInfo = (achievementId) => {
  const achievementMap = {
    'first_quest': {
      id: 'first_quest',
      name: 'First Steps',
      description: 'Complete your first quest',
      rarity: 'common'
    },
    'level_5': {
      id: 'level_5',
      name: 'Rising Star',
      description: 'Reach level 5',
      rarity: 'common'
    },
    'level_10': {
      id: 'level_10',
      name: 'Experienced Learner',
      description: 'Reach level 10',
      rarity: 'rare'
    },
    'level_20': {
      id: 'level_20',
      name: 'Knowledge Seeker',
      description: 'Reach level 20',
      rarity: 'rare'
    },
    'level_30': {
      id: 'level_30',
      name: 'Master Scholar',
      description: 'Reach level 30',
      rarity: 'epic'
    },
    'level_50': {
      id: 'level_50',
      name: 'Legendary Academic',
      description: 'Reach level 50',
      rarity: 'legendary'
    },
    'gold_1000': {
      id: 'gold_1000',
      name: 'Wealthy Scholar',
      description: 'Accumulate 1000 gold',
      rarity: 'rare'
    },
    'quest_master': {
      id: 'quest_master',
      name: 'Quest Master',
      description: 'Complete 50 quests',
      rarity: 'epic'
    },
    'streak_7': {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      rarity: 'rare'
    },
    'streak_30': {
      id: 'streak_30',
      name: 'Monthly Champion',
      description: 'Maintain a 30-day streak',
      rarity: 'epic'
    }
  }
  
  return achievementMap[achievementId] || null
}

