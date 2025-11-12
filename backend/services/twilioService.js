import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

if (!accountSid || !authToken || !verifyServiceSid) {
  console.warn('⚠️  Twilio credentials not configured. Phone verification will not work.')
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

/**
 * Send verification code to phone number
 * @param {string} phoneNumber - Phone number in E.164 format (e.g., +1234567890)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendVerificationCode = async (phoneNumber) => {
  if (!client) {
    return {
      success: false,
      error: 'Twilio service not configured'
    }
  }

  try {
    // Validate phone number format (basic check)
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      return {
        success: false,
        error: 'Invalid phone number format. Must include country code (e.g., +1234567890)'
      }
    }

    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications
      .create({
        to: phoneNumber,
        channel: 'sms'
      })

    console.log('✅ Verification code sent:', verification.sid)
    return {
      success: true,
      sid: verification.sid
    }
  } catch (error) {
    console.error('❌ Error sending verification code:', error)
    
    // Handle specific Twilio errors
    if (error.code === 60200) {
      return {
        success: false,
        error: 'Invalid phone number format'
      }
    } else if (error.code === 60203) {
      return {
        success: false,
        error: 'Maximum verification attempts reached. Please try again later.'
      }
    } else if (error.code === 20429) {
      return {
        success: false,
        error: 'Too many requests. Please wait a moment and try again.'
      }
    }
    
    return {
      success: false,
      error: error.message || 'Failed to send verification code'
    }
  }
}

/**
 * Verify the code sent to phone number
 * @param {string} phoneNumber - Phone number in E.164 format
 * @param {string} code - 6-digit verification code
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyCode = async (phoneNumber, code) => {
  if (!client) {
    return {
      success: false,
      error: 'Twilio service not configured'
    }
  }

  try {
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      return {
        success: false,
        error: 'Invalid phone number format'
      }
    }

    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return {
        success: false,
        error: 'Invalid verification code. Must be 6 digits.'
      }
    }

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks
      .create({
        to: phoneNumber,
        code: code
      })

    if (verificationCheck.status === 'approved') {
      console.log('✅ Phone number verified:', phoneNumber)
      return {
        success: true
      }
    } else {
      return {
        success: false,
        error: 'Invalid or expired verification code'
      }
    }
  } catch (error) {
    console.error('❌ Error verifying code:', error)
    
    if (error.code === 20404) {
      return {
        success: false,
        error: 'Verification code not found or expired. Please request a new code.'
      }
    } else if (error.code === 60202) {
      return {
        success: false,
        error: 'Too many verification attempts. Please request a new code.'
      }
    }
    
    return {
      success: false,
      error: error.message || 'Failed to verify code'
    }
  }
}

