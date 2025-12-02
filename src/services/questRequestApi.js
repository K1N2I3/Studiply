const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

const buildQuery = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value)
    }
  })

  const qs = query.toString()
  return qs ? `?${qs}` : ''
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Request failed')
  }
  return response.json()
}

export const createQuestRequestApi = async ({ userId, userName, questData }) => {
  const url = `${API_BASE_URL}/quest-requests`
  console.log('📤 [Quest Request API] Sending request to:', url)
  console.log('📤 [Quest Request API] Request data:', {
    userId,
    userName,
    subject: questData?.subject,
    category: questData?.category,
    title: questData?.title
  })
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName, questData })
    })
    
    console.log('📥 [Quest Request API] Response status:', response.status)
    const result = await handleResponse(response)
    console.log('✅ [Quest Request API] Success:', result.requestId)
    return result
  } catch (error) {
    console.error('❌ [Quest Request API] Error:', error)
    throw error
  }
}

export const getQuestRequestsApi = async (params = {}) => {
  const response = await fetch(`${API_BASE_URL}/quest-requests${buildQuery(params)}`)
  return handleResponse(response)
}

export const getUserQuestRequestsApi = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/quest-requests/user/${userId}`)
  return handleResponse(response)
}

export const approveQuestRequestApi = async (requestId, adminUserId) => {
  const response = await fetch(`${API_BASE_URL}/quest-requests/${requestId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminUserId })
  })
  return handleResponse(response)
}

export const rejectQuestRequestApi = async (requestId, adminUserId, rejectionReason) => {
  const response = await fetch(`${API_BASE_URL}/quest-requests/${requestId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminUserId, rejectionReason })
  })
  return handleResponse(response)
}

export const deleteQuestRequestApi = async (requestId) => {
  const response = await fetch(`${API_BASE_URL}/quest-requests/${requestId}`, {
    method: 'DELETE'
  })
  return handleResponse(response)
}



