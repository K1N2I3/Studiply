import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { sendVerificationCode, verifyCode } from './services/twilioService.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://www.studiply.it',
    'https://studiply.it',
    'https://studiply-*.vercel.app',
    /^https:\/\/studiply-.*\.vercel\.app$/,
    /^https:\/\/.*\.onrender\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studyhub'
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  school: { type: String, required: true },
  grade: { type: String, required: true },
  phone: { type: String },
  phoneVerified: { type: Boolean, default: false },
  location: { type: String },
  bio: { type: String },
  subjects: [{ type: String }],
  emailVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Email configuration - Neo Email SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp0001.neo.space',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT, // 465 端口使用 SSL
  auth: {
    user: process.env.EMAIL_USER || 'noreply@studiply.it',
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // 如果需要
  }
})

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send verification email
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: `"Studiply" <${process.env.EMAIL_USER || 'noreply@studiply.it'}>`,
    to: email,
    subject: 'Studiply - Email Verification',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header with gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Studiply</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Email Verification</h2>
                    <p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">Thank you for registering with Studiply! Please use the verification code below to complete your registration.</p>
                    
                    <!-- Verification Code Box -->
                    <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border: 2px solid #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                      <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Verification Code</p>
                      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 15px 0;">
                        <h1 style="color: #667eea; margin: 0; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</h1>
                      </div>
                    </div>
                    
                    <p style="color: #666666; margin: 20px 0 0 0; font-size: 14px; line-height: 1.6;">Enter this code in the application to verify your email address. This code will expire in <strong>10 minutes</strong>.</p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #999999; margin: 0; font-size: 12px; line-height: 1.5;">If you didn't request this verification code, please ignore this email.</p>
                    <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }

  await transporter.sendMail(mailOptions)
}

// API Routes

// Root endpoint (for health checks)
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Studiply API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: '/api/register',
      login: '/api/login',
      verifyEmail: '/api/verify-email',
      sendPhoneVerification: '/api/send-phone-verification',
      verifyPhone: '/api/verify-phone'
    }
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Studiply API is running',
    timestamp: new Date().toISOString()
  })
})

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, school, grade, phone, location, bio, subjects } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'This email is already registered' 
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification code
    const verificationCode = generateVerificationCode()

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      school,
      grade,
      phone: phone || undefined,
      phoneVerified: phone ? false : undefined, // Only set if phone is provided
      location,
      bio,
      subjects,
      verificationCode
    })

    await user.save()

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      userId: user._id
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    })
  }
})

// Verify email
app.post('/api/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      })
    }

    // Update user as verified
    user.emailVerified = true
    user.verificationCode = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Email verified successfully'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      error: 'Verification failed. Please try again.'
    })
  }
})

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email before logging in'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      school: user.school,
      grade: user.grade,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      location: user.location,
      bio: user.bio,
      subjects: user.subjects
    }

    res.json({
      success: true,
      user: userData,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    })
  }
})

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password -verificationCode')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    res.json({
      success: true,
      user
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    })
  }
})

// Resend verification code
app.post('/api/resend-verification', async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified'
      })
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode()
    user.verificationCode = verificationCode
    await user.save()

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode)
      res.json({
        success: true,
        message: 'Verification code sent successfully'
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      })
    }

  } catch (error) {
    console.error('Resend verification error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to resend verification code'
    })
  }
})

// Send phone verification code
app.post('/api/send-phone-verification', async (req, res) => {
  try {
    const { phoneNumber } = req.body

    console.log('📞 Received phone verification request:', { phoneNumber })

    if (!phoneNumber) {
      console.log('❌ Phone number is missing')
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      })
    }

    // Normalize phone number to E.164 format (remove all non-digit characters except +)
    const cleaned = phoneNumber.trim()
    let normalizedPhone = cleaned.startsWith('+') 
      ? '+' + cleaned.slice(1).replace(/\D/g, '')
      : cleaned.replace(/\D/g, '')

    // If normalized phone doesn't start with +, add it (assuming it's missing country code)
    if (!normalizedPhone.startsWith('+')) {
      console.log('⚠️ Phone number missing +, adding it')
      normalizedPhone = '+' + normalizedPhone
    }

    console.log('📞 Normalized phone number:', normalizedPhone)

    // Validate normalized phone has at least country code + number (minimum 8 digits after +)
    if (normalizedPhone.length < 10) {
      console.log('❌ Phone number too short:', normalizedPhone)
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Phone number is too short.'
      })
    }

    const result = await sendVerificationCode(normalizedPhone)
    
    console.log('📞 Twilio result:', result)
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Verification code sent successfully'
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to send verification code'
      })
    }
  } catch (error) {
    console.error('❌ Send phone verification error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send verification code'
    })
  }
})

