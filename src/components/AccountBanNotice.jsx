import React, { useState, useEffect } from 'react'
import { AlertTriangle, Clock } from 'lucide-react'

const AccountBanNotice = ({ message, onComplete }) => {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown <= 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, onComplete])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Account Banned
        </h2>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-700 text-center leading-relaxed">
            {message || 'Your account has been banned by the administrator.'}
          </p>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Clock className="w-5 h-5 text-gray-500" />
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {countdown}
            </div>
            <p className="text-sm text-gray-500">
              {countdown === 1 ? 'second' : 'seconds'} remaining
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>

        <p className="text-xs text-gray-500 text-center">
          You will be redirected to the homepage automatically.
        </p>
      </div>
    </div>
  )
}

export default AccountBanNotice

