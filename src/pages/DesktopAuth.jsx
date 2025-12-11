import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const DesktopAuth = () => {
  const navigate = useNavigate()
  const { user, loading } = useSimpleAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const [loginCode, setLoginCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/desktop-auth')
    }
  }, [user, loading, navigate])

  // Auto-connect when page loads (user is logged in)
  useEffect(() => {
    if (user && !isConnecting && !showFallback) {
      handleConnect()
    }
  }, [user])

  // Handle connect - redirect to Mac app via deep link
  const handleConnect = () => {
    if (!user) return

    setIsConnecting(true)
    setShowFallback(false)

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      streak: user.streak || 0,
      isTutor: user.isTutor || false,
    }

    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(userData))))
    setLoginCode(encodedData)

    // Try deep link immediately
    window.location.href = `studiply://auth?data=${encodedData}`

    // If still on page after 2 seconds, show fallback
    setTimeout(() => {
      setShowFallback(true)
      setIsConnecting(false)
    }, 2000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(loginCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

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
          {isConnecting ? (
            // Loading State
            <div className="text-center py-8">
              <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium">Opening Studiply...</p>
              <p className="text-[#8b949e] text-sm mt-2">Please wait...</p>
            </div>
          ) : showFallback ? (
            // Fallback - Copy Code
            <div className="text-center py-4">
              <p className="text-[#8b949e] text-sm mb-4">
                Could not open app automatically. Copy this code and paste it in the Mac app:
              </p>
              
              <div className="bg-[#0d1117] rounded-lg p-3 mb-4">
                <code className="text-xs text-purple-400 break-all">
                  {loginCode.substring(0, 40)}...
                </code>
              </div>

              <button
                onClick={copyCode}
                className="w-full py-3 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>

              <button
                onClick={handleConnect}
                className="w-full py-2 px-4 text-[#8b949e] text-sm hover:text-white transition-colors mt-3"
              >
                Try again
              </button>
            </div>
          ) : null}
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
