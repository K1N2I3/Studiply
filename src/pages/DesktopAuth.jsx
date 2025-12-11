import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Monitor, CheckCircle, Loader, LogIn } from 'lucide-react'

const DesktopAuth = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setConnected] = useState(false)

  const isDesktopAuth = searchParams.get('desktop') === 'true'

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

    // Try to communicate with desktop app via custom protocol
    // The desktop app should be listening for this
    try {
      // Method 1: Try postMessage (works if opened from desktop app)
      if (window.opener) {
        window.opener.postMessage({
          type: 'STUDIPLY_AUTH_SUCCESS',
          user: userData
        }, '*')
      }

      // Method 2: Store in localStorage (desktop app polls this)
      localStorage.setItem('studiply_desktop_auth', JSON.stringify({
        user: userData,
        timestamp: Date.now()
      }))

      // Also update the main user storage that desktop app checks
      localStorage.setItem('studiply_user', JSON.stringify(userData))

      setConnected(true)

      // Show success for 2 seconds then close
      setTimeout(() => {
        // Try to close window if opened as popup
        if (window.opener) {
          window.close()
        }
      }, 2000)

    } catch (error) {
      console.error('Failed to connect:', error)
    }

    setIsConnecting(false)
  }

  // Auto-connect if user is already logged in
  useEffect(() => {
    if (user && isDesktopAuth && !connected) {
      // Small delay to show the UI first
      const timer = setTimeout(() => {
        handleConnect()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [user, isDesktopAuth, connected])

  // If not a desktop auth request, redirect to home
  if (!isDesktopAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <p className={isDark ? 'text-white' : 'text-gray-900'}>
          Invalid request. Please use the Studiply desktop app.
        </p>
      </div>
    )
  }

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
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Connected!
            </h2>
            <p className={`${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              You can now return to the desktop app
            </p>
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

