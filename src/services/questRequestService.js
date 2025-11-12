import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Firebase 集合名称
const QUEST_REQUESTS_COLLECTION = 'questRequests'
const APPROVED_QUESTS_COLLECTION = 'quests'

/**
 * 创建 quest 请求
 * @param {string} userId - 用户 ID
 * @param {string} userName - 用户名称
 * @param {Object} questData - Quest 数据
 * @returns {Promise<{success: boolean, requestId?: string, error?: string}>}
 */
export const createQuestRequest = async (userId, userName, questData) => {
  try {
    const questRequestsRef = collection(db, QUEST_REQUESTS_COLLECTION)
    
    const requestData = {
      title: questData.title,
      description: questData.description || '',
      subject: questData.subject,
      category: questData.category,
      difficulty: questData.difficulty, // 'beginner' | 'intermediate' | 'advanced'
      questionType: questData.questionType, // 'multiple-choice' | 'fill-in-blank'
      questions: questData.questions || [],
      createdBy: userId,
      createdByName: userName,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(questRequestsRef, requestData)
    
    console.log('✅ Quest request created:', docRef.id)
    return {
      success: true,
      requestId: docRef.id
    }
  } catch (error) {
    console.error('❌ Error creating quest request:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 获取待审核的 quest 请求（仅管理员）
 * @returns {Promise<{success: boolean, requests?: Array, error?: string}>}
 */
export const getPendingQuestRequests = async () => {
  try {
    const questRequestsRef = collection(db, QUEST_REQUESTS_COLLECTION)
    const q = query(
      questRequestsRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const requests = []
    
    querySnapshot.forEach((docSnap) => {
      requests.push({
        id: docSnap.id,
        ...docSnap.data()
      })
    })
    
    console.log(`✅ Loaded ${requests.length} pending quest requests`)
    return {
      success: true,
      requests
    }
  } catch (error) {
    console.error('❌ Error fetching pending quest requests:', error)
    return {
      success: false,
      error: error.message,
      requests: []
    }
  }
}

/**
 * 获取所有 quest 请求（按状态筛选，仅管理员）
 * @param {string} status - 'pending' | 'approved' | 'rejected' | 'all'
 * @returns {Promise<{success: boolean, requests?: Array, error?: string}>}
 */
export const getQuestRequestsByStatus = async (status = 'all') => {
  try {
    const questRequestsRef = collection(db, QUEST_REQUESTS_COLLECTION)
    let q
    
    console.log(`🔍 Fetching quest requests with status: ${status}`)
    
    if (status === 'all') {
      // For 'all', try to get all documents first, then sort client-side if orderBy fails
      try {
        q = query(questRequestsRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        const requests = []
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data()
          requests.push({
            id: docSnap.id,
            ...data
          })
        })
        
        console.log(`✅ Loaded ${requests.length} quest requests (status: ${status})`)
        return {
          success: true,
          requests
        }
      } catch (orderByError) {
        // If orderBy fails (e.g., no index), get all and sort client-side
        console.log('⚠️ orderBy failed, fetching all and sorting client-side:', orderByError.message)
        const querySnapshot = await getDocs(questRequestsRef)
        const requests = []
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data()
          requests.push({
            id: docSnap.id,
            ...data
          })
        })
        
        // Sort by createdAt client-side
        requests.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds || 0
          const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds || 0
          return bTime - aTime
        })
        
        console.log(`✅ Loaded ${requests.length} quest requests (status: ${status}, client-side sorted)`)
        return {
          success: true,
          requests
        }
      }
    } else {
      // For specific status, try with orderBy first
      try {
        q = query(
          questRequestsRef,
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const requests = []
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data()
          requests.push({
            id: docSnap.id,
            ...data
          })
        })
        
        console.log(`✅ Loaded ${requests.length} quest requests (status: ${status})`)
        return {
          success: true,
          requests
        }
      } catch (orderByError) {
        // If orderBy fails, filter client-side
        console.log('⚠️ orderBy failed, filtering client-side:', orderByError.message)
        const querySnapshot = await getDocs(questRequestsRef)
        const requests = []
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data()
          if (data.status === status) {
            requests.push({
              id: docSnap.id,
              ...data
            })
          }
        })
        
        // Sort by createdAt client-side
        requests.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds || 0
          const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds || 0
          return bTime - aTime
        })
        
        console.log(`✅ Loaded ${requests.length} quest requests (status: ${status}, client-side filtered & sorted)`)
        return {
          success: true,
          requests
        }
      }
    }
  } catch (error) {
    console.error('❌ Error fetching quest requests:', error)
    return {
      success: false,
      error: error.message,
      requests: []
    }
  }
}

