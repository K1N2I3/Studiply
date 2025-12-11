import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const DesktopAuth = () => {
  const navigate = useNavigate()
  const { user, loading } = useSimpleAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setConnected] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with return URL
      navigate('/login?redirect=/desktop-auth')
    }
  }, [user, loading, navigate])

  // Handle connect - redirect to Mac app via deep link
  const handleConnect = () => {
    if (!user) return

    setIsConnecting(true)

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      streak: user.streak || 0,
      isTutor: user.isTutor || false,
    }

    try {
      // Encode user data for deep link
      const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(userData))))
      
      setConnected(true)
      
      // Redirect to Mac app via custom URL scheme
      setTimeout(() => {
        window.location.href = `studiply://auth?data=${encodedData}`
      }, 500)

    } catch (error) {
      console.error('Failed to connect:', error)
      setIsConnecting(false)
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  // Only show if user is logged in
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-2xl font-semibold text-white">
            Studiply for macOS
          </h1>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          {connected ? (
            // Success State
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Connected!</h2>
              <p className="text-[#8b949e]">
                Redirecting to the app...
              </p>
            </div>
          ) : (
            <>
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-[#0d1117] rounded-lg mb-6">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div>
                <p className="text-white font-medium">{user.name || 'User'}</p>
                <p className="text-[#8b949e] text-sm">{user.email}</p>
              </div>
            </div>

              {/* Info */}
              <p className="text-[#8b949e] text-sm mb-6 text-center">
                Click the button below to connect your account to the Studiply macOS app.
              </p>

              {/* Connect Button */}
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full py-3 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Connect
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[#8b949e] text-xs mt-6">
          This will share your account info with the desktop app
        </p>
      </div>
    </div>
  )
}

export default DesktopAuth
