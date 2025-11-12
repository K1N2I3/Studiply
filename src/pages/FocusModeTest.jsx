import React, { useState, useEffect } from 'react'

const FocusModeTest = () => {
  const [sessionType, setSessionType] = useState('short-break')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false)

  const sessionTypes = [
    { id: 'pomodoro', name: 'Pomodoro', duration: 25 },
    { id: 'short-break', name: 'Short Break', duration: 5 },
    { id: 'long-break', name: 'Long Break', duration: 15 },
    { id: 'deep-focus', name: 'Deep Focus', duration: 90 }
  ]

  // localStorage functions
  const saveSessionToStorage = (sessionData) => {
    try {
      localStorage.setItem('studiply_focus_session', JSON.stringify(sessionData))
      console.log('Session saved:', sessionData)
    } catch (error) {
      console.error('Failed to save session to localStorage:', error)
    }
  }

  const loadSessionFromStorage = () => {
    try {
      const savedSession = localStorage.getItem('studiply_focus_session')
      return savedSession ? JSON.parse(savedSession) : null
    } catch (error) {
      console.error('Failed to load session from localStorage:', error)
      return null
    }
  }

  const clearSessionFromStorage = () => {
    try {
      localStorage.removeItem('studiply_focus_session')
      console.log('Session cleared')
    } catch (error) {
      console.error('Failed to clear session from localStorage:', error)
    }
  }

  // Load session on mount
  useEffect(() => {
    const savedSession = loadSessionFromStorage()
    if (savedSession) {
      const now = new Date().getTime()
      const endTime = new Date(savedSession.endTime).getTime()
      
      if (now < endTime) {
        const remainingTime = Math.floor((endTime - now) / 1000)
        if (remainingTime > 0) {
          console.log('Restoring session:', savedSession)
          setSessionType(savedSession.type)
          setTimeLeft(remainingTime)
          setIsActive(true)
        } else {
          clearSessionFromStorage()
        }
      } else {
        clearSessionFromStorage()
      }
    }
  }, [])

  // Save session when timeLeft changes
  useEffect(() => {
    if (isActive) {
      const selectedSession = sessionTypes.find(s => s.id === sessionType)
      const endTime = new Date(Date.now() + timeLeft * 1000)
      
      const sessionData = {
        type: sessionType,
        endTime: endTime.toISOString(),
        duration: selectedSession?.duration || 5
      }
      saveSessionToStorage(sessionData)
    }
  }, [timeLeft, isActive, sessionType])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      clearSessionFromStorage()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  // Reset time when session type changes (only if not active)
  useEffect(() => {
    if (!isActive) {
      const selectedSession = sessionTypes.find(s => s.id === sessionType)
      if (selectedSession) {
        setTimeLeft(selectedSession.duration * 60)
      }
    }
  }, [sessionType, isActive])

  const startSession = () => {
    setIsActive(true)
  }

  const pauseSession = () => {
    setIsActive(false)
  }

  const stopSession = () => {
    setIsActive(false)
    setTimeLeft(sessionTypes.find(s => s.id === sessionType)?.duration * 60 || 300)
    clearSessionFromStorage()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const debugLocalStorage = () => {
    console.log('=== localStorage Debug ===')
    console.log('Current session:', localStorage.getItem('studiply_focus_session'))
    console.log('Current state:', { sessionType, timeLeft, isActive })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
          Focus Mode Test
        </h1>

        {/* Session Type Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {sessionTypes.map((session) => (
              <button
                key={session.id}
                onClick={() => setSessionType(session.id)}
                className={`p-4 rounded-2xl font-medium transition-all duration-200 ${
                  sessionType === session.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-lg font-semibold">{session.name}</div>
                <div className="text-sm opacity-80">{session.duration} min</div>
              </button>
            ))}
          </div>
        </div>

        {/* Timer Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 text-center">
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xl text-gray-600 mb-6">
            {sessionTypes.find(s => s.id === sessionType)?.name} Session
          </div>
          
          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isActive ? (
              <button
                onClick={startSession}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                ▶️ Start
              </button>
            ) : (
              <button
                onClick={pauseSession}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                ⏸️ Pause
              </button>
            )}
            
            <button
              onClick={stopSession}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              ⏹️ Stop
            </button>
          </div>
        </div>

        {/* Debug Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Info</h3>
          <div className="space-y-2 text-sm">
            <div>Session Type: {sessionType}</div>
            <div>Time Left: {timeLeft} seconds</div>
            <div>Is Active: {isActive ? 'Yes' : 'No'}</div>
          </div>
          <button
            onClick={debugLocalStorage}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
          >
            🔍 Debug localStorage
          </button>
        </div>
      </div>
    </div>
  )
}

export default FocusModeTest
