import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const DesktopAuth = () => {
  const navigate = useNavigate()
  const { user, loading } = useSimpleAuth()
  const [status, setStatus] = useState('loading') // loading, ready, connecting, done
  const [loginCode, setLoginCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/desktop-auth')
    }
    if (!loading && user) {
      setStatus('ready')
    }
  }, [user, loading, navigate])

  // Handle connect
  const handleConnect = () => {
    if (!user) return

    setStatus('connecting')

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      streak: user.streak || 0,
      isTutor: user.isTutor || false,
      avatar: user.avatar || null,
    }

    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(userData))))
    setLoginCode(encodedData)

    // Try deep link
    window.location.href = `studiply://auth?data=${encodedData}`

    // After 1.5 seconds, show the code to copy
    setTimeout(() => {
      setStatus('done')
      // Auto copy
      navigator.clipboard.writeText(encodedData).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})
    }, 1500)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(loginCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
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
          <h1 className="text-2xl font-semibold text-white">Studiply for macOS</h1>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
          
          {status === 'connecting' && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-2 border-white/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Opening app...</p>
            </div>
          )}

          {status === 'ready' && (
            <>
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-[#0d1117] rounded-lg mb-6">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
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

              <button
                onClick={handleConnect}
                className="w-full py-3 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Connect
              </button>
            </>
          )}

          {status === 'done' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">Code Ready!</p>
              <p className="text-[#8b949e] text-sm mb-4">
                Return to Mac app and click "Paste Code"
              </p>
              
              <button
                onClick={copyCode}
                className="w-full py-3 px-4 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>✓ Copied!</>
                ) : (
                  <>📋 Copy Code Again</>
                )}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[#8b949e] text-xs mt-6">
          This will share your account info with the desktop app
        </p>
      </div>
    </div>
  )
}

export default DesktopAuth
