import emailjs from '@emailjs/browser'

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_wx8tfa8'
const EMAILJS_TEMPLATE_ID = 'template_8ncg4ek'
const EMAILJS_PUBLIC_KEY = 'q3eK04PCYjcxxpUzh'

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    console.log('📧 Preparing to send email...')
    console.log('Email:', email)
    console.log('Verification Code:', verificationCode)
    
    // Template parameters for EmailJS - comprehensive variable mapping
    const templateParams = {
      // Primary variables
      to_email: email,
      to_name: email.split('@')[0],
      verification_code: verificationCode,
      code: verificationCode,
      otp: verificationCode,
      password: verificationCode,
      
      // App information
      app_name: 'Studiply',
      from_name: 'Studiply Team',
      
      // User information
      user_email: email,
      user_name: email.split('@')[0],
      email: email,
      name: email.split('@')[0],
      
      // Additional fields
      reply_to: email,
      company_name: 'Studiply',
      website: 'Studiply'
    }

    console.log('📋 Template Parameters:', templateParams)
    console.log('🔧 EmailJS Configuration:')
    console.log('- Service ID:', EMAILJS_SERVICE_ID)
    console.log('- Template ID:', EMAILJS_TEMPLATE_ID)
    console.log('- Public Key:', EMAILJS_PUBLIC_KEY.substring(0, 10) + '...')

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('✅ Email sent successfully:', response)
    return { success: true, message: 'Verification code sent successfully' }
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    console.error('Error Details:', {
      status: error.status,
      text: error.text,
      message: error.message
    })
    
    // Provide more detailed error information
    let errorMessage = 'Failed to send verification code'
    if (error.status === 422 && error.text?.includes('recipients address is empty')) {
      errorMessage = 'EmailJS template configuration error: recipient address is empty. Please check EmailJS template configuration.'
    } else if (error.status === 400) {
      errorMessage = 'EmailJS template or service configuration error. Please check EmailJS configuration.'
    } else if (error.status === 401) {
      errorMessage = 'EmailJS API Key is invalid. Please check Public Key configuration.'
    }
    
    return { success: false, message: errorMessage }
  }
}

// Alternative: Backend API email sending
export const sendVerificationEmailBackend = async (email, verificationCode) => {
  try {
    const response = await fetch('http://localhost:3003/api/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        code: verificationCode
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log(`✅ Backend email sent to: ${email}`)
      return { success: true, message: result.message }
    } else {
      console.error('❌ Backend email failed:', result.message)
      return { success: false, message: result.message }
    }
  } catch (error) {
    console.error('❌ Backend API error:', error)
    return { success: false, message: 'Unable to connect to email service. Please check if backend service is running.' }
  }
}

// Simple email sending without EmailJS (for demo)
export const sendVerificationEmailSimple = async (email, verificationCode) => {
  // This is a fallback method that simulates sending email
  // In a real application, you would use a proper email service
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Log the verification code (for demo purposes)
    console.log(`📧 Verification email sent to: ${email}`)
    console.log(`🔐 Verification code: ${verificationCode}`)
    
    // In a real app, you would integrate with services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP
    
    return { success: true, message: 'Verification code sent successfully' }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, message: 'Failed to send verification code' }
  }
}