// Verify phone code
app.post('/api/verify-phone', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and code are required'
      })
    }

    // Normalize phone number to E.164 format (remove all non-digit characters except +)
    const cleaned = phoneNumber.trim()
    const normalizedPhone = cleaned.startsWith('+') 
      ? '+' + cleaned.slice(1).replace(/\D/g, '')
      : cleaned.replace(/\D/g, '')

    const result = await verifyCode(normalizedPhone, code)
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Phone number verified successfully'
      })
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Invalid verification code'
      })
    }
  } catch (error) {
    console.error('Verify phone error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to verify phone number'
    })
  }
})

// Send verification email (for frontend to call)
app.post('/api/send-verification-email', async (req, res) => {
  try {
    const { email, code } = req.body

    console.log('📧 Received email verification request:', { email })

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Email and code are required'
      })
    }

    // Validate email format
    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      })
    }

    await sendVerificationEmail(email, code)
    
    console.log('✅ Verification email sent successfully to:', email)
    res.json({
      success: true,
      message: 'Verification email sent successfully'
    })
  } catch (error) {
    console.error('❌ Error sending verification email:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send verification email'
    })
  }
})

// Send calendar reminder email
app.post('/api/send-calendar-reminder', async (req, res) => {
  try {
    const { email, eventTitle, eventDate, eventTime, reminderDays } = req.body

    console.log('📅 Received calendar reminder request:', { email, eventTitle })

    if (!email || !eventTitle) {
      return res.status(400).json({
        success: false,
        error: 'Email and event title are required'
      })
    }

    // Validate email format
    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      })
    }

    const mailOptions = {
      from: `"Studiply Calendar" <${process.env.EMAIL_USER || 'noreply@studiply.it'}>`,
      to: email,
      subject: `Reminder: ${eventTitle} - ${reminderDays} day${reminderDays > 1 ? 's' : ''} before`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header with gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">📅 Event Reminder</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Upcoming Event</h2>
                      <p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">This is a reminder that you have an upcoming event:</p>
                      
                      <!-- Event Details Box -->
                      <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border: 2px solid #667eea; border-radius: 12px; padding: 30px; margin: 30px 0;">
                        <h3 style="color: #667eea; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">${eventTitle}</h3>
                        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-top: 15px;">
                          ${eventDate ? `<p style="margin: 10px 0; color: #333333; font-size: 16px;"><strong style="color: #667eea;">📅 Date:</strong> ${eventDate}</p>` : ''}
                          ${eventTime ? `<p style="margin: 10px 0; color: #333333; font-size: 16px;"><strong style="color: #667eea;">⏰ Time:</strong> ${eventTime}</p>` : ''}
                          <p style="margin: 10px 0 0 0; color: #333333; font-size: 16px;"><strong style="color: #667eea;">🔔 Reminder:</strong> ${reminderDays} day${reminderDays > 1 ? 's' : ''} before</p>
                        </div>
                      </div>
                      
                      <p style="color: #666666; margin: 20px 0 0 0; font-size: 16px; line-height: 1.6;">Don't forget to prepare for this event!</p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="color: #999999; margin: 0; font-size: 12px; line-height: 1.5;">This is an automated reminder from Studiply Calendar.</p>
                      <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    }

    await transporter.sendMail(mailOptions)
    
    console.log('✅ Calendar reminder sent successfully to:', email)
    res.json({
      success: true,
      message: 'Calendar reminder sent successfully'
    })
  } catch (error) {
    console.error('❌ Error sending calendar reminder:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send calendar reminder'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Studiply API Server running on port ${PORT}`)
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`)
  console.log(`🗄️  Database: ${MONGODB_URI}`)
})
