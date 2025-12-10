import React, { useState } from 'react'
import { X, Save, Clock, BookOpen, User, CreditCard, ArrowRight, ArrowLeft, CheckCircle, Building2, Shield, Loader, ExternalLink } from 'lucide-react'
import { setUserAsTutor } from '../services/tutorService'
import { useNotification } from '../contexts/NotificationContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { createConnectAccount } from '../services/stripeConnectService'

const TutorProfileSetup = ({ user, onClose, onSuccess }) => {
  const { showSuccess, showError } = useNotification()
  const { reloadUser } = useSimpleAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Profile Info, 2: Bank Account
  const [formData, setFormData] = useState({
    isAvailable: true,
    specialties: [],
    description: '',
    experience: 'Student',
    responseTime: 'Usually responds within a few hours'
  })

  const availableSubjects = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Literature', 'Writing', 'History', 'Geography',
    'Art', 'Music', 'Programming', 'Computer Science', 'Economics',
    'Psychology', 'Philosophy', 'Languages', 'Other'
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

  // Step 1: Save profile info and go to step 2
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
        // Move to bank account setup
        setStep(2)
      } else {
        showError(`Failed to setup tutor profile: ${result.error}`)
      }
    } catch (error) {
      showError('An error occurred while setting up your tutor profile')
      console.error('Error setting up tutor profile:', error)
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
          // Already verified, complete setup
          showSuccess('Bank account already verified! Your tutor profile is now complete.')
          const updatedUser = { ...user, isTutor: true }
          localStorage.setItem('simpleUser', JSON.stringify(updatedUser))
          reloadUser()
          onSuccess && onSuccess()
          onClose()
        } else if (result.onboardingUrl) {
          // Redirect to Stripe for verification
          showSuccess('Redirecting to Stripe to complete bank setup...')
          // Save state before redirecting
          localStorage.setItem('tutorSetupPending', 'true')
          window.location.href = result.onboardingUrl
        }
      } else {
        showError(result.error || 'Failed to connect bank account')
      }
    } catch (error) {
      showError('An error occurred while connecting bank account')
      console.error('Error connecting bank:', error)
    } finally {
      setLoading(false)
    }
  }

  // Skip bank setup (not recommended)
  const handleSkipBank = () => {
    showSuccess('Tutor profile created! Note: You must connect your bank account before accepting sessions.')
    const updatedUser = { ...user, isTutor: true }
    localStorage.setItem('simpleUser', JSON.stringify(updatedUser))
    reloadUser()
    onSuccess && onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Become a Tutor</h2>
            <p className="text-sm text-gray-500 mt-1">Step {step} of 2</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-purple-500' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-gray-200'}`} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className={step === 1 ? 'text-purple-600 font-semibold' : ''}>Profile Info</span>
            <span className={step === 2 ? 'text-purple-600 font-semibold' : ''}>Bank Account</span>
          </div>
        </div>

        {/* Step 1: Profile Info */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="p-6 space-y-6">
            {/* Availability */}
            <div className="bg-purple-50 rounded-xl p-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 w-5 h-5"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900">Available for tutoring</span>
                  <p className="text-xs text-gray-500">Students can request sessions from you</p>
                </div>
              </label>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Experience Level
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Subjects You Can Teach <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
                {availableSubjects.map(subject => (
                  <label key={subject} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-white p-1 rounded">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(subject)}
                      onChange={() => handleSpecialtyToggle(subject)}
                      className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                    />
                    <span className="text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
              {formData.specialties.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one subject</p>
              )}
            </div>

            {/* Response Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Response Time
              </label>
              <select
                name="responseTime"
                value={formData.responseTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
              >
                {responseTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                About You
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell students about your teaching style, experience, and what makes you a great tutor..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || formData.specialties.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold shadow-lg shadow-purple-500/30"
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

        {/* Step 2: Bank Account Setup */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800">Profile Created!</p>
                <p className="text-sm text-green-600">Now let's set up your bank account to receive payments.</p>
              </div>
            </div>

            {/* Bank Setup Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Connect Your Bank Account</h3>
                  <p className="text-sm text-gray-600">Required to receive payments from students</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {[
                  'Receive payments directly to your bank account',
                  'Automatic payouts after each completed session',
                  'Secure processing powered by Stripe',
                  'View detailed earnings and payout history'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Security Note */}
              <div className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                <Shield className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  Your bank details are securely handled by Stripe and never stored on our servers. 
                  Stripe is trusted by millions of businesses worldwide.
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-700">
                <strong>Important:</strong> Without connecting your bank account, you won't be able to accept tutoring sessions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConnectBank}
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-lg shadow-purple-500/30"
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

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleSkipBank}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                >
                  Skip for now
                </button>
              </div>

              <p className="text-xs text-center text-gray-400">
                You can connect your bank account later from your dashboard, 
                but you won't be able to accept sessions until it's verified.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TutorProfileSetup
