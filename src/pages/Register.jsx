import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { ChevronLeft, ChevronRight, User, Mail, Lock, Check, BookOpen, Phone, MapPin, Edit3, Search } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { emailjsConfig } from '../config/emailjs'
import PhoneVerificationModal from '../components/PhoneVerificationModal'

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
  const [isVisible, setIsVisible] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false) // For grade dropdown
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false) // For school dropdown
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('') // For school search
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  
  const { register } = useSimpleAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
    // Initialize EmailJS
    emailjs.init(emailjsConfig.publicKey)
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
        return
      }

      // Note: Email uniqueness will be checked by the backend during registration
      // We'll let the backend handle this validation

      // Email is valid and available
      setError('')
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
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        school: formData.school,
        grade: formData.grade,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        subjects: formData.subjects
      })
      
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
        return formData.name && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
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
          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Full Name
              </label>
              <div className="relative group">
                <input
                  name="name"
                  type="text"
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Email Address
              </label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  disabled={loading}
                  required
                />
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Password
              </label>
              <div className="relative group">
                <input
                  name="password"
                  type="password"
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  name="confirmPassword"
                  type="password"
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <Check className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                School/Institution
              </label>
              <div className="relative school-dropdown-container">
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
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
                  <BookOpen className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-white/60' : 'text-slate-400'
                  }`} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {formData.school && !schoolDropdownOpen && (
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-pulse"></div>
                    )}
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isDark ? 'text-white/60' : 'text-slate-400'
                      } ${schoolDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {schoolDropdownOpen && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-[100] max-h-64 overflow-hidden ${
                    isDark
                      ? 'bg-gradient-to-br from-white/12 via-white/6 to-transparent/35 border-white/20 backdrop-blur-xl'
                      : 'bg-white border-slate-200'
                  }`}>
                    {/* Search bar inside dropdown */}
                    <div className={`p-3 border-b ${
                      isDark ? 'border-white/10' : 'border-slate-200'
                    }`}>
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                          isDark ? 'text-white/60' : 'text-slate-400'
                        }`} />
                        <input
                          type="text"
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
                            isDark
                              ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400/50'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300'
                          }`}
                          placeholder="Search schools..."
                          value={schoolSearchQuery}
                          onChange={(e) => setSchoolSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    {/* School list */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredSchools.length > 0 ? (
                        filteredSchools.map((school, index) => (
                          <button
                            key={school}
                            type="button"
                            className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between ${
                              formData.school === school
                                ? isDark
                                  ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-l-4 border-purple-400'
                                  : 'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                                : isDark
                                  ? 'text-white/90 hover:bg-white/10 hover:text-white'
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
                            <span className="font-medium text-sm">{school}</span>
                            {formData.school === school && (
                              <Check className={`w-4 h-4 ${
                                isDark ? 'text-white' : 'text-purple-600'
                              }`} />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className={`px-4 py-6 text-center ${
                          isDark ? 'text-white/60' : 'text-slate-500'
                        }`}>
                          <p className="text-sm">No schools found</p>
                          <p className="text-xs mt-1">Try a different search term</p>
                        </div>
                      )}
                    </div>
                    {/* Option to add custom school */}
                    {schoolSearchQuery && !filteredSchools.some(s => s.toLowerCase() === schoolSearchQuery.toLowerCase()) && (
                      <div className={`p-3 border-t ${
                        isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                      }`}>
                        <button
                          type="button"
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDark
                              ? 'bg-white/10 text-white hover:bg-white/15 border border-white/20'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Grade Level
              </label>
              <div className="relative dropdown-container">
                <button
                  type="button"
                  className={`w-full px-4 py-3.5 pl-12 pr-12 text-left flex items-center justify-between rounded-xl border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
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
                  <div className="flex items-center gap-3">
                    <BookOpen className={`w-5 h-5 ${
                      isDark ? 'text-white/60' : 'text-slate-400'
                    }`} />
                    <span className={formData.grade ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-white/50' : 'text-slate-400')}>
                      {formData.grade || 'Select your grade level'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.grade && (
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-pulse"></div>
                    )}
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isDark ? 'text-white/60' : 'text-slate-400'
                      } ${dropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-[100] max-h-64 overflow-y-auto ${
                    isDark
                      ? 'bg-gradient-to-br from-white/12 via-white/6 to-transparent/35 border-white/20 backdrop-blur-xl'
                      : 'bg-white border-slate-200'
                  }`} role="listbox">
                    <div className="py-2">
                      {grades.map((grade, index) => (
                        <button
                          key={grade}
                          type="button"
                          className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between ${
                            formData.grade === grade
                              ? isDark
                                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-l-4 border-purple-400'
                                : 'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                              : isDark
                                ? 'text-white/90 hover:bg-white/10 hover:text-white'
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
                          <span className="font-medium">{grade}</span>
                          {formData.grade === grade && (
                            <Check className={`w-4 h-4 ${
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
          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
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
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
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
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
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
              <label className={`block text-sm font-semibold mb-2 ${
                isDark ? 'text-white/90' : 'text-slate-700'
              }`}>
                Location <span className="text-xs font-normal opacity-70">(Optional)</span>
              </label>
              <div className="relative group">
                <input
                  name="location"
                  type="text"
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                  placeholder="Enter your city, state"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                />
                <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-white/60' : 'text-slate-400'
                }`} />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
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
              <label className={`block text-sm font-semibold mb-2 ${
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
                  className={`w-full px-4 py-3.5 rounded-xl border text-center text-lg font-mono tracking-widest transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
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
                  {loading ? 'Verifying...' : 'Verify Email'}
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

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-12 h-80 w-80 rounded-full bg-pink-400/25 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-400/15 blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 pb-20 overflow-visible">
        <div className={`w-full max-w-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} overflow-visible`}>
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white shadow-2xl mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <h1 className={`text-4xl md:text-5xl font-black mb-3 ${
              isDark
                ? 'bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700 bg-clip-text text-transparent'
            }`}>
              Create Your Account
            </h1>
            <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Join Studiply and start your learning journey
            </p>
          </div>

          {/* Progress Steps */}
          <div className={`mb-8 rounded-[28px] border px-6 py-6 shadow-xl backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="relative">
              <div className="flex items-start justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full text-base font-bold transition-all duration-500 ${
                      currentStep >= step.number
                        ? isDark
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg scale-110'
                          : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg scale-110'
                        : isDark
                          ? 'bg-white/10 border-2 border-white/20 text-white/60'
                          : 'bg-slate-100 border-2 border-slate-200 text-slate-400'
                    }`}>
                      {currentStep > step.number ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="mt-3 text-center px-1">
                      <p className={`text-xs font-bold transition-colors duration-300 ${
                        currentStep >= step.number
                          ? isDark ? 'text-white' : 'text-slate-900'
                          : isDark ? 'text-white/60' : 'text-slate-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className={`text-xs mt-1 leading-tight min-h-[2.5rem] flex items-center justify-center ${
                        isDark ? 'text-white/50' : 'text-slate-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Background line */}
              <div className={`absolute top-6 left-6 right-6 h-1 rounded-full ${
                isDark ? 'bg-white/10' : 'bg-slate-200'
              }`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'
                      : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'
                  }`}
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            {error && (
              <div className={`mb-6 p-4 rounded-2xl border ${
                isDark ? 'bg-red-500/20 border-red-400/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium text-sm">{error}</p>
                </div>
              </div>
            )}

              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          disabled={loading}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                            isDark
                              ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                          } ${dropdownOpen || schoolDropdownOpen ? 'blur-sm pointer-events-none' : ''}`}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back
                        </button>
                      )}

                      {currentStep < 5 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={loading}
                          className={`ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                            isDark
                              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                          } ${dropdownOpen || schoolDropdownOpen ? 'blur-sm pointer-events-none' : ''}`}
                        >
                          Continue
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading || (currentStep === 5 && !emailVerified)}
                          className={`ml-auto inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                            isDark
                              ? 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600'
                              : 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700'
                          } ${dropdownOpen || schoolDropdownOpen ? 'blur-sm pointer-events-none' : ''}`}
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/0/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Create Account
                            </>
                          )}
                        </button>
                      )}
                    </div>
              </form>

            <div className={`mt-6 text-center transition-all duration-300 ${dropdownOpen ? 'blur-sm pointer-events-none' : ''}`}>
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className={`font-semibold transition-colors hover:underline ${
                    isDark ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Phone Verification Modal */}
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
    </div>
  )
}

export default Register