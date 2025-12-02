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

export const fetchQuests = async (params = {}) => {
  const response = await fetch(`${API_BASE_URL}/quests${buildQuery(params)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch quests')
  }
  return response.json()
}

export const fetchQuestByKey = async ({ subject, category, questId }) => {
  const response = await fetch(`${API_BASE_URL}/quests/by-key${buildQuery({ subject, category, questId })}`)
  if (!response.ok) {
    throw new Error('Failed to fetch quest')
  }
  return response.json()
}

export const saveQuest = async (quest) => {
  const response = await fetch(`${API_BASE_URL}/quests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quest)
  })

  if (!response.ok) {
    throw new Error('Failed to save quest')
  }

  return response.json()
}

export const updateQuestByKey = async (quest) => {
  const response = await fetch(`${API_BASE_URL}/quests/by-key`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quest)
  })

  if (!response.ok) {
    throw new Error('Failed to update quest')
  }

  return response.json()
}

export const saveQuestsBulk = async (quests) => {
  const response = await fetch(`${API_BASE_URL}/quests/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quests })
  })

  if (!response.ok) {
    throw new Error('Failed to save quests in bulk')
  }

  return response.json()
}
