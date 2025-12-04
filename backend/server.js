import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { sendVerificationEmail, sendEmailChangeVerification, sendCalendarReminder, sendStreakReminder } from './services/emailService.js'
import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { sendVerificationCode, verifyCode } from './services/twilioService.js'
import paymentRoutes from './routes/payment.js'
import limitsRoutes from './routes/limits.js'
import questsRoutes from './routes/quests.js'
import questRequestRoutes from './routes/questRequests.js'
import aiQuestsRoutes from './routes/aiQuests.js'

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
    'https://studiply.vercel.app',
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

// Initialize Firebase Admin (if not already initialized)
let firestore = null
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      })
      firestore = admin.firestore()
      console.log('✅ Firebase Admin initialized for streak reminders')
    }
  } catch (error) {
    console.warn('⚠️ Firebase Admin not initialized (streak reminders will be disabled):', error.message)
  }
} else {
  firestore = admin.firestore()
}

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// SMTP transporter for other email types (email change, calendar reminders, etc.)
// Note: Verification emails now use Resend API (see services/emailService.js)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp0001.neo.space',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL_USER || 'no-reply@studiply.it',
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  pool: true,
  maxConnections: 10,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
  rateDelta: 1000,
  rateLimit: 10,
  disableFileAccess: true,
  disableUrlAccess: true,
  requireTLS: false
})

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

// Check if email exists
app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    
    res.json({
      success: true,
      exists: !!existingUser,
      message: existingUser ? 'This email is already registered' : 'Email is available'
    })
  } catch (error) {
    console.error('Error checking email:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to check email availability'
    })
  }
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

    // Send verification email (async, non-blocking)
    // 不等待邮件发送完成，立即返回响应
    sendVerificationEmail(email, verificationCode).catch(emailError => {
      console.error('Email sending failed:', emailError)
      // Don't fail registration if email fails
    })

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

    // Send verification email (async, non-blocking)
    // 不等待邮件发送完成，立即返回响应
    sendVerificationEmail(email, verificationCode).catch(emailError => {
      console.error('Email sending failed:', emailError)
    })
    
    res.json({
      success: true,
      message: 'Verification code is being sent'
    })

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

    // 立即返回响应，不等待邮件发送完成
    // 邮件在后台异步发送，提高响应速度
    sendVerificationEmail(email, code).catch(error => {
      console.error('❌ Background email sending error:', error)
    })
    
    // 立即返回成功响应
    console.log('✅ Verification email queued for:', email)
    res.json({
      success: true,
      message: 'Verification email is being sent'
    })
  } catch (error) {
    console.error('❌ Error processing verification email request:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process verification email request'
    })
  }
})

// Send email change verification email
// sendEmailChangeVerification 已移至 services/emailService.js

