import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToMillis } from '../utils/timestampUtils'
import { createNotification } from './notificationService'

// 获取学生的所有会话
export const getStudentSessions = async (studentId) => {
  try {
    const sessionsRef = collection(db, 'sessions')
    let q
    try {
      // 优先使用排序（需要索引）
      q = query(
        sessionsRef,
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(q)
      return { success: true, sessions: await __mapSessionsWithTutor(snap) }
    } catch (inner) {
      // 若需要索引，则降级为不排序查询，保证功能可用
      if ((inner?.message || '').includes('requires an index')) {
        const fallback = query(
          sessionsRef,
          where('studentId', '==', studentId)
        )
        const snap = await getDocs(fallback)
        const sessions = await __mapSessionsWithTutor(snap)
        // 简单按 createdAt（可能为 Timestamp 或 null）降序本地排序
        sessions.sort((a, b) => {
          const ta = safeToMillis(a.createdAt)
          const tb = safeToMillis(b.createdAt)
          return tb - ta
        })
        return { success: true, sessions }
      }
      throw inner
    }
  } catch (error) {
    console.error('Error getting student sessions:', error)
    return { success: false, sessions: [], error: 'Failed to get sessions' }
  }
}

// 获取导师的所有会话（学生请求 + 已接受等）
export const getTutorSessions = async (tutorId) => {
  try {
    const sessionsRef = collection(db, 'sessions')
    let q
    try {
      q = query(sessionsRef, where('tutorId', '==', tutorId), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      return { success: true, sessions: await __mapSessionsWithStudent(snap) }
    } catch (inner) {
      if ((inner?.message || '').includes('requires an index')) {
        const fallback = query(sessionsRef, where('tutorId', '==', tutorId))
        const snap = await getDocs(fallback)
        const sessions = await __mapSessionsWithStudent(snap)
        sessions.sort((a, b) => {
          const ta = safeToMillis(a.createdAt)
          const tb = safeToMillis(b.createdAt)
          return tb - ta
        })
        return { success: true, sessions }
      }
      throw inner
    }
  } catch (error) {
    console.error('Error getting tutor sessions:', error)
    return { success: false, sessions: [], error: 'Failed to get sessions' }
  }
}

// 将查询快照映射为带导师信息的会话数组
const __mapSessionsWithTutor = async (querySnapshot) => {
  const sessions = []
  for (const docSnapshot of querySnapshot.docs) {
    const sessionData = docSnapshot.data()
    const tutorDoc = await getDoc(doc(db, 'users', sessionData.tutorId))
    const tutorData = tutorDoc.exists() ? tutorDoc.data() : { name: 'Unknown', email: '', avatar: null }
    sessions.push({
      id: docSnapshot.id,
      ...sessionData,
      tutor: {
        id: sessionData.tutorId,
        name: tutorData.name,
        email: tutorData.email,
        avatar: tutorData.avatar || null
      }
    })
  }
  return sessions
}

// 将查询快照映射为带学生信息的会话数组
const __mapSessionsWithStudent = async (querySnapshot) => {
  const sessions = []
  for (const docSnapshot of querySnapshot.docs) {
    const sessionData = docSnapshot.data()
    const studentDoc = await getDoc(doc(db, 'users', sessionData.studentId))
    const studentData = studentDoc.exists() ? studentDoc.data() : { name: 'Unknown', email: '', avatar: null }
    sessions.push({
      id: docSnapshot.id,
      ...sessionData,
      student: {
        id: sessionData.studentId,
        name: studentData.name,
        email: studentData.email,
        avatar: studentData.avatar || null
      }
    })
  }
  return sessions
}

// 开始会话
export const startSession = async (sessionId, additionalData = {}) => {
  try {
    console.log('🔄 startSession 被调用:', { sessionId, additionalData })
    
    const sessionRef = doc(db, 'sessions', sessionId)
    const snap = await getDoc(sessionRef)
    if (!snap.exists()) {
      console.error('❌ Session does not exist:', sessionId)
      return { success: false, error: 'Session not found' }
    }
    const data = snap.data()
    console.log('📊 当前会话数据:', data)
    
    if (data.status !== 'accepted' && data.status !== 'active') {
      console.error('❌ Session status is not accepted or active:', data.status)
      return { success: false, error: 'Session can start only after tutor accepts' }
    }
    
    const updateData = {
      status: 'active',
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...additionalData // 包含会议代码等额外数据
    }
    
    console.log('📝 准备更新的数据:', updateData)
    
    await updateDoc(sessionRef, updateData)
    
    console.log('✅ 会话更新成功:', sessionId)
    
    return {
      success: true,
      message: 'Session started successfully'
    }
  } catch (error) {
    console.error('Error starting session:', error)
    return {
      success: false,
      error: 'Failed to start session'
    }
  }
}

// 结束会话
export const endSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'sessions', sessionId)
    const snap = await getDoc(sessionRef)
    if (!snap.exists()) {
      return { success: false, error: 'Session not found' }
    }
    const data = snap.data()
    if (data.status !== 'active') {
      return { success: false, error: 'Only active session can be ended' }
    }
    await updateDoc(sessionRef, {
      status: 'completed',
      endedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return {
      success: true,
      message: 'Session ended successfully'
    }
  } catch (error) {
    console.error('Error ending session:', error)
    return {
      success: false,
      error: 'Failed to end session'
    }
  }
}

// 评价导师
export const rateTutor = async (sessionId, rating, comment = '') => {
  try {
    const sessionRef = doc(db, 'sessions', sessionId)
    const snap = await getDoc(sessionRef)
    if (!snap.exists()) {
      return { success: false, error: 'Session not found' }
    }
    const data = snap.data()
    if (data.status !== 'completed') {
      return { success: false, error: 'You can rate only completed sessions' }
    }
    
    // 更新会话文档
    await updateDoc(sessionRef, {
      rating,
      ratingComment: comment,
      rated: true,
      ratedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    // 创建评分记录并更新导师统计
    const { createRating } = await import('./ratingService')
    const ratingResult = await createRating(sessionId, data.tutorId, data.studentId, rating, comment)
    
    if (!ratingResult.success) {
      console.error('Failed to create rating:', ratingResult.error)
      // 即使评分记录创建失败，也返回成功，因为会话已经标记为已评分
    }
    
    return {
      success: true,
      message: 'Rating submitted successfully'
    }
  } catch (error) {
    console.error('Error rating tutor:', error)
    return {
      success: false,
      error: 'Failed to submit rating'
    }
  }
}

// 请求会话
export const requestSession = async (studentId, tutorId, subject, scheduledTime, message = '') => {
  try {
    console.log('requestSession called with:', { studentId, tutorId, subject, scheduledTime, message })
    
    const sessionsRef = collection(db, 'sessions')
    // 规范化时间：允许传入 Date、时间字符串或空
    let preferredTimeISO = null
    if (scheduledTime) {
      const parsed = scheduledTime instanceof Date ? scheduledTime : new Date(scheduledTime)
      if (!isNaN(parsed.getTime())) {
        preferredTimeISO = parsed.toISOString()
      }
    }


    const sessionData = {
      studentId,
      tutorId,
      subject,
      preferredTime: preferredTimeISO, // 统一字段名，使用 ISO 字符串，避免 Firestore Date 转换错误
      message,
      duration: 60, // 默认 60 分钟
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    console.log('Session data to be saved:', sessionData)
    
    const docRef = await addDoc(sessionsRef, sessionData)
    
    console.log('Session created successfully with ID:', docRef.id)
    // 通知导师有新的请求（显示学生姓名而非ID）
    let studentName = 'Student'
    try {
      const sDoc = await getDoc(doc(db, 'users', studentId))
      if (sDoc.exists()) {
        const sd = sDoc.data()
        studentName = sd?.name || 'Student'
      }
    } catch (e) {}
    await createNotification(
      tutorId,
      'info',
      'New session request',
      `${studentName} requested a ${subject} session`,
      { sessionId: docRef.id, role: 'tutor', status: 'pending', fromName: studentName, subject }
    )
    
    return {
      success: true,
      sessionId: docRef.id,
      message: 'Session request sent successfully'
    }
  } catch (error) {
    console.error('Error requesting session:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })
    return {
      success: false,
      error: `Failed to send session request: ${error.message}`
    }
  }
}

// 接受会话请求（导师用）
export const acceptSessionRequest = async (sessionId, tutorId) => {
  try {
    // 首先检查导师是否已绑定银行卡
    if (tutorId) {
      const tutorDoc = await getDoc(doc(db, 'users', tutorId))
      if (tutorDoc.exists()) {
        const tutorData = tutorDoc.data()
        // 检查是否有 Stripe Connect 账户且已验证
        if (!tutorData.stripeConnectAccountId || tutorData.stripeConnectStatus !== 'verified') {
          console.log('⚠️ Tutor has not set up bank account:', tutorId)
          return {
            success: false,
            error: 'Please set up your bank account before accepting sessions. Go to your dashboard to connect your bank account.',
            needsBankSetup: true
          }
        }
      }
    }
    
    const sessionRef = doc(db, 'sessions', sessionId)
    await updateDoc(sessionRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    const data = (await getDoc(sessionRef)).data()
    // 通知学生：请求被接受（显示导师姓名）
    let tutorName = 'Tutor'
    try {
      const tDoc = await getDoc(doc(db, 'users', data.tutorId))
      if (tDoc.exists()) {
        const td = tDoc.data()
        tutorName = td?.name || 'Tutor'
      }
    } catch (e) {}
    await createNotification(
      data.studentId,
      'success',
      'Session accepted',
      `${tutorName} accepted your ${data.subject} session`,
      { sessionId, role: 'student', status: 'accepted', fromName: tutorName, subject: data.subject }
    )
    
    return {
      success: true,
      message: 'Session request accepted'
    }
  } catch (error) {
    console.error('Error accepting session request:', error)
    return {
      success: false,
      error: 'Failed to accept session request'
    }
  }
}

// 拒绝会话请求（导师用）
export const rejectSessionRequest = async (sessionId, reason = '') => {
  try {
    const sessionRef = doc(db, 'sessions', sessionId)
    await updateDoc(sessionRef, {
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    const data = (await getDoc(sessionRef)).data()
    let tutorName2 = 'Tutor'
    try {
      const tDoc2 = await getDoc(doc(db, 'users', data.tutorId))
      if (tDoc2.exists()) {
        const td2 = tDoc2.data()
        tutorName2 = td2?.name || 'Tutor'
      }
    } catch (e) {}
    await createNotification(
      data.studentId,
      'error',
      'Session declined',
      `${tutorName2} declined your ${data.subject} session`,
      { sessionId, role: 'student', status: 'rejected', fromName: tutorName2, subject: data.subject }
    )
    
    return {
      success: true,
      message: 'Session request rejected'
    }
  } catch (error) {
    console.error('Error rejecting session request:', error)
    return {
      success: false,
      error: 'Failed to reject session request'
    }
  }
}
