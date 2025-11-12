import { collection, doc, getDocs, query, where, orderBy, updateDoc, getDoc, addDoc, serverTimestamp, deleteDoc, setDoc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToDate } from '../utils/timestampUtils'

// 获取所有可用导师
export const getAllTutors = async () => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('isTutor', '==', true))
    const querySnapshot = await getDocs(q)
    
    const tutors = []
    for (const docSnapshot of querySnapshot.docs) {
      const userData = docSnapshot.data()
      
      // 获取导师统计信息
      const tutorStats = await getTutorStats(docSnapshot.id)
      
      tutors.push({
        id: docSnapshot.id,
        name: userData.name,
        email: userData.email,
        school: userData.school,
        grade: userData.grade,
        bio: userData.bio,
        subjects: userData.subjects || [],
        tutorProfile: userData.tutorProfile || {},
        stats: tutorStats,
        location: userData.location || 'Online',
        isAvailable: userData.tutorProfile?.isAvailable !== false,
        specialties: userData.tutorProfile?.specialties || userData.subjects || [],
        description: userData.tutorProfile?.description || userData.bio || `${userData.name} is available to help with your studies.`,
        experience: userData.tutorProfile?.experience || 'Student',
        rating: tutorStats.averageRating || 0,
        totalSessions: tutorStats.totalSessions || 0,
        responseTime: userData.tutorProfile?.responseTime || 'Usually responds within a few hours',
        avatar: userData.avatar || null
      })
    }
    
    // 按评分排序
    tutors.sort((a, b) => b.rating - a.rating)
    
    return {
      success: true,
      tutors
    }
  } catch (error) {
    console.error('Error getting all tutors:', error)
    return {
      success: false,
      tutors: [],
      error: 'Failed to load tutors'
    }
  }
}

// 获取导师统计信息
export const getTutorStats = async (userId) => {
  try {
    console.log('🔍 Getting tutor stats for user:', userId)
    const tutorStatsRef = doc(db, 'tutorStats', userId)

    const [tutorStatsDoc, sessionsSnapshot, ratingsSnapshot] = await Promise.all([
      getDoc(tutorStatsRef),
      getDocs(query(collection(db, 'sessions'), where('tutorId', '==', userId))),
      getDocs(query(collection(db, 'ratings'), where('tutorId', '==', userId)))
    ])

    const totalSessions = sessionsSnapshot.size
    let completedSessions = 0
    sessionsSnapshot.forEach((sessionDoc) => {
      const data = sessionDoc.data() || {}
      if (data.status === 'completed') {
        completedSessions += 1
      }
    })

    const ratingCount = ratingsSnapshot.size
    let totalRating = 0
    ratingsSnapshot.forEach((ratingDoc) => {
      const data = ratingDoc.data() || {}
      totalRating += Number(data.rating) || 0
    })
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0

    if (tutorStatsDoc.exists()) {
      const stats = tutorStatsDoc.data()
      console.log('📊 Tutor stats found (with live aggregation):', {
        userId,
        stored: stats,
        aggregated: {
          totalSessions,
          completedSessions,
          ratingCount,
          totalRating,
          averageRating
        }
      })
    } else {
      console.log('⚠️ No tutor stats found for user:', userId, '— using live aggregation only')
    }

    return {
      totalSessions,
      completedSessions,
      ratingCount,
      totalRating,
      averageRating,
      totalEarnings: tutorStatsDoc.exists() ? (tutorStatsDoc.data().totalEarnings || 0) : 0
    }
  } catch (error) {
    console.error('Error getting tutor stats:', error)
    return {
      totalSessions: 0,
      completedSessions: 0,
      ratingCount: 0,
      totalRating: 0,
      averageRating: 0,
      totalEarnings: 0
    }
  }
}