// API endpoint to send email change verification
app.post('/api/send-email-change-verification', async (req, res) => {
  try {
    const { userId, newEmail, oldEmail, token } = req.body

    console.log('📧 Received email change verification request:', { userId, newEmail })

    if (!userId || !newEmail || !oldEmail || !token) {
      return res.status(400).json({
        success: false,
        error: 'User ID, new email, old email, and token are required'
      })
    }

    // Validate email format
    if (!newEmail.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      })
    }

    // 使用 Resend 发送更换邮箱验证邮件
    sendEmailChangeVerification(newEmail, token, oldEmail).catch(error => {
      console.error('Failed to send email change verification:', error)
    })
    
    console.log('✅ Email change verification email sent successfully to:', newEmail)
    res.json({
      success: true,
      message: 'Verification email sent successfully'
    })
  } catch (error) {
    console.error('❌ Error sending email change verification email:', error)
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

    // 使用 Resend 发送日历提醒邮件
    await sendCalendarReminder(email, eventTitle, eventDate, eventTime, reminderDays)
    
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

// 旧的日历提醒代码已移至 services/emailService.js
const _oldCalendarReminderCode = () => {
  const logoUrl = 'https://www.studiply.it/studiply-logo.png'
  
  // Format event date
  let formattedDate = ''
  if (eventDate) {
    try {
      const date = new Date(eventDate)
      formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.warn('Error formatting date:', error)
      formattedDate = eventDate // Fallback to original
    }
  }
  
  const mailOptions = {
    from: `"Studiply Calendar" <${process.env.EMAIL_USER || 'no-reply@studiply.it'}>`,
    to: email,
    subject: `Reminder: ${eventTitle} - ${reminderDays} day${reminderDays > 1 ? 's' : ''} before`,
    html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 20px;">
            <tr>
              <td align="center" valign="top">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 600px;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                      <!-- Logo -->
                      <img src="${logoUrl}" alt="Studiply Logo" style="width: 120px; height: auto; margin: 0 auto 20px; display: block; border-radius: 12px; background: rgba(255, 255, 255, 0.1); padding: 10px;" />
                      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Event Reminder</h1>
                      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 15px;">Don't miss your upcoming event</p>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 45px 40px;">
                      <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Upcoming Event</h2>
                      <p style="color: #666666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">This is a friendly reminder about your scheduled event:</p>
                      
                      <!-- Event Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border: 2px solid #667eea; border-radius: 12px; padding: 30px;">
                              <tr>
                                <td>
                                  <h3 style="color: #667eea; margin: 0 0 20px 0; font-size: 22px; font-weight: 700;">${eventTitle}</h3>
                                  <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; padding: 20px;">
                                    ${formattedDate ? `<tr><td style="padding: 8px 0;"><p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;"><span style="color: #667eea; font-size: 18px; margin-right: 8px;">📅</span><strong style="color: #667eea;">Date:</strong> ${formattedDate}</p></td></tr>` : ''}
                                    ${eventTime ? `<tr><td style="padding: 8px 0;"><p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;"><span style="color: #667eea; font-size: 18px; margin-right: 8px;">⏰</span><strong style="color: #667eea;">Time:</strong> ${eventTime}</p></td></tr>` : ''}
                                    <tr><td style="padding: 8px 0;"><p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;"><span style="color: #667eea; font-size: 18px; margin-right: 8px;">🔔</span><strong style="color: #667eea;">Reminder:</strong> ${reminderDays} day${reminderDays > 1 ? 's' : ''} before</p></td></tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Tip Box -->
                      <div style="background: #f8f9fa; border-left: 3px solid #667eea; border-radius: 6px; padding: 18px; margin: 25px 0;">
                        <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #667eea;">💡 Tip:</strong> Make sure to prepare everything you need for this event ahead of time!
                        </p>
                      </div>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background: #f8f9fa; padding: 25px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="color: #999999; margin: 0 0 8px 0; font-size: 12px; line-height: 1.5;">This is an automated reminder from Studiply Calendar.</p>
                      <p style="color: #cccccc; margin: 0; font-size: 11px;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
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

  // 旧代码已移除，现在使用 sendCalendarReminder 函数
}

// Use routes
try {
  console.log('🔁 Registering payment routes...')
  app.use('/api/payment', paymentRoutes)
  console.log('✅ /api/payment ready')
} catch (error) {
  console.error('❌ Failed to register payment routes:', error)
}

try {
  console.log('🔁 Registering limits routes...')
  app.use('/api/limits', limitsRoutes)
  console.log('✅ /api/limits ready')
} catch (error) {
  console.error('❌ Failed to register limits routes:', error)
}

try {
  console.log('🔁 Registering quest routes...')
  app.use('/api/quests', questsRoutes)
  console.log('✅ /api/quests ready')
} catch (error) {
  console.error('❌ Failed to register quest routes:', error)
}

try {
  console.log('🔁 Registering quest-request routes...')
  app.use('/api/quest-requests', questRequestRoutes)
  console.log('✅ /api/quest-requests ready')
} catch (error) {
  console.error('❌ Failed to register quest-request routes:', error)
}

try {
  console.log('🔁 Registering AI quest routes...')
  app.use('/api/ai-quests', aiQuestsRoutes)
  console.log('✅ /api/ai-quests ready')
} catch (error) {
  console.error('❌ Failed to register AI quest routes:', error)
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Studiply API is running',
    timestamp: new Date().toISOString()
  })
})

// Send streak reminder email (使用 Resend)
const sendStreakReminderEmail = async (email, userName, currentStreak) => {
  // 使用 Resend 发送 streak 提醒邮件
  try {
    await sendStreakReminder(email, userName, currentStreak)
    return { success: true }
  } catch (error) {
    console.error('Failed to send streak reminder:', error)
    throw error
  }
}

// 旧的 streak 提醒代码已移至 services/emailService.js

