import {
  createQuestRequestApi,
  getQuestRequestsApi,
  getUserQuestRequestsApi,
  approveQuestRequestApi,
  rejectQuestRequestApi
} from './questRequestApi'
import { fetchQuests, fetchQuestByKey } from './questApi'

if (typeof window !== 'undefined') {
  window.__QUEST_API_BASE__ = import.meta.env.VITE_API_BASE_URL
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[Quest API Base]', window.__QUEST_API_BASE__)
  }
}

const normalizeId = (value) => {
  if (!value) return value
  return typeof value === 'object' && value.toString ? value.toString() : value
}

const addIdField = (doc) => {
  if (!doc) return doc
  if (doc.id) return { ...doc, id: normalizeId(doc.id) }
  return {
    ...doc,
    id: normalizeId(doc._id || doc.questId || doc.requestId)
  }
}

/**
 * 创建 quest 请求
 * @param {string} userId - 用户 ID
 * @param {string} userName - 用户名称
 * @param {Object} questData - Quest 数据
 * @returns {Promise<{success: boolean, requestId?: string, error?: string}>}
 */
export const createQuestRequest = async (userId, userName, questData) => {
  try {
    const result = await createQuestRequestApi({ userId, userName, questData })
    console.log('✅ Quest request created:', result.requestId)
    return {
      success: true,
      requestId: result.requestId,
      request: addIdField(result.request)
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
    const result = await getQuestRequestsApi({ status: 'pending' })
    const requests = (result.requests || []).map(addIdField)
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
    console.log(`🔍 Fetching quest requests with status: ${status}`)
    const result = await getQuestRequestsApi({ status })
    const requests = (result.requests || []).map(addIdField)
    console.log(`✅ Loaded ${requests.length} quest requests (status: ${status})`)
    return {
      success: true,
      requests
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
    const result = await approveQuestRequestApi(requestId, adminUserId)
    console.log('✅ Quest request approved:', requestId, '→ Quest ID:', result.questId)
    return {
      success: true,
      questId: result.questId,
      request: addIdField(result.request)
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
    await rejectQuestRequestApi(requestId, adminUserId, rejectionReason)
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
    const params = {}
    if (subject) params.subject = subject
    if (category) params.category = category
    const result = await fetchQuests(params)
    const quests = (result.quests || []).map(addIdField)
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
    const result = await fetchQuestByKey({ questId, subject, category })
    if (result.success) {
      return {
        success: true,
        quest: addIdField(result.quest)
      }
    }
    return {
      success: false,
      error: 'Quest not found'
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
    const result = await getUserQuestRequestsApi(userId)
    const requests = (result.requests || []).map(addIdField)
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