const deleteDocumentsByField = async (collectionName, field, value) => {
  const colRef = collection(db, collectionName)
  const q = query(colRef, where(field, '==', value))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return 0
  }

  const commits = []
  let batch = writeBatch(db)
  let operationCount = 0

  snapshot.docs.forEach((docSnap, index) => {
    batch.delete(docSnap.ref)
    operationCount += 1

    if (operationCount % 400 === 0) {
      commits.push(batch.commit())
      batch = writeBatch(db)
    }
  })

  if (operationCount % 400 !== 0) {
    commits.push(batch.commit())
  }

  await Promise.all(commits)
  return snapshot.size
}

// 设置用户为导师
export const setUserAsTutor = async (userId, tutorProfile) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      isTutor: true,
      tutorProfile: {
        isAvailable: tutorProfile.isAvailable !== false,
        specialties: tutorProfile.specialties || [],
        description: tutorProfile.description || '',
        experience: tutorProfile.experience || 'Student',
        responseTime: tutorProfile.responseTime || 'Usually responds within a few hours',
        updatedAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    })
    
    return { success: true, message: 'Tutor profile updated successfully' }
  } catch (error) {
    console.error('Error setting user as tutor:', error)
    return { success: false, error: error.message }
  }
}

// 创建导师会话请求
export const createTutoringSession = async (studentId, tutorId, sessionData) => {
  try {
    const sessionsRef = collection(db, 'tutoringSessions')
    const sessionDoc = await addDoc(sessionsRef, {
      studentId,
      tutorId,
      subject: sessionData.subject,
      description: sessionData.description,
      preferredTime: sessionData.preferredTime,
      duration: sessionData.duration || 60, // 默认60分钟
      status: 'pending', // pending, accepted, completed, cancelled
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return { 
      success: true, 
      sessionId: sessionDoc.id,
      message: 'Tutoring session request sent successfully' 
    }
  } catch (error) {
    console.error('Error creating tutoring session:', error)
    return { success: false, error: error.message }
  }
}

// 获取用户的导师会话
export const getUserTutoringSessions = async (userId) => {
  try {
    const sessionsRef = collection(db, 'tutoringSessions')
    // 简化查询，避免orderBy索引问题
    const studentQuery = query(sessionsRef, where('studentId', '==', userId))
    const tutorQuery = query(sessionsRef, where('tutorId', '==', userId))
    
    const [studentSessions, tutorSessions] = await Promise.all([
      getDocs(studentQuery),
      getDocs(tutorQuery)
    ])
    
    const sessions = []
    
    // 处理学生会话
    for (const docSnapshot of studentSessions.docs) {
      const sessionData = docSnapshot.data()
      const tutorDoc = await getDoc(doc(db, 'users', sessionData.tutorId))
      sessions.push({
        id: docSnapshot.id,
        ...sessionData,
        type: 'student',
        tutor: tutorDoc.exists() ? tutorDoc.data() : null
      })
    }
    
    // 处理导师会话
    for (const docSnapshot of tutorSessions.docs) {
      const sessionData = docSnapshot.data()
      const studentDoc = await getDoc(doc(db, 'users', sessionData.studentId))
      sessions.push({
        id: docSnapshot.id,
        ...sessionData,
        type: 'tutor',
        student: studentDoc.exists() ? studentDoc.data() : null
      })
    }
    
    // 按创建时间排序
    sessions.sort((a, b) => {
      const timeA = safeToDate(a.createdAt).getTime()
      const timeB = safeToDate(b.createdAt).getTime()
      return timeB - timeA
    })
    
    return { success: true, sessions }
  } catch (error) {
    console.error('Error getting tutoring sessions:', error)
    return { success: false, sessions: [], error: error.message }
  }
}

// 搜索导师
export const searchTutors = async (filters = {}) => {
  try {
    const result = await getAllTutors()
    if (!result.success) return result
    
    let tutors = result.tutors
    
    // 应用过滤器
    if (filters.subject && filters.subject !== 'all') {
      tutors = tutors.filter(tutor => 
        tutor.subjects.some(subject => 
          subject.toLowerCase().includes(filters.subject.toLowerCase())
        )
      )
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      tutors = tutors.filter(tutor => 
        tutor.name.toLowerCase().includes(query) ||
        tutor.specialties.some(specialty => specialty.toLowerCase().includes(query)) ||
        tutor.description.toLowerCase().includes(query)
      )
    }
    
    if (filters.minRating) {
      tutors = tutors.filter(tutor => tutor.rating >= filters.minRating)
    }
    
    
    if (filters.availableOnly) {
      tutors = tutors.filter(tutor => tutor.isAvailable)
    }
    
    return { success: true, tutors }
  } catch (error) {
    console.error('Error searching tutors:', error)
    return { success: false, tutors: [], error: error.message }
  }
}

// 更新导师会话状态
export const updateTutoringSessionStatus = async (sessionId, status, tutorId) => {
  try {
    // 统一到 sessions 集合
    const sessionRef = doc(db, 'sessions', sessionId)
    await updateDoc(sessionRef, {
      status: status, // 'accepted', 'declined', 'completed', 'cancelled'
      updatedAt: serverTimestamp(),
      tutorActionAt: serverTimestamp()
    })
    
    return { success: true, message: `Session ${status} successfully` }
  } catch (error) {
    console.error('Error updating session status:', error)
    return { success: false, error: error.message }
  }
}

// 检查学生是否已经请求过某个导师
export const checkExistingRequest = async (studentId, tutorId) => {
  try {
    const sessionsRef = collection(db, 'tutoringSessions')
    const q = query(
      sessionsRef, 
      where('studentId', '==', studentId),
      where('tutorId', '==', tutorId),
      where('status', 'in', ['pending', 'accepted'])
    )
    const querySnapshot = await getDocs(q)
    
    return {
      success: true,
      hasExistingRequest: !querySnapshot.empty,
      existingSession: querySnapshot.empty ? null : querySnapshot.docs[0].data()
    }
  } catch (error) {
    console.error('Error checking existing request:', error)
    return { success: false, hasExistingRequest: false, error: error.message }
  }
}

// 清除用户导师状态
export const removeUserAsTutor = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)

    const [currentSessionsRemoved, legacySessionsRemoved, ratingsRemoved] = await Promise.all([
      deleteDocumentsByField('sessions', 'tutorId', userId),
      deleteDocumentsByField('tutoringSessions', 'tutorId', userId),
      deleteDocumentsByField('ratings', 'tutorId', userId)
    ])

    let statsRemoved = false
    try {
      await deleteDoc(doc(db, 'tutorStats', userId))
      statsRemoved = true
    } catch (statsError) {
      console.warn('⚠️ Unable to delete tutor stats for user:', userId, statsError)
    }

    await updateDoc(userRef, {
      isTutor: false,
      tutorProfile: null,
      updatedAt: serverTimestamp()
    })

    return {
      success: true,
      message: 'Tutor status removed successfully',
      removedSessions: currentSessionsRemoved + legacySessionsRemoved,
      removedLegacySessions: legacySessionsRemoved,
      removedRatings: ratingsRemoved,
      removedStats: statsRemoved
    }
  } catch (error) {
    console.error('Error removing tutor status:', error)
    return { success: false, error: error.message }
  }
}

// 创建导师档案
export const createTutorProfile = async (userId, tutorData) => {
  try {
    const userRef = doc(db, 'users', userId)
    
    // 更新用户信息，设置为导师
    await updateDoc(userRef, {
      isTutor: true,
      subjects: [tutorData.subjects], // 保存科目信息
      tutorProfile: {
        subjects: [tutorData.subjects],
        experience: tutorData.experience,
        description: tutorData.description,
        availability: tutorData.availability,
        isAvailable: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    })
    
    // 创建导师统计记录
    const tutorStatsRef = doc(db, 'tutorStats', userId)
    await setDoc(tutorStatsRef, {
      totalSessions: 0,
      totalRating: 0,
      ratingCount: 0,
      totalEarnings: 0,
      completedSessions: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return { success: true, message: 'Tutor profile created successfully' }
  } catch (error) {
    console.error('Error creating tutor profile:', error)
    return { success: false, error: error.message }
  }
}
