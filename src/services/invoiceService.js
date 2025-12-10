import { collection, doc, getDocs, query, where, orderBy, updateDoc, getDoc, addDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// 平台费率 (5%)
const PLATFORM_FEE_RATE = 0.05

/**
 * 创建账单（在 session 完成后调用）
 * @param {string} sessionId - 会话 ID
 * @param {string} studentId - 学生 ID
 * @param {string} tutorId - 导师 ID
 * @param {number} durationMinutes - 通话时长（分钟）
 * @param {string} subject - 科目
 */
export const createInvoice = async (sessionId, studentId, tutorId, durationMinutes, subject) => {
  try {
    console.log('📄 Creating invoice...', { sessionId, studentId, tutorId, durationMinutes, subject })
    
    // 验证必需参数
    if (!sessionId || !studentId || !tutorId) {
      console.error('❌ Missing required parameters:', { sessionId, studentId, tutorId })
      return { success: false, error: 'Missing required parameters: sessionId, studentId, or tutorId' }
    }
    
    if (!durationMinutes || durationMinutes <= 0) {
      console.error('❌ Invalid duration:', durationMinutes)
      return { success: false, error: 'Invalid duration' }
    }
    
    // 获取导师的小时费率
    const tutorDoc = await getDoc(doc(db, 'users', tutorId))
    if (!tutorDoc.exists()) {
      console.error('❌ Tutor not found:', tutorId)
      return { success: false, error: 'Tutor not found' }
    }
    
    const tutorData = tutorDoc.data()
    const hourlyRate = tutorData.tutorProfile?.hourlyRate || 15
    
    console.log('💰 Tutor hourly rate:', hourlyRate)
    
    // 计算费用（按分钟比例）
    const hours = durationMinutes / 60
    const subtotal = parseFloat((hourlyRate * hours).toFixed(2))
    const platformFee = parseFloat((subtotal * PLATFORM_FEE_RATE).toFixed(2))
    const tutorEarnings = parseFloat((subtotal - platformFee).toFixed(2))
    
    // 获取学生信息
    const studentDoc = await getDoc(doc(db, 'users', studentId))
    const studentName = studentDoc.exists() ? studentDoc.data().name : 'Unknown'
    const tutorName = tutorData.name || 'Unknown'
    
    // 创建账单数据
    const invoiceData = {
      sessionId,
      studentId,
      tutorId,
      studentName,
      tutorName,
      subject: subject || 'Tutoring Session',
      durationMinutes,
      hourlyRate,
      subtotal,
      platformFee,
      platformFeeRate: PLATFORM_FEE_RATE,
      tutorEarnings,
      status: 'pending', // pending, paid, cancelled
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    console.log('📄 Invoice data:', invoiceData)
    
    // 创建账单
    const invoiceRef = await addDoc(collection(db, 'invoices'), invoiceData)
    
    console.log('✅ Invoice created successfully:', invoiceRef.id)
    
    return { 
      success: true, 
      invoiceId: invoiceRef.id,
      invoice: {
        id: invoiceRef.id,
        subtotal,
        platformFee,
        tutorEarnings
      }
    }
  } catch (error) {
    console.error('❌ Error creating invoice:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 获取学生的所有账单
 */
export const getStudentInvoices = async (studentId) => {
  try {
    console.log('📋 Fetching invoices for student:', studentId)
    
    let snapshot
    try {
      // 优先使用排序（需要索引）
      const q = query(
        collection(db, 'invoices'),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      )
      snapshot = await getDocs(q)
    } catch (indexError) {
      // 如果索引不存在，降级为不排序查询
      console.warn('⚠️ Index not available, falling back to unsorted query:', indexError.message)
      const fallbackQuery = query(
        collection(db, 'invoices'),
        where('studentId', '==', studentId)
      )
      snapshot = await getDocs(fallbackQuery)
    }
    
    const invoices = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // 本地排序（按 createdAt 降序）
    invoices.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0
      const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0
      return bTime - aTime
    })
    
    console.log('📋 Found', invoices.length, 'invoices for student')
    
    return { success: true, invoices }
  } catch (error) {
    console.error('Error getting student invoices:', error)
    return { success: false, invoices: [], error: error.message }
  }
}

/**
 * 获取导师的所有账单
 */
export const getTutorInvoices = async (tutorId) => {
  try {
    console.log('📋 Fetching invoices for tutor:', tutorId)
    
    let snapshot
    try {
      const q = query(
        collection(db, 'invoices'),
        where('tutorId', '==', tutorId),
        orderBy('createdAt', 'desc')
      )
      snapshot = await getDocs(q)
    } catch (indexError) {
      console.warn('⚠️ Index not available, falling back to unsorted query:', indexError.message)
      const fallbackQuery = query(
        collection(db, 'invoices'),
        where('tutorId', '==', tutorId)
      )
      snapshot = await getDocs(fallbackQuery)
    }
    
    const invoices = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // 本地排序
    invoices.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0
      const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0
      return bTime - aTime
    })
    
    console.log('📋 Found', invoices.length, 'invoices for tutor')
    
    return { success: true, invoices }
  } catch (error) {
    console.error('Error getting tutor invoices:', error)
    return { success: false, invoices: [], error: error.message }
  }
}

/**
 * 检查学生是否有未支付账单
 */
export const hasUnpaidInvoices = async (studentId) => {
  try {
    console.log('🔍 Checking unpaid invoices for student:', studentId)
    
    let snapshot
    try {
      const q = query(
        collection(db, 'invoices'),
        where('studentId', '==', studentId),
        where('status', '==', 'pending')
      )
      snapshot = await getDocs(q)
    } catch (indexError) {
      // 如果复合索引不存在，获取所有学生的发票然后筛选
      console.warn('⚠️ Index not available, falling back to filter:', indexError.message)
      const fallbackQuery = query(
        collection(db, 'invoices'),
        where('studentId', '==', studentId)
      )
      const allInvoices = await getDocs(fallbackQuery)
      const pendingDocs = allInvoices.docs.filter(doc => doc.data().status === 'pending')
      
      console.log('🔍 Found', pendingDocs.length, 'unpaid invoices')
      
      return { 
        success: true, 
        hasUnpaid: pendingDocs.length > 0,
        unpaidCount: pendingDocs.length,
        unpaidInvoices: pendingDocs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      }
    }
    
    console.log('🔍 Found', snapshot.size, 'unpaid invoices')
    
    return { 
      success: true, 
      hasUnpaid: !snapshot.empty,
      unpaidCount: snapshot.size,
      unpaidInvoices: snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    }
  } catch (error) {
    console.error('Error checking unpaid invoices:', error)
    return { success: false, hasUnpaid: false, error: error.message }
  }
}

/**
 * 标记账单为已支付（在 Stripe 支付成功后调用）
 */
export const markInvoiceAsPaid = async (invoiceId, stripeSessionId) => {
  try {
    const invoiceRef = doc(db, 'invoices', invoiceId)
    const invoiceDoc = await getDoc(invoiceRef)
    
    if (!invoiceDoc.exists()) {
      return { success: false, error: 'Invoice not found' }
    }
    
    const invoiceData = invoiceDoc.data()
    
    // 更新账单状态
    await updateDoc(invoiceRef, {
      status: 'paid',
      paidAt: serverTimestamp(),
      stripeSessionId,
      updatedAt: serverTimestamp()
    })
    
    // 更新导师的收入统计
    const tutorStatsRef = doc(db, 'tutorStats', invoiceData.tutorId)
    const tutorStatsDoc = await getDoc(tutorStatsRef)
    
    if (tutorStatsDoc.exists()) {
      const currentStats = tutorStatsDoc.data()
      await updateDoc(tutorStatsRef, {
        totalEarnings: (currentStats.totalEarnings || 0) + invoiceData.tutorEarnings,
        pendingEarnings: Math.max(0, (currentStats.pendingEarnings || 0) - invoiceData.tutorEarnings),
        updatedAt: serverTimestamp()
      })
    } else {
      await setDoc(tutorStatsRef, {
        totalEarnings: invoiceData.tutorEarnings,
        pendingEarnings: 0,
        totalSessions: 1,
        totalRating: 0,
        ratingCount: 0,
        completedSessions: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
    
    console.log('✅ Invoice marked as paid:', invoiceId)
    
    return { success: true }
  } catch (error) {
    console.error('Error marking invoice as paid:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 获取导师的钱包数据
 */
export const getTutorWallet = async (tutorId) => {
  try {
    // 获取统计数据
    const tutorStatsRef = doc(db, 'tutorStats', tutorId)
    const tutorStatsDoc = await getDoc(tutorStatsRef)
    
    let stats = {
      totalEarnings: 0,
      pendingEarnings: 0,
      completedSessions: 0
    }
    
    if (tutorStatsDoc.exists()) {
      const data = tutorStatsDoc.data()
      stats = {
        totalEarnings: data.totalEarnings || 0,
        pendingEarnings: data.pendingEarnings || 0,
        completedSessions: data.completedSessions || 0
      }
    }
    
    // 获取最近的已支付账单
    const paidQuery = query(
      collection(db, 'invoices'),
      where('tutorId', '==', tutorId),
      where('status', '==', 'paid'),
      orderBy('paidAt', 'desc')
    )
    
    const paidSnapshot = await getDocs(paidQuery)
    const recentPayments = paidSnapshot.docs.slice(0, 5).map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // 获取待支付账单
    const pendingQuery = query(
      collection(db, 'invoices'),
      where('tutorId', '==', tutorId),
      where('status', '==', 'pending')
    )
    
    const pendingSnapshot = await getDocs(pendingQuery)
    const pendingInvoices = pendingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // 计算待收金额
    const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + (inv.tutorEarnings || 0), 0)
    
    return {
      success: true,
      wallet: {
        totalEarnings: stats.totalEarnings,
        pendingEarnings: pendingTotal,
        completedSessions: stats.completedSessions,
        recentPayments,
        pendingInvoices
      }
    }
  } catch (error) {
    console.error('Error getting tutor wallet:', error)
    return { 
      success: false, 
      wallet: {
        totalEarnings: 0,
        pendingEarnings: 0,
        completedSessions: 0,
        recentPayments: [],
        pendingInvoices: []
      },
      error: error.message 
    }
  }
}

/**
 * 获取单个账单详情
 */
export const getInvoice = async (invoiceId) => {
  try {
    const invoiceRef = doc(db, 'invoices', invoiceId)
    const invoiceDoc = await getDoc(invoiceRef)
    
    if (!invoiceDoc.exists()) {
      return { success: false, error: 'Invoice not found' }
    }
    
    return {
      success: true,
      invoice: {
        id: invoiceDoc.id,
        ...invoiceDoc.data()
      }
    }
  } catch (error) {
    console.error('Error getting invoice:', error)
    return { success: false, error: error.message }
  }
}

