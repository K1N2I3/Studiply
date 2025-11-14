import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNotification } from '../contexts/NotificationContext'
import { verifyEmailChange } from '../services/emailChangeService'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const VerifyEmailChange = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, updateUser, reloadUser } = useSimpleAuth()
  const { isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link. No token provided.')
      return
    }

    const verifyEmail = async () => {
      try {
        setStatus('verifying')
        const result = await verifyEmailChange(token)

        if (result.success) {
          setStatus('success')
          setMessage('Your email address has been successfully changed!')
          
          // Update user context with new email
          if (user && user.id === result.userId) {
            const updatedUser = {
              ...user,
              email: result.newEmail
            }
            updateUser(updatedUser)
            
            // Also reload from Firestore to ensure consistency
            await reloadUser()
          }

          showSuccess('Email changed successfully!', 5000, 'Success')
          
          // Redirect to Settings page after 3 seconds
          setTimeout(() => {
            navigate('/settings')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(result.error || 'Failed to verify email change')
          showError(result.error || 'Failed to verify email change', 5000, 'Error')
        }
      } catch (error) {
        console.error('Error verifying email change:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
        showError('An unexpected error occurred. Please try again.', 5000, 'Error')
      }
    }

    verifyEmail()
  }, [searchParams, user, updateUser, reloadUser, navigate, showSuccess, showError])

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center ${
      isDark
        ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute top-1/2 right-12 h-64 w-64 rounded-full bg-pink-400/25 blur-[120px]" />
        <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-blue-400/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-6">
        <div className={`rounded-[32px] border px-8 py-12 shadow-2xl backdrop-blur-xl text-center ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          {status === 'verifying' && (
            <>
              <div className="flex justify-center mb-6">
                <Loader className={`h-16 w-16 animate-spin ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Verifying Email Change
              </h2>
              <p className={`text-base ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                Please wait while we verify your email change request...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Email Changed Successfully!
              </h2>
              <p className={`text-base mb-6 ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                {message}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}>
                Redirecting to Settings page...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-red-500/20' : 'bg-red-100'
                }`}>
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Verification Failed
              </h2>
              <p className={`text-base mb-6 ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                {message}
              </p>
              <button
                onClick={() => navigate('/settings')}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                Go to Settings
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailChange

