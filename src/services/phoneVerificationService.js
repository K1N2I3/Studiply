// Phone verification service for communicating with backend API
// Use environment variable if available, otherwise fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD 
    ? 'https://your-backend-url.com/api'  // Update this with your actual backend URL
    : 'http://localhost:3003/api')

/**
 * Send verification code to phone number
 * @param {string} phoneNumber - Phone number in E.164 format
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendPhoneVerificationCode = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-phone-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber })
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
    const response = await fetch(`${API_BASE_URL}/verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber, code })
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

