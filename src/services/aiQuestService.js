const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Request failed')
  }
  return response.json()
}

/**
 * 使用 AI 生成 quest
 * @param {string} userId - 用户 ID
 * @param {string} userName - 用户名称
 * @param {string} subject - 科目
 * @param {string} prompt - 问题描述/提示词
 * @param {string} difficulty - 难度级别
 * @param {number} questionCount - 问题数量
 * @returns {Promise<{success: boolean, quest?: Object, error?: string}>}
 */
export const generateAIQuest = async (userId, userName, subject, prompt, difficulty = 'beginner', questionCount = 5) => {
  try {
    console.log('🤖 [AI Quest Service] Generating quest:', { userId, subject, prompt, difficulty, questionCount })
    
    const response = await fetch(`${API_BASE_URL}/ai-quests/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        userName,
        subject,
        prompt,
        difficulty,
        questionCount
      })
    })

    const result = await handleResponse(response)
    console.log('✅ [AI Quest Service] Quest generated successfully:', result.questId)
    return {
      success: true,
      quest: result.quest,
      questId: result.questId
    }
  } catch (error) {
    console.error('❌ [AI Quest Service] Error generating quest:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate AI quest'
    }
  }
}

/**
 * 获取用户的 AI 生成的 quests
 * @param {string} userId - 用户 ID
 * @returns {Promise<{success: boolean, quests?: Array, error?: string}>}
 */
export const getUserAIQuests = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-quests/user/${userId}`)
    const result = await handleResponse(response)
    return {
      success: true,
      quests: result.quests || []
    }
  } catch (error) {
    console.error('Error fetching user AI quests:', error)
    return {
      success: false,
      error: error.message,
      quests: []
    }
  }
}

/**
 * 获取单个 AI quest
 * @param {string} questId - Quest ID
 * @param {string} userId - 用户 ID（用于验证权限）
 * @returns {Promise<{success: boolean, quest?: Object, error?: string}>}
 */
export const getAIQuest = async (questId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-quests/${questId}?userId=${userId}`)
    const result = await handleResponse(response)
    return {
      success: true,
      quest: result.quest
    }
  } catch (error) {
    console.error('Error fetching AI quest:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 删除 AI quest
 * @param {string} questId - Quest ID
 * @param {string} userId - 用户 ID（用于验证权限）
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAIQuest = async (questId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-quests/${questId}?userId=${userId}`, {
      method: 'DELETE'
    })
    await handleResponse(response)
    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting AI quest:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

