import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { isDark } = useTheme()
  
  const { login, user, logout } = useSimpleAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsVisible(true)
    
    const urlParams = new URLSearchParams(location.search)
    const redirectUri = urlParams.get('redirect_uri')
    const platform = urlParams.get('platform')
    
    if (redirectUri && platform === 'macos') {
      if (user) {
        console.log('macOS app callback detected, logging out user to show login form')
        logout()
      }
    }
  }, [user, location, logout])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData.email.trim().toLowerCase(), formData.password.trim())
      
      if (result.success) {
        const urlParams = new URLSearchParams(location.search)
        const redirectUri = urlParams.get('redirect_uri')
        const platform = urlParams.get('platform')
        
        if (redirectUri && platform === 'macos') {
          const user = result.user
          const token = result.token || 'mock_token_for_macos'
          
          const callbackUrl = `${redirectUri}?status=success&user_id=${user.id}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&token=${token}&is_tutor=${user.isTutor || false}`
          
          console.log('Redirecting to macOS app:', callbackUrl)
          window.location.href = callbackUrl
        } else {
          navigate('/tutoring')
        }
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
              Welcome Back
            </h1>
            <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Sign in to your premium account
            </p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
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
                    required
                    className={`w-full px-4 py-3.5 pl-12 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-white/60' : 'text-slate-400'
                  }`} />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDark ? 'text-white/90' : 'text-slate-700'
                }`}>
                  Password
                </label>
                <div className="relative group">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-white/60' : 'text-slate-400'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    rememberMe
                      ? isDark
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                      : isDark
                        ? 'bg-white/10 border-white/30 group-hover:bg-white/20'
                        : 'bg-white border-slate-300 group-hover:bg-slate-50'
                  }`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-white/80' : 'text-slate-600'
                  }`}>Remember me</span>
                </label>
                <button
                  type="button"
                  className={`text-sm font-medium transition-colors ${
                    isDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${
                    isDark ? 'border-white/20' : 'border-slate-200'
                  }`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 bg-transparent font-medium ${
                    isDark ? 'text-white/70' : 'text-slate-500'
                  }`}>Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`inline-flex justify-center items-center py-3 px-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                    isDark
                      ? 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium">Google</span>
                </button>

                <button
                  type="button"
                  className={`inline-flex justify-center items-center py-3 px-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                    isDark
                      ? 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium">Facebook</span>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${
                isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className={`font-semibold transition-colors hover:underline ${
                    isDark ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
