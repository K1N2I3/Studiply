import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

// 创建测试评分数据
export const createTestRatings = async (tutorId) => {
  const testRatings = [
    {
      tutorId: tutorId,
      studentId: 'test-student-1',
      rating: 5,
      review: 'Excellent tutor! Very patient and explains concepts clearly.',
      sessionId: 'test-session-1',
      createdAt: serverTimestamp()
    },
    {
      tutorId: tutorId,
      studentId: 'test-student-2',
      rating: 4,
      review: 'Great session, helped me understand the material better.',
      sessionId: 'test-session-2',
      createdAt: serverTimestamp()
    },
    {
      tutorId: tutorId,
      studentId: 'test-student-3',
      rating: 5,
      review: 'Amazing tutor! Highly recommend for anyone struggling with this subject.',
      sessionId: 'test-session-3',
      createdAt: serverTimestamp()
    }
  ]

  try {
    const ratingsRef = collection(db, 'ratings')
    const results = []
    
    for (const rating of testRatings) {
      const docRef = await addDoc(ratingsRef, rating)
      results.push({ id: docRef.id, ...rating })
      console.log('✅ Created test rating:', docRef.id)
    }
    
    return { success: true, ratings: results }
  } catch (error) {
    console.error('❌ Error creating test ratings:', error)
    return { success: false, error: error.message }
  }
}

// 创建测试学生用户数据
export const createTestStudents = async () => {
  const testStudents = [
    {
      id: 'test-student-1',
      name: 'Alice Johnson',
      email: 'alice@example.com'
    },
    {
      id: 'test-student-2',
      name: 'Bob Smith',
      email: 'bob@example.com'
    },
    {
      id: 'test-student-3',
      name: 'Carol Davis',
      email: 'carol@example.com'
    }
  ]

  try {
    const results = []
    
    for (const student of testStudents) {
      // 这里我们只是模拟，实际应该使用setDoc
      console.log('📝 Would create test student:', student)
      results.push(student)
    }
    
    return { success: true, students: results }
  } catch (error) {
    console.error('❌ Error creating test students:', error)
    return { success: false, error: error.message }
  }
}
