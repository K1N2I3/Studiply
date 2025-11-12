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
    /^https:\/\/studiply-.*\.vercel\.app$/
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

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send verification email
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Studiply - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Studiply - Email Verification</h2>
        <p>Thank you for registering with Studiply!</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; margin: 0; font-size: 32px;">${code}</h1>
        </div>
        <p>Please enter this code in the application to verify your email address.</p>
        <p>This code will expire in 10 minutes.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">If you didn't request this verification, please ignore this email.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Studiply API is running' })
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

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      })
    }

    // Normalize phone number (remove spaces, ensure E.164 format)
    const normalizedPhone = phoneNumber.trim().replace(/\s+/g, '')
    
    const result = await sendVerificationCode(normalizedPhone)
    
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
    console.error('Send phone verification error:', error)
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

    // Normalize phone number
    const normalizedPhone = phoneNumber.trim().replace(/\s+/g, '')

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Studiply API Server running on port ${PORT}`)
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`)
  console.log(`🗄️  Database: ${MONGODB_URI}`)
})