/**
 * 批准 quest 请求
 * @param {string} requestId - Quest 请求 ID
 * @param {string} adminUserId - 管理员用户 ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const approveQuestRequest = async (requestId, adminUserId) => {
  try {
    // 1. 获取 quest 请求数据
    const requestRef = doc(db, QUEST_REQUESTS_COLLECTION, requestId)
    const requestSnap = await getDoc(requestRef)
    
    if (!requestSnap.exists()) {
      return {
        success: false,
        error: 'Quest request not found'
      }
    }
    
    const requestData = requestSnap.data()
    
    // 2. 生成 quest ID（使用 subject_category_timestamp 格式）
    const timestamp = Date.now()
    const questId = `user-quest-${timestamp}`
    const questDocId = `${requestData.subject}_${requestData.category}_${questId}`
    
    // 3. 保存到 approved quests 集合
    const approvedQuestRef = doc(db, APPROVED_QUESTS_COLLECTION, questDocId)
    await setDoc(approvedQuestRef, {
      ...requestData,
      id: questId,
      questId: questId,
      status: 'approved',
      reviewedAt: serverTimestamp(),
      reviewedBy: adminUserId,
      approvedAt: serverTimestamp()
    })
    
    // 4. 更新 quest 请求状态
    await updateDoc(requestRef, {
      status: 'approved',
      reviewedAt: serverTimestamp(),
      reviewedBy: adminUserId,
      approvedQuestId: questId,
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Quest request approved:', requestId, '→ Quest ID:', questId)
    return {
      success: true,
      questId: questId
    }
  } catch (error) {
    console.error('❌ Error approving quest request:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 拒绝 quest 请求
 * @param {string} requestId - Quest 请求 ID
 * @param {string} adminUserId - 管理员用户 ID
 * @param {string} rejectionReason - 拒绝原因（可选）
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const rejectQuestRequest = async (requestId, adminUserId, rejectionReason = '') => {
  try {
    const requestRef = doc(db, QUEST_REQUESTS_COLLECTION, requestId)
    const requestSnap = await getDoc(requestRef)
    
    if (!requestSnap.exists()) {
      return {
        success: false,
        error: 'Quest request not found'
      }
    }
    
    await updateDoc(requestRef, {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy: adminUserId,
      rejectionReason: rejectionReason || 'No reason provided',
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ Quest request rejected:', requestId)
    return {
      success: true
    }
  } catch (error) {
    console.error('❌ Error rejecting quest request:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 获取已审核通过的 quests
 * @param {string} subject - 科目（可选）
 * @param {string} category - 分类（可选）
 * @returns {Promise<{success: boolean, quests?: Array, error?: string}>}
 */
export const getApprovedQuests = async (subject = null, category = null) => {
  try {
    const approvedQuestsRef = collection(db, APPROVED_QUESTS_COLLECTION)
    let q
    
    if (subject && category) {
      q = query(
        approvedQuestsRef,
        where('subject', '==', subject),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
    } else if (subject) {
      q = query(
        approvedQuestsRef,
        where('subject', '==', subject),
        orderBy('createdAt', 'desc')
      )
    } else {
      q = query(approvedQuestsRef, orderBy('createdAt', 'desc'))
    }
    
    const querySnapshot = await getDocs(q)
    const quests = []
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data()
      quests.push({
        id: docSnap.id,
        ...data
      })
    })
    
    console.log(`✅ Loaded ${quests.length} approved quests`)
    return {
      success: true,
      quests
    }
  } catch (error) {
    console.error('❌ Error fetching approved quests:', error)
    return {
      success: false,
      error: error.message,
      quests: []
    }
  }
}

/**
 * 获取单个 quest（从已审核的集合）
 * @param {string} questId - Quest ID
 * @param {string} subject - 科目
 * @param {string} category - 分类
 * @returns {Promise<{success: boolean, quest?: Object, error?: string}>}
 */
export const getApprovedQuest = async (questId, subject, category) => {
  try {
    const questDocId = `${subject}_${category}_${questId}`
    const questRef = doc(db, APPROVED_QUESTS_COLLECTION, questDocId)
    const questSnap = await getDoc(questRef)
    
    if (questSnap.exists()) {
      return {
        success: true,
        quest: {
          id: questSnap.id,
          ...questSnap.data()
        }
      }
    } else {
      // 也尝试直接通过 questId 查找（如果是用户创建的 quest）
      const approvedQuestsRef = collection(db, APPROVED_QUESTS_COLLECTION)
      const q = query(
        approvedQuestsRef,
        where('questId', '==', questId),
        where('subject', '==', subject),
        where('category', '==', category)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const questData = querySnapshot.docs[0].data()
        return {
          success: true,
          quest: {
            id: querySnapshot.docs[0].id,
            ...questData
          }
        }
      }
      
      return {
        success: false,
        error: 'Quest not found'
      }
    }
  } catch (error) {
    console.error('❌ Error fetching approved quest:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 获取用户创建的 quest 请求
 * @param {string} userId - 用户 ID
 * @returns {Promise<{success: boolean, requests?: Array, error?: string}>}
 */
export const getUserQuestRequests = async (userId) => {
  try {
    const questRequestsRef = collection(db, QUEST_REQUESTS_COLLECTION)
    const q = query(
      questRequestsRef,
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const requests = []
    
    querySnapshot.forEach((docSnap) => {
      requests.push({
        id: docSnap.id,
        ...docSnap.data()
      })
    })
    
    console.log(`✅ Loaded ${requests.length} quest requests for user ${userId}`)
    return {
      success: true,
      requests
    }
  } catch (error) {
    console.error('❌ Error fetching user quest requests:', error)
    return {
      success: false,
      error: error.message,
      requests: []
    }
  }
}

