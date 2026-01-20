import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Mail, Lock, ArrowRight, ArrowLeft, Sparkles, KeyRound, Eye, EyeOff } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://studiply.onrender.com/api' : 'http://localhost:3003/api')

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: enter email, 2: enter code & new password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isDark } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSendCode = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('A reset code has been sent to your email. Please check your inbox.')
        setStep(2)
      } else {
        setError(data.error || 'Failed to send reset code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          newPassword: newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Password reset successful! Redirecting to login...')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('A new reset code has been sent to your email.')
      } else {
        setError(data.error || 'Failed to resend code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
          50% { transform: translateY(-12px); }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .form-panel-enter {
          animation: slideInLeft 0.65s ease-out both;
        }
        .input-pill {
          transition: all 0.28s ease;
        }
        .input-pill:focus {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px -16px rgba(99, 102, 241, 0.55);
        }
        .cta-button {
          position: relative;
          overflow: hidden;
        }
        .cta-button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
          transform: translateX(-120%);
          transition: transform 0.9s ease;
        }
        .cta-button:hover::after {
          transform: translateX(120%);
        }
        .floating-bubble {
          animation: floatSlow 7s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, index) => (
          <span
            key={index}
            className={`floating-bubble absolute rounded-full ${
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
          className="absolute h-[480px] w-[480px] rounded-full blur-3xl opacity-45"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.55) 0%, rgba(99,102,241,0.35) 55%, transparent 70%)',
            transform: `translate(calc(-40% + ${(mousePosition.x - window.innerWidth / 2) * 0.05}px), calc(-35% + ${(mousePosition.y - window.innerHeight / 2) * 0.05}px))`
          }}
        />
        <div
          className="absolute h-[420px] w-[420px] right-[-120px] bottom-[-80px] rounded-full blur-[100px] opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.45) 0%, rgba(79,70,229,0.3) 60%, transparent 80%)',
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.04}px, ${(mousePosition.y - window.innerHeight / 2) * 0.04}px)`
          }}
        />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-2 overflow-hidden">
        <div className="w-full max-w-md">
          <div
            className={`form-panel-enter overflow-hidden rounded-[28px] border shadow-[0_40px_120px_-40px_rgba(79,70,229,0.4)] backdrop-blur-2xl ${
              isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/60'
            }`}
          >
            <div
              className={`relative flex flex-col justify-center gap-6 p-6 sm:p-8 ${
                isDark ? 'bg-white/85 text-slate-900 shadow-lg shadow-purple-900/20' : 'bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white shadow-lg">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500">
                    {step === 1 ? 'Reset Password' : 'Enter Code'}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {step === 1 ? 'Forgot your password?' : 'Check your email'}
                  </h1>
                  <p className="mt-2 max-w-md text-xs text-slate-500 sm:text-sm">
                    {step === 1
                      ? "Enter your email address and we'll send you a code to reset your password."
                      : `We sent a 6-digit code to ${email}. Enter it below to reset your password.`}
                  </p>
                </div>
              </div>

              {error && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    isDark ? 'border-red-200/60 bg-red-500/10 text-red-200' : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    isDark ? 'border-green-200/60 bg-green-500/10 text-green-200' : 'border-green-200 bg-green-50 text-green-700'
                  }`}
                >
                  {success}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        className={`input-pill w-full rounded-full border px-12 py-3 text-sm shadow-sm transition-all ${
                          isDark
                            ? 'border-slate-200/40 bg-white/80 text-slate-900 placeholder:text-slate-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30'
                            : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/25'
                        }`}
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                      <Mail className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`cta-button w-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl disabled:translate-y-0 disabled:opacity-70`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Reset Code
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Verification Code</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className={`input-pill w-full rounded-full border px-12 py-3 text-sm shadow-sm transition-all text-center tracking-[0.5em] font-mono ${
                          isDark
                            ? 'border-slate-200/40 bg-white/80 text-slate-900 placeholder:text-slate-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30'
                            : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/25'
                        }`}
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        disabled={loading}
                      />
                      <Sparkles className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        className={`input-pill w-full rounded-full border px-12 py-3 text-sm shadow-sm transition-all ${
                          isDark
                            ? 'border-slate-200/40 bg-white/80 text-slate-900 placeholder:text-slate-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30'
                            : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/25'
                        }`}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                      />
                      <Lock className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        className={`input-pill w-full rounded-full border px-12 py-3 text-sm shadow-sm transition-all ${
                          isDark
                            ? 'border-slate-200/40 bg-white/80 text-slate-900 placeholder:text-slate-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30'
                            : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/25'
                        }`}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                      <Lock className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="font-medium text-slate-500 transition hover:text-slate-700"
                      disabled={loading}
                    >
                      <span className="flex items-center gap-1">
                        <ArrowLeft className="h-3 w-3" />
                        Change email
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="font-medium text-purple-500 transition hover:text-purple-600 hover:underline"
                      disabled={loading}
                    >
                      Resend code
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`cta-button w-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl disabled:translate-y-0 disabled:opacity-70`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Resetting...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}

              <div className="text-center text-sm text-slate-500">
                Remember your password?{' '}
                <Link to="/login" className="font-semibold text-purple-500 hover:text-purple-600 hover:underline">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
