import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Monitor, CheckCircle, Loader, LogIn, Copy, Check } from 'lucide-react'

const DesktopAuth = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [loginCode, setLoginCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Always treat as desktop auth (remove the check)
  const isDesktopAuth = true

  // Generate login code from user data
  const generateLoginCode = (userData) => {
    const data = JSON.stringify(userData)
    return btoa(unescape(encodeURIComponent(data)))
  }

  // Handle connect to desktop app
  const handleConnect = () => {
    if (!user) return

    setIsConnecting(true)

    // Prepare user data for desktop app
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      streak: user.streak || 0,
      isTutor: user.isTutor || false,
      avatar: user.avatar || null,
    }

    try {
      // Generate a login code
      const code = generateLoginCode(userData)
      setLoginCode(code)
      setConnected(true)
      
      // Auto-copy to clipboard
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})

    } catch (error) {
      console.error('Failed to connect:', error)
    }

    setIsConnecting(false)
  }

  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(loginCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Auto-connect if user is already logged in
  useEffect(() => {
    if (user && !connected) {
      // Small delay to show the UI first
      const timer = setTimeout(() => {
        handleConnect()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [user, connected])

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'}`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-3xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white shadow-2xl'}`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Monitor className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Connect Desktop App
          </h1>
          <p className={`${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            Link your Studiply account to the macOS app
          </p>
        </div>

        {/* Status */}
        {connected ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to Connect!
            </h2>
            <p className={`mb-4 ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              Code copied! Paste it in the Mac app
            </p>
            
            {/* Login Code Display */}
            <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100'}`}>
              <p className={`text-xs mb-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                Login Code (auto-copied)
              </p>
              <div className="flex items-center gap-2">
                <code className={`flex-1 text-xs break-all font-mono ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                  {loginCode.substring(0, 30)}...
                </code>
                <button
                  onClick={copyCode}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
                  )}
                </button>
              </div>
            </div>

            <div className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              <p className="mb-1">👉 Open the Studiply Mac app</p>
              <p>👉 Click "Paste Login Code"</p>
            </div>
          </div>
        ) : user ? (
          <>
            {/* User Info */}
            <div className={`p-4 rounded-2xl mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.name || 'User'}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
            >
              {isConnecting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Monitor className="w-5 h-5" />
                  Connect to Desktop App
                </>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Not Logged In */}
            <div className={`p-6 rounded-2xl mb-6 text-center ${isDark ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
              <p className={`${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                Please log in to connect your desktop app
              </p>
            </div>

            <button
              onClick={() => navigate('/login?redirect=/desktop-auth?desktop=true')}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <LogIn className="w-5 h-5" />
              Log In to Continue
            </button>
          </>
        )}

        {/* Footer */}
        <p className={`text-center text-xs mt-6 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
          This will share your account info with the Studiply desktop app
        </p>
      </div>
    </div>
  )
}

export default DesktopAuth

