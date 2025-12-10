import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  User, 
  CreditCard, 
  Building2, 
  Shield, 
  Loader, 
  ExternalLink,
  Sparkles,
  GraduationCap,
  DollarSign,
  Star
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNotification } from '../contexts/NotificationContext'
import { setUserAsTutor } from '../services/tutorService'
import { createConnectAccount, getConnectStatus } from '../services/stripeConnectService'

const BecomeTutor = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, reloadUser } = useSimpleAuth()
  const { isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  
  const [step, setStep] = useState(1) // 1: Profile Info, 2: Bank Account, 3: Complete
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [formData, setFormData] = useState({
    isAvailable: true,
    specialties: [],
    description: '',
    experience: 'Student',
    responseTime: 'Usually responds within a few hours',
    hourlyRate: 15
  })

  const availableSubjects = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Literature', 'Writing', 'History', 'Geography',
    'Art', 'Music', 'Programming', 'Computer Science', 'Economics',
    'Psychology', 'Philosophy', 'French Language', 'German Language', 'Spanish Language', 'Other'
  ]

  const experienceLevels = [
    'Student',
    'Recent Graduate',
    'Graduate Student',
    'Professional',
    'Teacher/Professor'
  ]

  const responseTimes = [
    'Usually responds within a few hours',
    'Usually responds within a day',
    'Usually responds within a few days'
  ]

  // 检查用户状态和 Stripe 回调
  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id) {
        navigate('/login')
        return
      }

      // 如果已经是导师且银行卡已验证，跳转到 dashboard
      if (user?.isTutor) {
        const statusResult = await getConnectStatus(user.id)
        if (statusResult.success && statusResult.isVerified) {
          navigate('/tutor-dashboard')
          return
        }
      }

      // 检查 Stripe 回调
      const searchParams = new URLSearchParams(location.search)
      const stripeStatus = searchParams.get('stripe')
      
      if (stripeStatus === 'complete') {
        // Stripe 验证完成，检查状态
        const statusResult = await getConnectStatus(user.id)
        if (statusResult.success && statusResult.isVerified) {
          setStep(3) // 跳转到完成页面
        } else {
          setStep(2) // 还需要继续验证
          showError('Bank verification not complete. Please try again.')
        }
        // 清除 URL 参数
        navigate('/become-tutor', { replace: true })
      } else if (stripeStatus === 'refresh') {
        setStep(2)
        navigate('/become-tutor', { replace: true })
      }

      setCheckingStatus(false)
    }

    checkStatus()
  }, [user, location.search, navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  // Step 1: Save profile info
  const handleNextStep = async (e) => {
    e.preventDefault()
    if (!user?.id) return

    if (formData.specialties.length === 0) {
      showError('Please select at least one subject you can teach')
      return
    }

    setLoading(true)
    try {
      const result = await setUserAsTutor(user?.id, formData)
      if (result.success) {
        setStep(2)
      } else {
        showError(`Failed to setup tutor profile: ${result.error}`)
      }
    } catch (error) {
      showError('An error occurred while setting up your tutor profile')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Connect bank account
  const handleConnectBank = async () => {
    if (!user?.id || !user?.email) {
      showError('User information not available')
      return
    }

    setLoading(true)
    try {
      const result = await createConnectAccount(user.id, user.email)
      
      if (result.success) {
        if (result.isVerified) {
          setStep(3)
          showSuccess('Bank account verified!')
        } else if (result.onboardingUrl) {
          window.location.href = result.onboardingUrl
        }
      } else {
        showError(result.error || 'Failed to connect bank account')
      }
    } catch (error) {
      showError('An error occurred')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Complete setup
  const handleComplete = () => {
    const updatedUser = { ...user, isTutor: true }
    localStorage.setItem('simpleUser', JSON.stringify(updatedUser))
    reloadUser()
    showSuccess('Congratulations! You are now a tutor!')
    navigate('/tutor-dashboard')
  }

  if (checkingStatus) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'}`}>
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-white/10 bg-slate-800/50' : 'border-white/50 bg-white/30'} backdrop-blur-xl`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Become a Tutor
          </h1>
          <p className={`${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Share your knowledge and earn money helping students
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[
            { num: 1, label: 'Profile' },
            { num: 2, label: 'Bank Account' },
            { num: 3, label: 'Complete' }
          ].map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s.num
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    : isDark
                      ? 'bg-white/10 text-white/40'
                      : 'bg-slate-200 text-slate-400'
                }`}>
                  {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  step >= s.num
                    ? isDark ? 'text-purple-400' : 'text-purple-600'
                    : isDark ? 'text-white/40' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {index < 2 && (
                <div className={`w-20 h-1 mx-2 rounded-full ${
                  step > s.num
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : isDark ? 'bg-white/10' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className={`rounded-3xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-xl'} overflow-hidden`}>
          
          {/* Step 1: Profile Info */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="p-8">
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Set Up Your Tutor Profile
              </h2>

              <div className="space-y-6">
                {/* Hourly Rate */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Hourly Rate (€)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    min="5"
                    max="100"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    20% platform fee will be deducted from each payment
                  </p>
                </div>

                {/* Experience Level */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    <User className="w-4 h-4 inline mr-2" />
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Specialties */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Subjects You Can Teach <span className="text-red-500">*</span>
                  </label>
                  <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto rounded-xl border p-4 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {availableSubjects.map(subject => (
                      <label key={subject} className={`flex items-center space-x-2 text-sm cursor-pointer p-2 rounded-lg transition-colors ${
                        formData.specialties.includes(subject)
                          ? isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                          : isDark ? 'hover:bg-white/5' : 'hover:bg-white'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(subject)}
                          onChange={() => handleSpecialtyToggle(subject)}
                          className="rounded border-gray-300 text-purple-600"
                        />
                        <span className={isDark ? 'text-white/80' : 'text-slate-700'}>{subject}</span>
                      </label>
                    ))}
                  </div>
                  {formData.specialties.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Please select at least one subject</p>
                  )}
                </div>

                {/* Response Time */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    <Clock className="w-4 h-4 inline mr-2" />
                    Response Time
                  </label>
                  <select
                    name="responseTime"
                    value={formData.responseTime}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                  >
                    {responseTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    About You
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell students about your teaching style, experience, and what makes you a great tutor..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    } focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
                    isDark 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.specialties.length === 0}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Next: Bank Setup
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Bank Account */}
          {step === 2 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Connect Your Bank Account
                </h2>
                <p className={`${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                  Required to receive payments from students
                </p>
              </div>

              {/* Success Badge */}
              <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
                isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
              }`}>
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                    Profile Created Successfully!
                  </p>
                  <p className={`text-sm ${isDark ? 'text-green-400/70' : 'text-green-600'}`}>
                    Now let's set up your bank account to start earning.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className={`rounded-xl p-6 mb-6 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                <div className="space-y-4">
                  {[
                    { icon: CreditCard, text: 'Receive payments directly to your bank' },
                    { icon: Sparkles, text: 'Automatic payouts after each session' },
                    { icon: Shield, text: 'Bank-level security by Stripe' },
                    { icon: Star, text: 'View detailed earnings reports' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <item.icon className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <span className={`${isDark ? 'text-white/80' : 'text-slate-700'}`}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className={`rounded-xl p-4 mb-8 ${
                isDark ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
              }`}>
                <p className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                  <strong>Important:</strong> You must connect your bank account to accept tutoring sessions and receive payments.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleConnectBank}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Connect Bank Account
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center ${
                    isDark 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Profile
                </button>
              </div>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <Shield className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
                <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  Powered by Stripe • Bank-level security
                </span>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 3 && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                🎉 Congratulations!
              </h2>
              <p className={`text-lg mb-8 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                You are now officially a Studiply Tutor!
              </p>

              <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  What's Next?
                </h3>
                <div className="space-y-3 text-left">
                  {[
                    'Students can now find and request sessions with you',
                    'You\'ll receive notifications when students request help',
                    'After each session, students will pay and you\'ll receive automatic payouts',
                    'Track your earnings and sessions in your dashboard'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                      <span className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30"
              >
                Go to Tutor Dashboard
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BecomeTutor