// Internal function to send streak reminders (used by both API and cron job)
const sendStreakReminders = async (forceSend = false) => {
  if (!firestore) {
    console.warn('⚠️ Firebase not initialized. Streak reminders disabled.')
    return { success: false, sent: 0, skipped: 0 }
  }

  const currentHour = new Date().getHours()
  // 只在晚上 8-9 点之间发送（20:00-21:00），除非强制发送
  if (!forceSend && (currentHour < 20 || currentHour >= 21)) {
    return {
      success: true,
      message: `Not the right time to send reminders (current hour: ${currentHour}). Reminders are sent between 8-9 PM. Use ?force=true to override.`,
      sent: 0,
      skipped: 0
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  // 获取所有用户
  console.log('📋 Fetching users from Firestore...')
  const usersSnapshot = await firestore.collection('users').get()
  console.log(`📋 Found ${usersSnapshot.size} users`)
  
  let sentCount = 0
  let skippedCount = 0
  let errorCount = 0
  const sendPromises = []
  const MAX_CONCURRENT = 3 // 限制并发数，避免过载

  for (const userDoc of usersSnapshot.docs) {
    try {
      const userData = userDoc.data()
      const userId = userDoc.id
      const userEmail = userData.email
      const userName = userData.name || 'there'

      if (!userEmail) {
        skippedCount++
        continue
      }

      // 获取用户的 streak 数据
      const progressDoc = await firestore.collection('studyprogress').doc(userId).get()
      if (!progressDoc.exists) {
        skippedCount++
        continue
      }

      const progressData = progressDoc.data()
      const currentStreak = progressData.currentStreak || 0
      const lastLoginDate = progressData.lastLoginDate

      // 只给有 streak 且今天还没登录的用户发送
      if (currentStreak > 0 && lastLoginDate !== todayStr) {
        // 添加到发送队列（限制并发）
        sendPromises.push(
          sendStreakReminderEmail(userEmail, userName, currentStreak)
            .then(() => {
              sentCount++
              console.log(`✅ Streak reminder sent to ${userEmail} (streak: ${currentStreak})`)
            })
            .catch((error) => {
              errorCount++
              console.error(`❌ Failed to send to ${userEmail}:`, error.message)
            })
        )
        
        // 当达到并发限制时，等待一批完成
        if (sendPromises.length >= MAX_CONCURRENT) {
          await Promise.allSettled(sendPromises.splice(0, MAX_CONCURRENT))
        }
      } else {
        skippedCount++
      }
    } catch (error) {
      console.error(`❌ Error processing user ${userDoc.id}:`, error)
      skippedCount++
    }
  }

  // 等待剩余的邮件发送完成
  if (sendPromises.length > 0) {
    console.log(`⏳ Waiting for ${sendPromises.length} remaining emails to send...`)
    await Promise.allSettled(sendPromises)
  }

  console.log(`📊 Streak reminder summary: ${sentCount} sent, ${skippedCount} skipped, ${errorCount} errors`)

  return {
    success: true,
    message: `Streak reminders processed`,
    sent: sentCount,
    skipped: skippedCount,
    errors: errorCount
  }
}

// API endpoint to send streak reminders (can be called by cron job)
app.post('/api/send-streak-reminders', async (req, res) => {
  try {
    // 允许通过查询参数或请求体强制发送（用于测试）
    const forceSend = req.query.force === 'true' || req.body.force === true
    const result = await sendStreakReminders(forceSend)
    if (result.success) {
      res.json(result)
    } else {
      res.status(503).json(result)
    }
  } catch (error) {
    console.error('❌ Error sending streak reminders:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send streak reminders'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Studiply API Server running on port ${PORT}`)
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`)
  console.log(`🗄️  Database: ${MONGODB_URI}`)
  console.log(`\n📋 Available API Routes:`)
  console.log(`   GET    /api/health`)
  console.log(`   GET    /api/quests`)
  console.log(`   GET    /api/quests/by-key`)
  console.log(`   POST   /api/quests`)
  console.log(`   POST   /api/quests/bulk`)
  console.log(`   PUT    /api/quests/by-key`)
  console.log(`   DELETE /api/quests/:id`)
  console.log(`   GET    /api/quest-requests`)
  console.log(`   POST   /api/quest-requests`)
  console.log(`   POST   /api/quest-requests/:id/approve`)
  console.log(`   POST   /api/quest-requests/:id/reject`)
  console.log(`   POST   /api/ai-quests/generate`)
  console.log(`   GET    /api/ai-quests/user/:userId`)
  console.log(`   GET    /api/ai-quests/:questId`)
  console.log(`   DELETE /api/ai-quests/:questId`)
  console.log(`   POST   /api/send-streak-reminders`)
  console.log(`\n✅ All routes registered successfully!\n`)
  
  // Setup daily streak reminder check (runs every hour, but only sends at 8-9 PM)
  setInterval(async () => {
    const currentHour = new Date().getHours()
    if (currentHour >= 20 && currentHour < 21) {
      try {
        console.log('📧 Checking for streak reminders...')
        const result = await sendStreakReminders()
        if (result.success) {
          console.log(`✅ Streak reminders: ${result.sent} sent, ${result.skipped} skipped`)
        }
      } catch (error) {
        console.error('❌ Error in streak reminder cron job:', error.message)
      }
    }
  }, 60 * 60 * 1000) // Check every hour
  
  console.log('⏰ Streak reminder scheduler started (checks hourly, sends at 8-9 PM)\n')
})
