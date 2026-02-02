import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { User, Mail, Lock, Check, BookOpen, Phone, MapPin, Edit3, Search, Sparkles, ArrowRight, Loader2, XCircle, CheckCircle2 } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { emailjsConfig } from '../config/emailjs'
import PhoneVerificationModal from '../components/PhoneVerificationModal'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '',
    school: '',
    phone: '',
    location: '',
    bio: '',
    subjects: []
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [emailChecked, setEmailChecked] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false) // For grade dropdown
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false) // For school dropdown
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('') // For school search
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stepDirection, setStepDirection] = useState('forward')
  
  const { register } = useSimpleAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  
  // 检查是否有来自 Google 登录的用户信息
  const [googleUser, setGoogleUser] = useState(location.state?.googleUser || null)

  useEffect(() => {
    setIsVisible(true)
    // Initialize EmailJS
    emailjs.init(emailjsConfig.publicKey)
    
    // 如果有 Google 用户信息，预填充表单
    if (googleUser) {
      setFormData(prev => ({
        ...prev,
        name: googleUser.name || '',
        email: googleUser.email || ''
      }))
    }
    
    // 禁用页面滚动
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      // 组件卸载时恢复滚动
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [googleUser])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false)
      }
      if (schoolDropdownOpen && !event.target.closest('.school-dropdown-container')) {
        setSchoolDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen, schoolDropdownOpen])

  // Common schools list (can be expanded)
  const commonSchools = [
    // Universities
    'Harvard University', 'Stanford University', 'Massachusetts Institute of Technology (MIT)',
    'University of Cambridge', 'University of Oxford', 'Yale University',
    'Princeton University', 'Columbia University', 'University of Chicago',
    'University of Pennsylvania', 'California Institute of Technology (Caltech)',
    'University of California, Berkeley', 'University of California, Los Angeles (UCLA)',
    'New York University (NYU)', 'University of Michigan', 'University of Texas at Austin',
    'University of Washington', 'Cornell University', 'Duke University',
    'Northwestern University', 'Johns Hopkins University', 'Carnegie Mellon University',
    'University of Southern California (USC)', 'University of Virginia',
    'University of North Carolina at Chapel Hill', 'Boston University',
    'University of Illinois at Urbana-Champaign', 'Georgia Institute of Technology',
    'University of Wisconsin-Madison', 'Pennsylvania State University',
    'Ohio State University', 'University of Florida', 'University of Minnesota',
    'Purdue University', 'Texas A&M University', 'University of Maryland',
    'University of Colorado Boulder', 'Arizona State University',
    'University of California, San Diego (UCSD)', 'University of California, Davis',
    'University of California, Irvine', 'University of California, Santa Barbara',
    'Rutgers University', 'Indiana University', 'University of Pittsburgh',
    'University of Georgia', 'University of Connecticut', 'University of Delaware',
    'University of Massachusetts Amherst', 'University of Vermont',
    'University of New Hampshire', 'University of Maine',
    // International Universities
    'University of Toronto', 'McGill University', 'University of British Columbia',
    'University of Melbourne', 'University of Sydney', 'University of Tokyo',
    'Peking University', 'Tsinghua University', 'National University of Singapore',
    'University of Hong Kong', 'Seoul National University',
    // High Schools (Common)
    'Lincoln High School', 'Washington High School', 'Jefferson High School',
    'Roosevelt High School', 'Kennedy High School', 'Madison High School',
    'Central High School', 'East High School', 'West High School',
    'North High School', 'South High School', 'Memorial High School',
    'Park High School', 'Lake High School', 'Hill High School',
    'Valley High School', 'Ridge High School', 'Creek High School',
    'Spring High School', 'Oak High School', 'Pine High School',
    'Maple High School', 'Cedar High School', 'Elm High School',
    // Private Schools
    'St. Mary\'s School', 'St. John\'s School', 'St. Paul\'s School',
    'St. Joseph\'s School', 'St. Francis School', 'St. Anthony\'s School',
    'St. Patrick\'s School', 'St. Michael\'s School', 'St. Thomas School',
    'St. Andrew\'s School', 'St. Luke\'s School', 'St. Mark\'s School',
    // Community Colleges
    'Community College of Philadelphia', 'Miami Dade College',
    'Lone Star College', 'Houston Community College', 'City College of San Francisco',
    'Santa Monica College', 'Pasadena City College', 'Orange Coast College',
    'Diablo Valley College', 'De Anza College', 'Foothill College',
    // Other
    'Online School', 'Homeschool', 'International School', 'Charter School'
  ].sort()

  // Filter schools based on search query
  const filteredSchools = schoolSearchQuery
    ? commonSchools.filter(school =>
        school.toLowerCase().includes(schoolSearchQuery.toLowerCase())
      )
    : commonSchools

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Reset email exists status when email changes
    if (e.target.name === 'email') {
      setEmailExists(false)
      setEmailChecked(false)
    }
    if (error) setError('')
  }

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const handleEmailBlur = async (e) => {
    const email = e.target.value.trim()
    if (email) {
      // Check email format first
      if (!isValidEmail(email)) {
        setError('Please enter a valid email address (e.g., user@example.com)')
        setEmailExists(false)
        return
      }

      // Check if email already exists in Firebase
      setCheckingEmail(true)
      setError('')
      try {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('email', '==', email.toLowerCase().trim()))
        const querySnapshot = await getDocs(q)
        
        setEmailChecked(true)
        if (!querySnapshot.empty) {
          // Email already exists
          setEmailExists(true)
          setError('This email is already registered. Please use a different email or sign in.')
        } else {
          // Email is available
          setEmailExists(false)
          setError('')
        }
      } catch (error) {
        console.error('Error checking email:', error)
        setEmailChecked(true)
        setEmailExists(false)
        setError('Unable to check email availability. Please try again or continue with registration.')
      } finally {
        setCheckingEmail(false)
      }
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        school: formData.school,
        grade: formData.grade,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        subjects: formData.subjects
      }
      
      // 如果是 Google 用户，添加头像信息
      if (googleUser && googleUser.photoURL) {
        registerData.avatar = googleUser.photoURL
      }
      
      const result = await register(registerData)
      
      if (result.success) {
        // Registration successful - redirect to login
        navigate('/login')
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const grades = [
    'Elementary School',
    'Middle School',
    'High School',
    'College/University',
    'Graduate School',
    'Other'
  ]

  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
    'Geography', 'Computer Science', 'Programming', 'Art', 'Music',
    'Physical Education', 'Psychology', 'Economics', 'Business', 'Languages'
  ]

  const registerHighlights = [
    'Create quests with multiple formats and difficulty levels',
    'Invite mentors to review and approve community submissions',
    'Unlock rewards as you build your personalised learning path'
  ]

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        // Google 用户只需要设置密码，name 和 email 已经锁定
        if (googleUser) {
          return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
        }
        // 普通用户需要所有字段
        return formData.name && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && !emailExists
      case 2:
        return formData.school && formData.grade
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError('')
      setStepDirection('forward')
      if (currentStep === 4) {
        // 第4步完成后，直接进入第5步邮箱验证
        setCurrentStep(5)
        // 自动发送邮箱验证码
        sendEmailVerificationCode()
      } else {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setError('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setError('')
    setStepDirection('backward')
    setCurrentStep(currentStep - 1)
  }

  const sendEmailVerificationCode = async () => {
    try {
      setLoading(true)
      
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Validate email before sending
      if (!formData.email || !formData.email.includes('@')) {
        setError('Invalid email address')
        return
      }

      // Try Neo Email (backend API) first
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'
      
      try {
        console.log('📧 Attempting to send email via Neo Email (backend)...')
        const response = await fetch(`${API_BASE_URL}/send-verification-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            code: code
          })
        })

        const result = await response.json()
        
        if (result.success) {
          console.log('✅ Email sent successfully via Neo Email')
          setEmailVerificationSent(true)
          sessionStorage.setItem('verification_code', code)
          setError('')
          return // Success, exit function
        } else {
          throw new Error(result.error || 'Backend email failed')
        }
      } catch (backendError) {
        console.warn('⚠️ Neo Email failed, falling back to EmailJS:', backendError)
        // Continue to EmailJS fallback
      }
      
      // Fallback to EmailJS
      // Check if EmailJS is properly configured
      if (emailjsConfig.publicKey === 'YOUR_PUBLIC_KEY' || 
          emailjsConfig.serviceId === 'YOUR_SERVICE_ID' || 
          emailjsConfig.templateId === 'YOUR_TEMPLATE_ID') {
        // Test mode - simulate email sending
        console.log('EmailJS not configured, using test mode')
        console.log(`Test verification code: ${code}`)
        alert(`Test Mode: Verification code is ${code}`)
        setEmailVerificationSent(true)
        sessionStorage.setItem('verification_code', code)
        setError('')
        return
      }
      
      // EmailJS configuration - ensure all required parameters are set
      const templateParams = {
        to_email: formData.email, // This is crucial - the recipient email
        to_name: formData.name,
        verification_code: code,
        from_name: 'Studiply',
        // Some EmailJS templates might need additional parameters
        user_email: formData.email,
        user_name: formData.name
      }

      console.log('📧 Sending email via EmailJS (fallback)...')

      // Send email using EmailJS
      const result = await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams,
        emailjsConfig.publicKey
      )

      if (result.status === 200) {
        console.log('✅ Email sent successfully via EmailJS')
        setEmailVerificationSent(true)
        // Store the verification code for comparison
        sessionStorage.setItem('verification_code', code)
        setError('')
      } else {
        setError('Failed to send verification email. Please try again.')
      }
    } catch (error) {
      console.error('EmailJS error:', error)
      
      // Generate a new code for fallback
      const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Check error type and provide specific feedback
      if (error.text && error.text.includes('template ID not found')) {
        console.log('EmailJS Template ID not found, using test mode')
        alert(`EmailJS Template Error - Test Mode: Verification code is ${fallbackCode}\n\nPlease check your EmailJS template ID in the dashboard.`)
      } else if (error.text && error.text.includes('Public Key is invalid')) {
        console.log('EmailJS Public Key invalid, using test mode')
        alert(`EmailJS Key Error - Test Mode: Verification code is ${fallbackCode}\n\nPlease check your EmailJS Public Key.`)
      } else if (error.text && error.text.includes('recipients address is empty')) {
        console.log('EmailJS recipients address is empty, using test mode')
        alert(`EmailJS Recipient Error - Test Mode: Verification code is ${fallbackCode}\n\nPlease check your EmailJS template configuration.\n\nEmail: ${formData.email}`)
      } else if (error.text && error.text.includes('Invalid email address')) {
        console.log('Invalid email address, using test mode')
        alert(`EmailJS Invalid Email - Test Mode: Verification code is ${fallbackCode}\n\nPlease enter a valid email address.`)
      } else {
        console.log('EmailJS failed, falling back to test mode')
        alert(`EmailJS Error - Test Mode: Verification code is ${fallbackCode}\n\nError: ${error.text || error.message}`)
      }
      
      setEmailVerificationSent(true)
      sessionStorage.setItem('verification_code', fallbackCode)
      setError('')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code')
      return
    }

    setLoading(true)
    try {
      // Get the stored verification code
      const storedCode = sessionStorage.getItem('verification_code')
      
      if (verificationCode === storedCode) {
        setEmailVerified(true)
        sessionStorage.removeItem('verification_code') // Clean up
        setError('')
        
        // 自动完成注册并跳转到主页面
        try {
          const registerData = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password.trim(),
            school: formData.school,
            grade: formData.grade,
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio,
            subjects: formData.subjects
          }
          
          // 如果是 Google 用户，添加头像信息
          if (googleUser && googleUser.photoURL) {
            registerData.avatar = googleUser.photoURL
          }
          
          const result = await register(registerData)
          
          if (result.success) {
            // 注册成功，直接跳转到主页面（用户已自动登录）
            navigate('/')
          } else {
            setError(result.error || 'Registration failed. Please try again.')
            setEmailVerified(false)
          }
        } catch (regError) {
          console.error('Registration error:', regError)
          setError('Registration failed. Please try again.')
          setEmailVerified(false)
        }
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } catch (error) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendVerificationCode = () => {
    sendEmailVerificationCode()
    alert('Verification code has been resent to your email')
  }

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Name, email and password' },
    { number: 2, title: 'School Info', description: 'School and grade level' },
    { number: 3, title: 'Contact Info', description: 'Phone and location (optional)' },
    { number: 4, title: 'Profile Info', description: 'Bio and subjects (optional)' },
    { number: 5, title: 'Email Verification', description: 'Verify your email address' }
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Full Name
                {googleUser && (
                  <span className="ml-2 text-xs font-normal text-purple-500">(from Google)</span>
                )}
              </label>
              <div className="relative group">
                <input
                  name="name"
                  type="text"
                  className={`w-full px-4 py-2.5 pl-11 rounded-xl border transition-all input-focus-effect text-sm ${
                    googleUser
                      ? isDark
                        ? 'bg-white/10 border-purple-400/40 text-white/80 cursor-not-allowed'
                        : 'bg-slate-100 border-purple-300 text-slate-600 cursor-not-allowed'
                      : isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-500/20'
                        : 'bg-white/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20'
                  }`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading || googleUser !== null}
                  required
                />
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Email Address
                {googleUser && (
                  <span className="ml-2 text-xs font-normal text-purple-500">(from Google)</span>
                )}
              </label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  className={`w-full px-4 py-2.5 pl-11 pr-11 rounded-xl border transition-all input-focus-effect text-sm ${
                    googleUser
                      ? isDark
                        ? 'bg-white/10 border-purple-400/40 text-white/80 cursor-not-allowed'
                        : 'bg-slate-100 border-purple-300 text-slate-600 cursor-not-allowed'
                      : emailExists
                        ? isDark
                          ? 'bg-white/5 border-red-400/60 text-white placeholder:text-white/40 focus:border-red-400/60 focus:ring-4 focus:ring-red-500/20'
                          : 'bg-white/90 border-red-300 text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/20'
                        : checkingEmail
                          ? isDark
                            ? 'bg-white/5 border-purple-400/60 text-white placeholder:text-white/40 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-500/20'
                            : 'bg-white/90 border-purple-300 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20'
                          : isDark
                            ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-500/20'
                            : 'bg-white/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20'
                  }`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  disabled={loading || checkingEmail || googleUser !== null}
                  required
                />
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
                {checkingEmail && !googleUser && (
                  <Loader2 className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                )}
                {!checkingEmail && !googleUser && emailChecked && formData.email && isValidEmail(formData.email) && (
                  emailExists ? (
                    <XCircle className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-red-400' : 'text-red-500'
                    }`} />
                  ) : (
                    <CheckCircle2 className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-emerald-400' : 'text-emerald-500'
                    }`} />
                  )
                )}
                {googleUser && (
                  <CheckCircle2 className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                )}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Password
              </label>
              <div className="relative group">
                <input
                  name="password"
                  type="password"
                  className={`w-full px-4 py-2.5 pl-11 rounded-xl border transition-all input-focus-effect text-sm ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-500/20'
                      : 'bg-white/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20'
                  }`}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  name="confirmPassword"
                  type="password"
                  className={`w-full px-4 py-2.5 pl-11 rounded-xl border transition-all input-focus-effect text-sm ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-500/20'
                      : 'bg-white/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20'
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <Check className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                School/Institution
              </label>
              <div className="relative school-dropdown-container">
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full rounded-lg border text-sm px-10 py-2 transition-all ${
                      isDark
                        ? 'bg-slate-900/70 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40'
                        : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40'
                    }`}
                    placeholder="Search for your school..."
                    value={schoolDropdownOpen ? schoolSearchQuery : formData.school}
                    onChange={(e) => {
                      if (schoolDropdownOpen) {
                        setSchoolSearchQuery(e.target.value)
                      } else {
                        setFormData(prev => ({ ...prev, school: e.target.value }))
                      }
                    }}
                    onFocus={() => {
                      setSchoolDropdownOpen(true)
                      setSchoolSearchQuery('')
                    }}
                    disabled={loading}
                    required
                  />
                  <BookOpen className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-white/60' : 'text-slate-400'
                  }`} />
                  <svg 
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 ${
                      isDark ? 'text-white/60' : 'text-slate-400'
                    } ${schoolDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {schoolDropdownOpen && (
                  <div className={`mt-2 rounded-lg border shadow-xl z-20 max-h-56 overflow-hidden ${
                    isDark
                      ? 'bg-slate-900 border-slate-700'
                      : 'bg-white border-slate-300'
                  }`}>
                    <div className={`p-2 border-b ${
                      isDark ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      <div className="relative">
                        <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-400'
                        }`} />
                        <input
                          type="text"
                          className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm ${
                            isDark
                              ? 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none'
                              : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none'
                          }`}
                          placeholder="Search schools..."
                          value={schoolSearchQuery}
                          onChange={(e) => setSchoolSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className={`max-h-40 overflow-y-auto ${
                      isDark ? 'divide-slate-700' : 'divide-slate-200'
                    } divide-y`}>
                      {filteredSchools.length > 0 ? (
                        filteredSchools.map((school) => (
                          <button
                            key={school}
                            type="button"
                            className={`w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                              formData.school === school
                                ? isDark
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-purple-100 text-purple-700'
                                : isDark
                                  ? 'text-white hover:bg-slate-800'
                                  : 'text-slate-700 hover:bg-slate-50'
                            }`}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, school }))
                              setSchoolDropdownOpen(false)
                              setSchoolSearchQuery('')
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                setFormData(prev => ({ ...prev, school }))
                                setSchoolDropdownOpen(false)
                                setSchoolSearchQuery('')
                              }
                            }}
                            role="option"
                            aria-selected={formData.school === school}
                          >
                            <span>{school}</span>
                            {formData.school === school && (
                              <Check className={`w-4 h-4 flex-shrink-0 ${
                                isDark ? 'text-white' : 'text-purple-600'
                              }`} />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className={`px-4 py-4 text-center text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          No schools found
                        </div>
                      )}
                    </div>
                    {schoolSearchQuery && !filteredSchools.some(s => s.toLowerCase() === schoolSearchQuery.toLowerCase()) && (
                      <div className={`p-2 border-t ${
                        isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                      }`}>
                        <button
                          type="button"
                          className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isDark
                              ? 'bg-slate-800 text-white hover:bg-slate-700'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, school: schoolSearchQuery }))
                            setSchoolDropdownOpen(false)
                            setSchoolSearchQuery('')
                          }}
                        >
                          Use "{schoolSearchQuery}" as school name
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Grade Level
              </label>
              <div className="relative dropdown-container">
                <button
                  type="button"
                  className={`w-full px-4 py-2 text-left flex items-center justify-between rounded-lg border text-sm transition-all ${
                    isDark
                      ? 'bg-slate-900/70 border-slate-600 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/40'
                  }`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setDropdownOpen(!dropdownOpen)
                    }
                  }}
                  disabled={loading}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className={`w-4 h-4 ${
                      isDark ? 'text-white/60' : 'text-slate-400'
                    }`} />
                    <span className={`${formData.grade ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-white/50' : 'text-slate-400')}`}>
                      {formData.grade || 'Select your grade level'}
                    </span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDark ? 'text-white/60' : 'text-slate-400'
                    } ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className={`mt-2 rounded-lg border shadow-xl z-20 max-h-44 overflow-y-auto ${
                    isDark
                      ? 'bg-slate-900 border-slate-700'
                      : 'bg-white border-slate-300'
                  }`} role="listbox">
                    <div className={`py-1 ${
                      isDark ? 'divide-slate-700' : 'divide-slate-200'
                    } divide-y`}>
                      {grades.map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          className={`w-full px-3 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                            formData.grade === grade
                              ? isDark
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-100 text-purple-700'
                              : isDark
                                ? 'text-white hover:bg-slate-800'
                                : 'text-slate-700 hover:bg-slate-50'
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, grade }))
                            setDropdownOpen(false)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setFormData(prev => ({ ...prev, grade }))
                              setDropdownOpen(false)
                            }
                          }}
                          role="option"
                          aria-selected={formData.grade === grade}
                        >
                          <span>{grade}</span>
                          {formData.grade === grade && (
                            <Check className={`w-4 h-4 flex-shrink-0 ${
                              isDark ? 'text-white' : 'text-purple-600'
                            }`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Phone Number {formData.phone && phoneVerified && (
                  <span className="text-xs font-normal text-green-500 ml-2">✓ Verified</span>
                )}
              </label>
              <div className="relative group">
                <input
                  name="phone"
                  type="tel"
                  className={`w-full px-4 py-2.5 pl-11 rounded-xl border transition-all input-focus-effect text-sm ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-500/20'
                      : 'bg-white/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20'
                  }`}
                  placeholder="Enter your phone number (e.g., +1234567890)"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={(e) => {
                    // If phone number is entered and not verified, show verification modal
                    if (e.target.value.trim() && !phoneVerified) {
                      setShowPhoneVerification(true)
                    }
                  }}
                  disabled={loading}
                />
                <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
              {formData.phone && !phoneVerified && (
                <button
                  type="button"
                  onClick={() => setShowPhoneVerification(true)}
                  className={`mt-2 text-sm font-medium transition-all ${
                    isDark
                      ? 'text-purple-400 hover:text-purple-300'
                      : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Verify phone number
                </button>
              )}
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Location <span className="text-xs font-normal opacity-70">(Optional)</span>
              </label>
              <div className="relative group">
                <input
                  name="location"
                  type="text"
                  className={`w-full px-4 py-2.5 pl-11 rounded-xl border transition-all input-focus-effect text-sm ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-500/20'
                      : 'bg-white/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20'
                  }`}
                  placeholder="Enter your city, state"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                />
                <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Bio <span className="text-xs font-normal opacity-70">(Optional)</span>
              </label>
              <textarea
                name="bio"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                }`}
                placeholder="Tell us a bit about yourself and your interests"
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Subjects of Interest <span className="text-xs font-normal opacity-70">(Optional)</span>
              </label>
              <div className={`grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-2xl p-4 ${
                isDark
                  ? 'border-white/20 bg-white/5'
                  : 'border-slate-200 bg-slate-50'
              }`}>
                {availableSubjects.map((subject) => (
                  <label key={subject} className="flex items-center gap-3 text-sm group cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        disabled={loading}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                        formData.subjects.includes(subject)
                          ? isDark
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                          : isDark
                            ? 'bg-white/10 border-white/30 group-hover:bg-white/20'
                            : 'bg-white border-slate-300 group-hover:bg-slate-100'
                      }`}>
                        {formData.subjects.includes(subject) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span className={`${
                      isDark ? 'text-white/80 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                    } transition-colors duration-200`}>{subject}</span>
                  </label>
                ))}
              </div>
              {formData.subjects.length > 0 && (
                <div className="mt-3">
                  <p className={`text-xs mb-2 ${
                    isDark ? 'text-white/70' : 'text-slate-600'
                  }`}>Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject) => (
                      <span
                        key={subject}
                        className={`px-3 py-1 text-xs rounded-full border ${
                          isDark
                            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white/90 border-white/20'
                            : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200'
                        }`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Verify Your Email</h3>
              <p className={isDark ? 'text-white/70' : 'text-slate-600'}>
                We've sent a verification code to <span className={`font-semibold ${
                  isDark ? 'text-purple-300' : 'text-purple-600'
                }`}>{formData.email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-white/90' : 'text-slate-700'
                }`}>
                  Enter 6-digit verification code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-3.5 rounded-xl border text-center text-lg font-mono tracking-widest transition-all input-focus-effect ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/60 focus:ring-4 focus:ring-purple-500/20'
                      : 'bg-white/90 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20'
                  }`}
                  placeholder="123456"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className={`p-3 rounded-lg text-sm border ${
                  isDark ? 'bg-red-500/20 border-red-400/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleEmailVerification}
                  disabled={loading || !verificationCode || verificationCode.length !== 6}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  {loading ? (emailVerified ? 'Creating account...' : 'Verifying...') : 'Verify Email & Create Account'}
                </button>

                <button
                  onClick={resendVerificationCode}
                  className={`w-full font-medium py-2 transition-colors duration-200 ${
                    isDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Resend verification code
                </button>
              </div>
            </div>

            {emailVerified && (
              <div className={`p-4 rounded-lg text-center border ${
                isDark ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Email verified successfully!</span>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const stepAnimationClass = stepDirection === 'forward' ? 'step-enter-right' : 'step-enter-left'
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div
      className={`fixed inset-0 h-screen w-screen overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-[#08051a] via-[#120b2c] to-[#1c1142] text-white'
          : 'bg-gradient-to-br from-[#f4f2ff] via-[#f9f0ff] to-[#ffe9f5] text-slate-900'
      }`}
      style={{ paddingTop: '64px' }}
    >
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .step-enter-left {
          animation: slideInLeft 0.55s ease-out both;
        }
        .step-enter-right {
          animation: slideInRight 0.55s ease-out both;
        }
        .input-focus-effect {
          transition: all 0.3s ease;
        }
        .input-focus-effect:focus {
          transform: translateY(-2px);
          box-shadow: 0 18px 38px -20px rgba(99, 102, 241, 0.55);
        }
        .wave-panel-left {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .wave-panel-left::before,
        .wave-panel-left::after {
          content: '';
          position: absolute;
          right: -140px;
          width: 260px;
          height: 260px;
          background: var(--panel-overlay, rgba(255,255,255,0.9));
          border-radius: 50%;
          opacity: 0.9;
          filter: blur(0.5px);
        }
        .wave-panel-left::before { top: -120px; }
        .wave-panel-left::after { bottom: -120px; }
        .wave-panel-left .glow-accent {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 35%, rgba(255,255,255,0.25), transparent 60%),
                      radial-gradient(circle at 70% 70%, rgba(255,255,255,0.18), transparent 55%);
          opacity: 0.85;
        }
        .floating-node {
          animation: floatSlow 7s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <span
            key={index}
            className={`floating-node absolute rounded-full ${
              isDark ? 'bg-white/10' : 'bg-purple-200/40'
            }`}
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`
            }}
          />
        ))}
        <div
          className="absolute left-[-120px] top-[-140px] h-[440px] w-[440px] rounded-full blur-[120px] opacity-45"
          style={{
            background: 'radial-gradient(circle, rgba(129,140,248,0.55) 0%, rgba(99,102,241,0.3) 60%, transparent 75%)'
          }}
        />
        <div
          className="absolute right-[-180px] bottom-[-120px] h-[460px] w-[460px] rounded-full blur-[140px] opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.48) 0%, rgba(79,70,229,0.28) 60%, transparent 80%)'
          }}
        />
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-4 overflow-hidden">
        <div className="w-full max-w-5xl flex-shrink-0 max-h-[calc(100vh-96px)]">
          <div
            className={`grid overflow-hidden rounded-[28px] border shadow-[0_40px_120px_-40px_rgba(79,70,229,0.4)] backdrop-blur-2xl md:grid-cols-[0.7fr_1.3fr] w-full min-h-[540px] max-h-[calc(100vh-96px)] ${
              isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/60'
            }`}
          >
            <div
              className="wave-panel-left info-panel-enter relative hidden md:flex items-center justify-center bg-gradient-to-br from-[#5f48ff] via-[#7c3aed] to-[#ec4899] min-h-[540px]"
              style={{ '--panel-overlay': isDark ? 'rgba(12,16,32,0.92)' : '#ffffff' }}
            >
              <div className="glow-accent" />
              <div className="relative z-10 mx-auto flex max-w-sm flex-col gap-4 px-8 py-8 text-white">
                <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/45 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em]">
                  Plan ahead
                </span>
                <h2 className="text-2xl font-bold leading-tight">
                  Shape the Quest Academy experience in just five guided steps.
                </h2>
                <p className="text-xs text-white/85">
                  Craft quests, invite tutors, and unlock collaborative learning areas tailored to your skills.
                </p>
                <ul className="space-y-2 text-xs text-white/90">
                  {registerHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5">
                      <span className="mt-[2px] rounded-full bg-white/15 p-1">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className="cta-button mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-purple-600 shadow-lg transition hover:-translate-y-1 hover:bg-white"
                >
                  Back to login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div
              className={`form-panel-enter relative flex flex-col gap-5 p-6 sm:p-8 overflow-y-auto ${
                isDark ? 'bg-slate-950/85 text-white' : 'bg-white text-slate-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-col gap-6">
                   <div>
                     <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-purple-500 mb-2">
                       Step {currentStep} of {steps.length}
                     </p>
                     <h1 className="text-2xl font-bold sm:text-3xl mb-2">
                       Create your Studiply account
                     </h1>
                     <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-500'}`}>
                       Tell us a little bit about you so we can match you with the right quests, mentors, and missions.
                     </p>
                   </div>
                  <div className="w-full">
                    <div className="relative">
                      {/* Progress line background */}
                      <div className={`absolute left-0 right-0 top-6 h-0.5 rounded-full ${
                        isDark ? 'bg-white/10' : 'bg-slate-200'
                      }`} />
                      {/* Progress line fill */}
                      <div
                        className="absolute left-0 top-6 h-0.5 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
                          background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)'
                        }}
                      />
                      {/* Steps */}
                      <div className="relative flex justify-between items-start">
                        {steps.map((step, index) => {
                          const isActive = currentStep === step.number
                          const isComplete = currentStep > step.number
                          const isUpcoming = currentStep < step.number
                          return (
                            <div key={step.number} className="flex flex-col items-center gap-2 flex-1 max-w-[20%]">
                              {/* Step circle */}
                              <div className="relative">
                                <span
                                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${
                                    isComplete
                                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40'
                                      : isActive
                                        ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-xl shadow-purple-500/50 scale-110 ring-4 ring-purple-500/20'
                                        : isDark
                                          ? 'bg-slate-700/50 border-2 border-slate-600 text-slate-400'
                                          : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                                  }`}
                                >
                                  {isComplete ? (
                                    <Check className="h-5 w-5" />
                                  ) : (
                                    <span className={isActive ? 'text-white' : ''}>{step.number}</span>
                                  )}
                                </span>
                                {/* Active step pulse effect */}
                                {isActive && (
                                  <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
                                )}
                              </div>
                              {/* Step label */}
                              <span className={`text-[10px] font-medium uppercase tracking-wider text-center leading-tight ${
                                isActive
                                  ? isDark ? 'text-purple-300 font-semibold' : 'text-purple-600 font-semibold'
                                  : isComplete
                                    ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                                    : isDark ? 'text-white/50' : 'text-slate-400'
                              }`}>
                                {step.title}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${stepAnimationClass}`}>
                  {renderStepContent()}
                </div>

                <div className={`flex flex-col gap-3 border-t pt-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={loading}
                        className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition hover:-translate-y-1 hover:shadow-md ${
                          isDark
                            ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                        Back
                      </button>
                    ) : (
                      <span className="hidden sm:block" />
                    )}

                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={loading}
                        className={`cta-button inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl ${
                          dropdownOpen || schoolDropdownOpen ? 'pointer-events-none opacity-60' : ''
                        }`}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      // 第5步（邮箱验证）不显示按钮，验证成功后自动完成注册并跳转
                      <span className="hidden sm:block" />
                    )}
                  </div>

                  <p className={`text-center text-sm ${isDark ? 'text-white/60' : 'text-slate-500'} sm:hidden`}>
                    Already registered?{' '}
                    <Link to="/login" className="font-semibold text-purple-500 hover:text-purple-600 hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PhoneVerificationModal
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        phoneNumber={formData.phone}
        onVerified={() => {
          setPhoneVerified(true)
          setShowPhoneVerification(false)
        }}
      />
    </div>
  )
}

export default Register