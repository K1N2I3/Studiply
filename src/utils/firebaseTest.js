import { db } from '../firebase/config'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// 测试Firebase连接和数据保存
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...')
    
    // 测试保存数据
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase test successful'
    }
    
    const testRef = doc(db, 'test', 'connection-test')
    console.log('Saving test data to Firebase...')
    await setDoc(testRef, testData)
    console.log('Test data saved successfully!')
    
    // 验证数据是否保存成功
    const savedDoc = await getDoc(testRef)
    if (savedDoc.exists()) {
      console.log('Verification successful:', savedDoc.data())
      return true
    } else {
      console.log('Verification failed: Document not found')
      return false
    }
  } catch (error) {
    console.error('Firebase test failed:', error)
    return false
  }
}

// 测试用户进度保存
export const testUserProgressSave = async (userId) => {
  try {
    console.log('Testing user progress save...')
    
    const testProgress = {
      totalXP: 100,
      gold: 50,
      completedQuests: ['test-quest-1'],
      currentLevel: 1,
      skills: {},
      achievements: [],
      questHistory: [{
        questId: 'test-quest-1',
        subject: 'test',
        category: 'test',
        questType: 'quest',
        xpEarned: 100,
        goldEarned: 50,
        completedAt: new Date().toISOString(),
        deliverables: []
      }]
    }
    
    const userProgressRef = doc(db, 'userProgress', userId)
    console.log('Saving user progress to Firebase...')
    await setDoc(userProgressRef, testProgress, { merge: true })
    console.log('User progress saved successfully!')
    
    // 验证保存
    const savedDoc = await getDoc(userProgressRef)
    if (savedDoc.exists()) {
      console.log('User progress verification successful:', savedDoc.data())
      return true
    } else {
      console.log('User progress verification failed: Document not found')
      return false
    }
  } catch (error) {
    console.error('User progress test failed:', error)
    return false
  }
}

// 测试技能进度保存（为了兼容性）
export const testSkillProgressWrite = async (userId) => {
  return await testUserProgressSave(userId)
}