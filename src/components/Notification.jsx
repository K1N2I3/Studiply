import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { SuccessIcon, ErrorIcon, WarningIcon, InfoIcon } from './CustomIcons'

const Notification = ({ 
  type = 'success', 
  message, 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    // 入场动画
    const enterTimer = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    // 进度条动画
    if (duration > 0) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 50))
          return newProgress <= 0 ? 0 : newProgress
        })
      }, 50)

      // 自动关闭计时器
      const exitTimer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearTimeout(enterTimer)
        clearTimeout(exitTimer)
        clearInterval(progressInterval)
      }
    }

    return () => clearTimeout(enterTimer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose && onClose()
    }, 400) // 等待退出动画完成
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SuccessIcon className="w-6 h-6 animate-pulse" />
      case 'error':
        return <ErrorIcon className="w-6 h-6 animate-bounce" />
      case 'warning':
        return <WarningIcon className="w-6 h-6 animate-pulse" />
      case 'info':
        return <InfoIcon className="w-6 h-6 animate-pulse" />
      default:
        return <SuccessIcon className="w-6 h-6 animate-pulse" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-green-200 shadow-green-100'
      case 'error':
        return 'bg-white border-red-200 shadow-red-100'
      case 'warning':
        return 'bg-white border-yellow-200 shadow-yellow-100'
      case 'info':
        return 'bg-white border-blue-200 shadow-blue-100'
      default:
        return 'bg-white border-green-200 shadow-green-100'
    }
  }

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-700'
      case 'error':
        return 'text-red-700'
      case 'warning':
        return 'text-yellow-700'
      case 'info':
        return 'text-blue-700'
      default:
        return 'text-green-700'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 pointer-events-none">
      <div className={`transform transition-all duration-400 ease-out pointer-events-auto ${
        isVisible && !isExiting 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-[-100%] opacity-0 scale-95'
      }`}>
        <div className={`rounded-xl border-2 p-6 shadow-2xl backdrop-blur-sm max-w-md w-full ${getBgColor()} relative overflow-hidden`}>
          {/* 进度条 */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100/30">
            <div 
              className={`h-full transition-all duration-100 ease-linear ${
                type === 'success' ? 'bg-green-300' :
                type === 'error' ? 'bg-red-300' :
                type === 'warning' ? 'bg-yellow-300' : 'bg-blue-300'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0 mr-3">
              {getIcon()}
            </div>
            <div className="flex-1 text-center">
              <p className={`text-sm font-semibold leading-relaxed ${getTextColor()}`}>
                {message}
              </p>
            </div>
            <div className="flex-shrink-0 ml-3">
              <button
                onClick={handleClose}
                className={`inline-flex rounded-full p-1.5 transition-all duration-200 ${getTextColor()} hover:bg-gray-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notification
