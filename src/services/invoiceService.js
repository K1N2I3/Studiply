import { collection, doc, getDocs, query, where, orderBy, updateDoc, getDoc, addDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// 平台费率 (20%)
// 注意：Stripe 还会额外收取约 1.4% + €0.25（欧洲卡）或 2.9% + €0.25（非欧洲卡）
// 例如学生支付 €10：
//   - Stripe 扣费: €0.39 (1.4% + €0.25)
//   - 平台费 (20%): €2.00
//   - 导师收入 (80%): €8.00
//   - 平台实际利润: €2.00 - €0.39 = €1.61
const PLATFORM_FEE_RATE = 0.20

/**
 * Create invoice (called after session completion)
 * @param {string} sessionId - Session ID
 * @param {string} studentId - Student ID
 * @param {string} tutorId - Tutor ID
 * @param {number} durationMinutes - Call duration in minutes
 * @param {string} subject - Subject
 * @param {string} couponId - Optional: Coupon ID
 */
export const createInvoice = async (sessionId, studentId, tutorId, durationMinutes, subject, couponId = null) => {
  try {
    console.log('📄 Creating invoice...', { sessionId, studentId, tutorId, durationMinutes, subject })
    
    // Validate required parameters
    if (!sessionId || !studentId || !tutorId) {
      console.error('❌ Missing required parameters:', { sessionId, studentId, tutorId })
      return { success: false, error: 'Missing required parameters: sessionId, studentId, or tutorId' }
    }
    
    if (!durationMinutes || durationMinutes <= 0) {
      console.error('❌ Invalid duration:', durationMinutes)
      return { success: false, error: 'Invalid duration' }
    }
    
    // Check if invoice already exists for this session (prevent duplicates)
    try {
      const existingQuery = query(
        collection(db, 'invoices'),
        where('sessionId', '==', sessionId)
      )
      const existingSnapshot = await getDocs(existingQuery)
      
      if (!existingSnapshot.empty) {
        const existingInvoice = existingSnapshot.docs[0]
        console.log('⚠️ Invoice already exists for this session:', existingInvoice.id)
        return { 
          success: true, 
          invoiceId: existingInvoice.id,
          invoice: {
            id: existingInvoice.id,
            ...existingInvoice.data()
          },
          alreadyExists: true
        }
      }
    } catch (checkError) {
      console.warn('⚠️ Could not check for existing invoice:', checkError.message)
      // Continue creating even if check fails
    }
    
    // Get tutor's hourly rate
    const tutorDoc = await getDoc(doc(db, 'users', tutorId))
    if (!tutorDoc.exists()) {
      console.error('❌ Tutor not found:', tutorId)
      return { success: false, error: 'Tutor not found' }
    }
    
    const tutorData = tutorDoc.data()
    const hourlyRate = tutorData.tutorProfile?.hourlyRate || 15
    
    console.log('💰 Tutor hourly rate:', hourlyRate)
    
    // Calculate fees (proportional to minutes)
    const hours = durationMinutes / 60
    let subtotal = parseFloat((hourlyRate * hours).toFixed(2))
    let discountAmount = 0
    let discountPercent = 0
    let couponUsed = null

    // Apply discount if coupon is provided
    if (couponId) {
      try {
        const couponDoc = await getDoc(doc(db, 'users', studentId, 'coupons', couponId))
        if (couponDoc.exists()) {
          const couponData = couponDoc.data()
          // Check if coupon is available (not used and not expired)
          const now = new Date()
          const expiresAt = couponData.expiresAt?.toDate()
          
          if (!couponData.used && (!expiresAt || expiresAt > now)) {
            discountPercent = couponData.discountPercent || 0
            discountAmount = parseFloat((subtotal * discountPercent / 100).toFixed(2))
            subtotal = parseFloat((subtotal - discountAmount).toFixed(2))
            couponUsed = couponId
            console.log(`✅ Coupon applied: ${discountPercent}% discount, saving €${discountAmount}`)
          } else {
            console.warn('⚠️ Coupon is used or expired:', couponId)
          }
        }
      } catch (couponError) {
        console.warn('⚠️ Error applying coupon:', couponError)
      }
    }
    
    const platformFee = parseFloat((subtotal * PLATFORM_FEE_RATE).toFixed(2))
    const tutorEarnings = parseFloat((subtotal - platformFee).toFixed(2))
    
    // Get student information
    const studentDoc = await getDoc(doc(db, 'users', studentId))
    const studentName = studentDoc.exists() ? studentDoc.data().name : 'Unknown'
    const tutorName = tutorData.name || 'Unknown'
    
    // Create invoice data
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
      discountAmount,
      discountPercent,
      couponId: couponUsed,
      platformFee,
      platformFeeRate: PLATFORM_FEE_RATE,
      tutorEarnings,
      status: 'pending', // pending, paid, cancelled
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    console.log('📄 Invoice data:', invoiceData)
    
    // Create invoice
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
    console.log('📄 Marking invoice as paid:', invoiceId)
    
    const invoiceRef = doc(db, 'invoices', invoiceId)
    const invoiceDoc = await getDoc(invoiceRef)
    
    if (!invoiceDoc.exists()) {
      console.error('❌ Invoice not found:', invoiceId)
      return { success: false, error: 'Invoice not found' }
    }
    
    const invoiceData = invoiceDoc.data()
    console.log('📄 Invoice data:', invoiceData)
    
    // Update invoice status
    await updateDoc(invoiceRef, {
      status: 'paid',
      paidAt: serverTimestamp(),
      stripeSessionId: stripeSessionId || 'manual',
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Invoice status updated to paid')
    
    // Mark coupon as used if one was applied
    if (invoiceData.couponId) {
      try {
        const couponRef = doc(db, 'users', invoiceData.studentId, 'coupons', invoiceData.couponId)
        await updateDoc(couponRef, {
          used: true,
          usedAt: serverTimestamp(),
          usedForInvoiceId: invoiceId
        })
        console.log('✅ Coupon marked as used:', invoiceData.couponId)
      } catch (couponError) {
        console.warn('⚠️ Error marking coupon as used:', couponError)
      }
    }
    
    // Update tutor earnings statistics
    const tutorStatsRef = doc(db, 'tutorStats', invoiceData.tutorId)
    const tutorStatsDoc = await getDoc(tutorStatsRef)
    
    if (tutorStatsDoc.exists()) {
      const currentStats = tutorStatsDoc.data()
      await updateDoc(tutorStatsRef, {
        totalEarnings: (currentStats.totalEarnings || 0) + (invoiceData.tutorEarnings || 0),
        pendingEarnings: Math.max(0, (currentStats.pendingEarnings || 0) - (invoiceData.tutorEarnings || 0)),
        completedSessions: (currentStats.completedSessions || 0) + 1,
        updatedAt: serverTimestamp()
      })
      console.log('✅ Tutor stats updated')
    } else {
      await setDoc(tutorStatsRef, {
        totalEarnings: invoiceData.tutorEarnings || 0,
        pendingEarnings: 0,
        totalSessions: 1,
        totalRating: 0,
        ratingCount: 0,
        completedSessions: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log('✅ Tutor stats created')
    }
    
    console.log('✅ Invoice marked as paid:', invoiceId)
    
    return { success: true }
  } catch (error) {
    console.error('❌ Error marking invoice as paid:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 直接通过 invoiceId 更新账单为已支付（用于手动修复或前端直接调用）
 */
export const forceMarkInvoiceAsPaid = async (invoiceId) => {
  return markInvoiceAsPaid(invoiceId, 'force_paid_' + Date.now())
}

/**
 * 获取导师的钱包数据
 */
export const getTutorWallet = async (tutorId) => {
  try {
    console.log('💰 Loading wallet for tutor:', tutorId)
    
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
      console.log('📊 Tutor stats from DB:', data)
      stats = {
        totalEarnings: data.totalEarnings || 0,
        pendingEarnings: data.pendingEarnings || 0,
        completedSessions: data.completedSessions || 0
      }
    } else {
      console.log('📊 No tutor stats found, will calculate from invoices')
    }
    
    // 获取导师的所有账单（不使用复合索引，避免索引问题）
    let allInvoices = []
    try {
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('tutorId', '==', tutorId)
      )
      const invoicesSnapshot = await getDocs(invoicesQuery)
      allInvoices = invoicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('📋 Found', allInvoices.length, 'total invoices for tutor')
    } catch (queryError) {
      console.error('Error querying invoices:', queryError)
    }
    
    // 分离已支付和待支付账单
    const paidInvoices = allInvoices.filter(inv => inv.status === 'paid')
    const pendingInvoices = allInvoices.filter(inv => inv.status === 'pending')
    
    console.log('💳 Paid invoices:', paidInvoices.length)
    console.log('⏳ Pending invoices:', pendingInvoices.length)
    
    // 按 paidAt 排序已支付账单
    paidInvoices.sort((a, b) => {
      const aTime = a.paidAt?.toMillis?.() || a.paidAt?.seconds * 1000 || 0
      const bTime = b.paidAt?.toMillis?.() || b.paidAt?.seconds * 1000 || 0
      return bTime - aTime
    })
    
    // 计算实际收入（如果 tutorStats 为空，从账单计算）
    let totalEarnings = stats.totalEarnings
    if (totalEarnings === 0 && paidInvoices.length > 0) {
      totalEarnings = paidInvoices.reduce((sum, inv) => sum + (inv.tutorEarnings || 0), 0)
      console.log('💰 Calculated total earnings from invoices:', totalEarnings)
    }
    
    // 计算待收金额
    const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + (inv.tutorEarnings || 0), 0)
    
    const wallet = {
      totalEarnings: totalEarnings,
      pendingEarnings: pendingTotal,
      completedSessions: stats.completedSessions || paidInvoices.length,
      recentPayments: paidInvoices.slice(0, 5),
      pendingInvoices: pendingInvoices
    }
    
    console.log('💰 Final wallet data:', wallet)
    
    return {
      success: true,
      wallet
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

