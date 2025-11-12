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
import { safeToMillis } from '../utils/timestampUtils'

// 评分数据结构
export const createRating = async (sessionId, tutorId, studentId, rating, review = '') => {
  try {
    const ratingsRef = collection(db, 'ratings')
    
    // 检查是否已经评分过
    const existingRatingQuery = query(
      ratingsRef,
      where('sessionId', '==', sessionId),
      where('studentId', '==', studentId)
    )
    
    const existingRatingSnapshot = await getDocs(existingRatingQuery)
    
    if (!existingRatingSnapshot.empty) {
      return { success: false, error: 'You have already rated this session.' }
    }
    
    // 创建新评分
    const ratingData = {
      sessionId,
      tutorId,
      studentId,
      rating, // 1-5星评分
      review,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(ratingsRef, ratingData)
    
    // 更新导师统计
    await updateTutorRatingStats(tutorId, rating)
    
    return { success: true, ratingId: docRef.id }
  } catch (error) {
    console.error('Error creating rating:', error)
    return { success: false, error: error.message }
  }
}

// 更新导师评分统计
const updateTutorRatingStats = async (tutorId, newRating) => {
  try {
    const statsRef = doc(db, 'tutorStats', tutorId)
    const statsDoc = await getDoc(statsRef)
    
    if (statsDoc.exists()) {
      // 更新现有统计
      await updateDoc(statsRef, {
        totalRating: increment(newRating),
        ratingCount: increment(1),
        updatedAt: serverTimestamp()
      })
    } else {
      // 创建新统计
      await setDoc(statsRef, {
        totalRating: newRating,
        ratingCount: 1,
        totalSessions: 0,
        totalEarnings: 0,
        completedSessions: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error updating tutor rating stats:', error)
  }
}

// 获取导师的所有评分
export const getTutorRatings = async (tutorId, limitCount = 10) => {
  try {
    const ratingsRef = collection(db, 'ratings')
    
    // 先获取所有ratings，然后在客户端过滤（避免复合索引问题）
    const q = query(ratingsRef)
    const querySnapshot = await getDocs(q)
    const ratings = []
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data()
      
      // 只处理当前导师的评分
      if (data.tutorId !== tutorId) continue
      
      // 获取学生信息
      let studentName = 'Student'
      try {
        console.log('🔍 Fetching student info for:', data.studentId)
        const studentDoc = await getDoc(doc(db, 'users', data.studentId))
        if (studentDoc.exists()) {
          const studentData = studentDoc.data()
          
          // 安全地处理可能包含ServerTimestamp的数据
          const safeStudentData = {
            name: studentData.name,
            email: studentData.email,
            // 避免访问可能包含ServerTimestamp的字段
            isTutor: studentData.isTutor,
            bio: studentData.bio,
            school: studentData.school,
            grade: studentData.grade
          }
          
          console.log('👤 Student data:', {
            id: data.studentId,
            name: safeStudentData.name,
            email: safeStudentData.email,
            isTutor: safeStudentData.isTutor
          })
          
          studentName = safeStudentData.name || 'Student'
        }
      } catch (error) {
        console.error('❌ Error fetching student info for', data.studentId, ':', error)
        console.error('📊 Student data that caused error:', data)
        // 继续处理，不中断整个流程
        studentName = 'Student'
      }
      
      ratings.push({
        id: doc.id,
        sessionId: data.sessionId,
        studentId: data.studentId,
        studentName: studentName,
        rating: data.rating,
        review: data.review,
        createdAt: data.createdAt
      })
    }
    
    // 按创建时间排序并限制数量
    ratings.sort((a, b) => {
      const aTime = safeToMillis(a.createdAt)
      const bTime = safeToMillis(b.createdAt)
      return bTime - aTime // 降序排列
    })
    
    const limitedRatings = ratings.slice(0, limitCount)
    
    return { success: true, ratings: limitedRatings }
  } catch (error) {
    console.error('Error getting tutor ratings:', error)
    return { success: false, ratings: [], error: error.message }
  }
}

// 获取导师的评分统计
export const getTutorRatingStats = async (tutorId) => {
  try {
    const statsRef = doc(db, 'tutorStats', tutorId)
    const statsDoc = await getDoc(statsRef)
    
    if (statsDoc.exists()) {
      const stats = statsDoc.data()
      return {
        success: true,
        totalRating: stats.totalRating || 0,
        ratingCount: stats.ratingCount || 0,
        averageRating: stats.ratingCount > 0 ? (stats.totalRating / stats.ratingCount) : 0,
        totalSessions: stats.totalSessions || 0
      }
    } else {
      return {
        success: true,
        totalRating: 0,
        ratingCount: 0,
        averageRating: 0,
        totalSessions: 0
      }
    }
  } catch (error) {
    console.error('Error getting tutor rating stats:', error)
    return { success: false, error: error.message }
  }
}

// 获取学生的评分历史
export const getStudentRatings = async (studentId, limitCount = 20) => {
  try {
    const ratingsRef = collection(db, 'ratings')
    const q = query(
      ratingsRef,
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const ratings = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      ratings.push({
        id: doc.id,
        sessionId: data.sessionId,
        tutorId: data.tutorId,
        rating: data.rating,
        review: data.review,
        createdAt: data.createdAt
      })
    })
    
    return { success: true, ratings }
  } catch (error) {
    console.error('Error getting student ratings:', error)
    return { success: false, ratings: [], error: error.message }
  }
}

// 检查学生是否已经对某个会话评分
export const checkExistingRating = async (sessionId, studentId) => {
  try {
    const ratingsRef = collection(db, 'ratings')
    const q = query(
      ratingsRef,
      where('sessionId', '==', sessionId),
      where('studentId', '==', studentId)
    )
    
    const querySnapshot = await getDocs(q)
    return { success: true, hasRated: !querySnapshot.empty }
  } catch (error) {
    console.error('Error checking existing rating:', error)
    return { success: false, error: error.message }
  }
}
