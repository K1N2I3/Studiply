// API service for communicating with backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://studiply.onrender.com/api' : 'http://localhost:3003/api')

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('studyHubToken')
}

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('studyHubToken', token)
}

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('studyHubToken')
}

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }
    
    return data
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

// User API functions
export const userAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  // Login user
  login: async (email, password) => {
    const response = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    
    if (response.success && response.token) {
      setAuthToken(response.token)
    }
    
    return response
  },

  // Logout user
  logout: () => {
    removeAuthToken()
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/profile')
  },

  // Verify email
  verifyEmail: async (email, code) => {
    return apiRequest('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    })
  },

  // Resend verification code
  resendVerification: async (email) => {
    return apiRequest('/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  // Forgot password - request reset code
  forgotPassword: async (email) => {
    return apiRequest('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  // Reset password with code
  resetPassword: async (email, code, newPassword) => {
    return apiRequest('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword })
    })
  }
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken()
}

// Get stored token
export const getToken = () => {
  return getAuthToken()
}

// Coupon API functions
export const purchaseCoupon = async (userId, couponType) => {
  const response = await fetch(`${API_BASE_URL}/coupons/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, couponType })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to purchase coupon')
  }
  
  return data
}

export const getUserCoupons = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/coupons/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch coupons')
  }
  
  return data
}

// Gold management API functions
export const updateUserGold = async (userId, gold, operation = 'set') => {
  const response = await fetch(`${API_BASE_URL}/gold/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, gold, operation })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update gold')
  }
  
  return data
}

export const getUserGold = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/gold/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch gold')
  }
  
  return data
}
