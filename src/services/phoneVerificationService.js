// Phone verification service for communicating with backend API
// Use environment variable if available, otherwise fallback to localhost for development
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL
  if (envUrl) {
    return envUrl
  }
  
  if (import.meta.env.PROD) {
    console.error('❌ VITE_API_BASE_URL is not set in production! Please configure it in Vercel environment variables.')
    throw new Error('Backend API URL is not configured. Please contact support.')
  }
  
  return 'http://localhost:3003/api'
}

const API_BASE_URL = getApiBaseUrl()

/**
 * Normalize phone number to E.164 format (removes spaces and other non-digit characters except +)
 * @param {string} phoneNumber - Phone number in any format
 * @returns {string} - Phone number in E.164 format (e.g., +393892556888)
 */
const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''
  // Keep the + sign if present, then remove all non-digit characters
  const cleaned = phoneNumber.trim()
  if (cleaned.startsWith('+')) {
    return '+' + cleaned.slice(1).replace(/\D/g, '')
  }
  return cleaned.replace(/\D/g, '')
}

/**
 * Send verification code to phone number
 * @param {string} phoneNumber - Phone number in E.164 format
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendPhoneVerificationCode = async (phoneNumber) => {
  try {
    // Normalize phone number to E.164 format (remove spaces)
    const normalizedPhone = normalizePhoneNumber(phoneNumber)
    
    const response = await fetch(`${API_BASE_URL}/send-phone-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber: normalizedPhone })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error sending verification code:', error)
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.'
    }
  }
}

/**
 * Verify the code sent to phone number
 * @param {string} phoneNumber - Phone number in E.164 format
 * @param {string} code - 6-digit verification code
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyPhoneCode = async (phoneNumber, code) => {
  try {
    // Normalize phone number to E.164 format (remove spaces)
    const normalizedPhone = normalizePhoneNumber(phoneNumber)
    
    const response = await fetch(`${API_BASE_URL}/verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber: normalizedPhone, code })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error verifying code:', error)
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.'
    }
  }
}

