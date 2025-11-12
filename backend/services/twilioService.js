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

// Check if this is a trial account (trial accounts can only send to verified numbers)
const isTrialAccount = async () => {
  if (!client) return false
  try {
    const account = await client.api.accounts(accountSid).fetch()
    return account.type === 'Trial'
  } catch (error) {
    console.warn('⚠️  Could not check Twilio account type:', error.message)
    return false
  }
}

/**
 * Send verification code to phone number
 * @param {string} phoneNumber - Phone number in E.164 format (e.g., +1234567890)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendVerificationCode = async (phoneNumber) => {
  if (!client) {
    console.error('❌ Twilio client not initialized. Check environment variables:')
    console.error('   TWILIO_ACCOUNT_SID:', accountSid ? '✅ Set' : '❌ Missing')
    console.error('   TWILIO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing')
    console.error('   TWILIO_VERIFY_SERVICE_SID:', verifyServiceSid ? '✅ Set' : '❌ Missing')
    return {
      success: false,
      error: 'Twilio service not configured. Please contact support.'
    }
  }

  try {
    console.log('📞 Attempting to send verification code to:', phoneNumber)
    console.log('📞 Using Verify Service SID:', verifyServiceSid)
    
    // Validate phone number format (basic check)
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      console.error('❌ Invalid phone format - missing +:', phoneNumber)
      return {
        success: false,
        error: 'Invalid phone number format. Must include country code (e.g., +1234567890)'
      }
    }

    // Additional validation: phone should have at least 10 characters (+country code + number)
    if (phoneNumber.length < 10) {
      console.error('❌ Phone number too short:', phoneNumber)
      return {
        success: false,
        error: 'Invalid phone number format. Phone number is too short.'
      }
    }

    // Try to lookup the phone number first to validate format (optional, but helpful)
    try {
      const lookupResult = await client.lookups.v1.phoneNumbers(phoneNumber).fetch()
      console.log('✅ Phone number lookup successful:', {
        phoneNumber: lookupResult.phoneNumber,
        countryCode: lookupResult.countryCode,
        nationalFormat: lookupResult.nationalFormat
      })
    } catch (lookupError) {
      console.warn('⚠️  Phone number lookup failed (this is OK, continuing anyway):', lookupError.message)
      // Don't fail if lookup fails, just log it
    }

    console.log('📞 Creating verification with Verify Service:', verifyServiceSid)
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications
      .create({
        to: phoneNumber,
        channel: 'sms'
      })

    console.log('✅ Verification code sent successfully:', verification.sid)
    return {
      success: true,
      sid: verification.sid
    }
  } catch (error) {
    console.error('❌ Twilio API error:', {
      code: error.code,
      message: error.message,
      status: error.status,
      phoneNumber
    })
    
    // Handle specific Twilio errors
    if (error.code === 60200) {
      // Error 60200: Invalid parameter - usually means phone number format is invalid
      // This can happen if:
      // 1. Phone number is not in valid E.164 format
      // 2. Phone number is not a valid/active number
      // 3. Twilio trial account restrictions (can only send to verified numbers)
      // 4. Verify Service SID is incorrect
      console.error('❌ Twilio 60200: Invalid parameter. Possible reasons:')
      console.error('   1. Phone number format invalid (should be E.164: +[country][number])')
      console.error('   2. Phone number is not a valid/active number')
      console.error('   3. Twilio trial account - can only send to verified numbers')
      console.error('   4. Phone number contains invalid characters')
      console.error('   5. Verify Service SID might be incorrect')
      console.error('   Phone number received:', phoneNumber)
      console.error('   Phone number length:', phoneNumber.length)
      console.error('   Verify Service SID:', verifyServiceSid)
      console.error('   Expected format: +[country code][number] (e.g., +393885666661 for Italy)')
      
      // Check if it's a trial account issue
      const trialCheck = await isTrialAccount().catch(() => false)
      if (trialCheck) {
        console.error('   ⚠️  This appears to be a Twilio Trial account.')
        console.error('   ⚠️  Trial accounts can only send to verified phone numbers.')
        console.error('   ⚠️  Note: Verified Caller IDs are different from Verify Service.')
        console.error('   ⚠️  For Verify Service, you still need to verify numbers in:')
        console.error('   ⚠️  https://console.twilio.com/us1/develop/phone-numbers/manage/verified')
      }
      
      // Try to validate the Verify Service
      try {
        const service = await client.verify.v2.services(verifyServiceSid).fetch()
        console.log('✅ Verify Service exists:', service.friendlyName)
      } catch (serviceError) {
        console.error('❌ Verify Service SID might be invalid!')
        console.error('   Error:', serviceError.message)
        return {
          success: false,
          error: 'Verify Service configuration error. Please check TWILIO_VERIFY_SERVICE_SID in environment variables.'
        }
      }
      
      return {
        success: false,
        error: 'Invalid phone number. Please check that the number is correct and active. If you are using a Twilio trial account, you must verify the phone number in Twilio Console first (https://console.twilio.com/us1/develop/phone-numbers/manage/verified). Also ensure your Verify Service SID is correct.'
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
      error: error.message || 'Failed to send verification code. Please try again.'
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

