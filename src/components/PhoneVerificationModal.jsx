import React, { useState, useEffect } from 'react'
import { X, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { sendPhoneVerificationCode, verifyPhoneCode } from '../services/phoneVerificationService'
import { useTheme } from '../contexts/ThemeContext'
import { useNotification } from '../contexts/NotificationContext'

const PhoneVerificationModal = ({ isOpen, onClose, phoneNumber, onVerified }) => {
  const { isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && phoneNumber) {
      // Auto-send verification code when modal opens
      handleSendCode()
    }
  }, [isOpen])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleSendCode = async () => {
    if (!phoneNumber) {
      showError('Phone number is required', 3000, 'Error')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const result = await sendPhoneVerificationCode(phoneNumber)
      
      if (result.success) {
        showSuccess('Verification code sent!', 3000, 'Success')
        setResendCooldown(60) // 60 second cooldown
        setCode('')
      } else {
        setError(result.error || 'Failed to send verification code')
        showError(result.error || 'Failed to send verification code', 5000, 'Error')
      }
    } catch (error) {
      setError('Failed to send verification code. Please try again.')
      showError('Failed to send verification code', 5000, 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter a 6-digit verification code')
      return
    }

    if (!phoneNumber) {
      setError('Phone number is required')
      return
    }

    setVerifying(true)
    setError('')

    try {
      const result = await verifyPhoneCode(phoneNumber, code)
      
      if (result.success) {
        showSuccess('Phone number verified successfully!', 3000, 'Success')
        if (onVerified) {
          onVerified()
        }
        onClose()
      } else {
        setError(result.error || 'Invalid verification code')
        showError(result.error || 'Invalid verification code', 5000, 'Error')
      }
    } catch (error) {
      setError('Failed to verify code. Please try again.')
      showError('Failed to verify code', 5000, 'Error')
    } finally {
      setVerifying(false)
    }
  }

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`relative rounded-3xl p-8 max-w-md w-full shadow-2xl ${
        isDark
          ? 'bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 border border-purple-400/30'
          : 'bg-white border border-purple-200'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-all ${
            isDark
              ? 'hover:bg-white/10 text-white/70 hover:text-white'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDark
              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}>
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Verify Phone Number
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-white/70' : 'text-gray-600'
          }`}>
            We sent a 6-digit code to
          </p>
          <p className={`font-semibold mt-1 ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>
            {phoneNumber}
          </p>
        </div>

        {/* Code input */}
        <div className="mb-6">
          <label className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-white/90' : 'text-gray-700'
          }`}>
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="000000"
            maxLength={6}
            className={`w-full px-4 py-4 rounded-xl border-2 text-center text-2xl font-mono tracking-widest transition-all ${
              isDark
                ? 'bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20'
            }`}
            disabled={verifying || loading}
            autoFocus
          />
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Resend code */}
        <div className="mb-6 text-center">
          {resendCooldown > 0 ? (
            <p className={`text-sm flex items-center justify-center gap-2 ${
              isDark ? 'text-white/60' : 'text-gray-500'
            }`}>
              <Clock className="w-4 h-4" />
              Resend code in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleSendCode}
              disabled={loading}
              className={`text-sm font-medium transition-all ${
                isDark
                  ? 'text-purple-400 hover:text-purple-300'
                  : 'text-purple-600 hover:text-purple-700'
              } disabled:opacity-50`}
            >
              {loading ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={code.length !== 6 || verifying || loading}
          className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
            code.length === 6 && !verifying && !loading
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30'
              : isDark
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {verifying ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify'
          )}
        </button>
      </div>
    </div>
  )
}

export default PhoneVerificationModal

