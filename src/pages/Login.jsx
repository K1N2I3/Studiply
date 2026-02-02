import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Check } from 'lucide-react'

const panelHighlights = [
  'Curated quests tailored to your study goals',
  'Track XP, badges, and streaks across every subject',
  'Join live sessions with mentors that keep you motivated'
]

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isDark } = useTheme()

  const { login, user, logout, googleLogin } = useSimpleAuth()
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

    // 禁用页面滚动
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      // 组件卸载时恢复滚动
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [user, location, logout])

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData.email.trim().toLowerCase(), formData.password.trim())

      if (result.success) {
        const urlParams = new URLSearchParams(location.search)
        const redirectUri = urlParams.get('redirect_uri')
        const platform = urlParams.get('platform')

        if (redirectUri && platform === 'macos') {
          const signedInUser = result.user
          const token = result.token || 'mock_token_for_macos'

          const callbackUrl = `${redirectUri}?status=success&user_id=${signedInUser.id}&email=${encodeURIComponent(signedInUser.email)}&name=${encodeURIComponent(signedInUser.name)}&token=${token}&is_tutor=${signedInUser.isTutor || false}`

          console.log('Redirecting to macOS app:', callbackUrl)
          window.location.href = callbackUrl
        } else {
          // 如果有原始路径，跳转回去；否则跳转到默认页面
          const from = location.state?.from || '/tutoring'
          navigate(from, { replace: true })
        }
      } else {
        setError(result.error)
      }
    } catch (submitError) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await googleLogin()

      if (result.success) {
        if (result.isNewUser) {
          // 新用户，跳转到注册页面并传递 Google 信息
          navigate('/register', {
            state: {
              googleUser: result.googleUser
            }
          })
        } else {
          // 已存在用户，直接登录
          const urlParams = new URLSearchParams(location.search)
          const redirectUri = urlParams.get('redirect_uri')
          const platform = urlParams.get('platform')

          if (redirectUri && platform === 'macos') {
            const signedInUser = result.user
            const token = result.token || 'mock_token_for_macos'

            const callbackUrl = `${redirectUri}?status=success&user_id=${signedInUser.id}&email=${encodeURIComponent(signedInUser.email)}&name=${encodeURIComponent(signedInUser.name)}&token=${token}&is_tutor=${signedInUser.isTutor || false}`

            console.log('Redirecting to macOS app:', callbackUrl)
            window.location.href = callbackUrl
          } else {
            const from = location.state?.from || '/tutoring'
            navigate(from, { replace: true })
          }
        }
      } else {
        setError(result.error)
      }
    } catch (submitError) {
      setError('An unexpected error occurred')
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
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .form-panel-enter {
          animation: slideInLeft 0.65s ease-out both;
        }
        .info-panel-enter {
          animation: slideInRight 0.75s ease-out both;
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
        .wave-panel {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .wave-panel::before,
        .wave-panel::after {
          content: '';
          position: absolute;
          left: -140px;
          width: 260px;
          height: 260px;
          background: var(--panel-overlay, rgba(255,255,255,0.9));
          border-radius: 50%;
          opacity: 0.85;
          filter: blur(0.5px);
        }
        .wave-panel::before {
          top: -110px;
        }
        .wave-panel::after {
          bottom: -110px;
        }
        .wave-panel .glow-accent {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.22), transparent 55%),
                      radial-gradient(circle at 80% 75%, rgba(255,255,255,0.18), transparent 50%);
          opacity: 0.9;
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
        <div className="w-full max-w-5xl">
          <div
            className={`grid overflow-hidden rounded-[28px] border shadow-[0_40px_120px_-40px_rgba(79,70,229,0.4)] backdrop-blur-2xl md:grid-cols-[1.15fr_0.85fr] w-full min-h-[520px] max-h-[calc(100vh-96px)] ${
              isDark ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/60'
            }`}
          >
            <div
              className={`form-panel-enter relative flex flex-col justify-center gap-6 p-6 sm:p-8 ${
                isDark ? 'bg-white/85 text-slate-900 shadow-lg shadow-purple-900/20' : 'bg-white'
              } md:rounded-r-[56px] md:rounded-l-none`}
            >
              <div className="space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#ec4899] text-white shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500">Welcome back</p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Sign in to Studiply</h1>
                  <p className="mt-2 max-w-md text-xs text-slate-500 sm:text-sm">
                    Access your quests, track streaks, and continue where you left off.
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Email Address</label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      className={`input-pill w-full rounded-full border px-12 py-3 text-sm shadow-sm transition-all ${
                        isDark
                          ? 'border-slate-200/40 bg-white/80 text-slate-900 placeholder:text-slate-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30'
                          : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/25'
                      }`}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <Mail className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`input-pill w-full rounded-full border px-12 py-3 text-sm shadow-sm transition-all ${
                        isDark
                          ? 'border-slate-200/40 bg-white/80 text-slate-900 placeholder:text-slate-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/30'
                          : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/25'
                      }`}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
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

                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-slate-300 text-purple-500 focus:ring-purple-500"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      disabled={loading}
                    />
                    <span className="font-medium text-slate-600">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-medium text-purple-500 transition hover:text-purple-600 hover:underline text-xs"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`cta-button w-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl disabled:translate-y-0 disabled:bg-slate-300 ${
                    loading ? 'opacity-70' : ''
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </span>
                </button>

                <div className="pt-1 text-center text-xs">
                  <span className="text-slate-500">Or continue with</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:-translate-y-1 hover:border-purple-200 hover:text-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                        G
                      </span>
                      Google
                    </button>
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-400 opacity-50 cursor-not-allowed"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">
                        F
                      </span>
                      Facebook
                    </button>
                  </div>
                </div>
              </form>

              <div className="text-center text-sm text-slate-500 md:hidden">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-purple-500 hover:text-purple-600 hover:underline">
                  Create one here
                </Link>
              </div>
            </div>

            <div
              className="info-panel-enter wave-panel relative hidden items-center justify-center bg-gradient-to-br from-[#5f48ff] via-[#7c3aed] to-[#ec4899] md:flex"
              style={{ '--panel-overlay': isDark ? 'rgba(12,16,32,0.92)' : '#ffffff' }}
            >
              <div className="glow-accent" />
              <div className="relative z-10 mx-auto flex max-w-sm flex-col gap-4 px-8 py-8 text-white">
                <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/50 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em]">
                  New here
                </span>
                <h2 className="text-2xl font-bold leading-tight">
                  Build your personalised quest road-map in minutes.
                </h2>
                <p className="text-xs text-white/85">
                  Create collaborative quests, schedule real-time tutoring, and stay motivated with daily missions designed just for you.
                </p>
                <ul className="space-y-2 text-xs text-white/90">
                  {panelHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5">
                      <span className="mt-[2px] rounded-full bg-white/15 p-1">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="cta-button mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-purple-600 shadow-lg transition hover:-translate-y-1 hover:bg-white"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
