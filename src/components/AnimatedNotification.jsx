import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const AnimatedNotification = ({ 
  type = 'success', 
  title, 
  message, 
  duration = 4000, 
  onClose,
  show = false 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsAnimating(true)
      setProgress(100)
      
      // 启动进度条动画
      if (duration > 0) {
        const startTime = Date.now()
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const remaining = Math.max(0, duration - elapsed)
          const progressPercent = (remaining / duration) * 100
          
          setProgress(progressPercent)
          
          if (remaining <= 0) {
            clearInterval(progressInterval)
            handleClose()
          }
        }, 50) // 每50ms更新一次
        
        return () => clearInterval(progressInterval)
      }
    }
  }, [show, duration])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      onClose && onClose()
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />
      default:
        return <CheckCircle className="w-6 h-6 text-green-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          title: 'text-green-800',
          message: 'text-green-700',
          icon: 'text-green-500'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          title: 'text-red-800',
          message: 'text-red-700',
          icon: 'text-red-500'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          icon: 'text-yellow-500'
        }
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          title: 'text-blue-800',
          message: 'text-blue-700',
          icon: 'text-blue-500'
        }
      default:
        return {
          bg: 'bg-green-50 border-green-200',
          title: 'text-green-800',
          message: 'text-green-700',
          icon: 'text-green-500'
        }
    }
  }

  const colors = getColors()

  if (!isVisible) return null

  return (
    <div className="max-w-sm w-full">
      <div 
        className={`
          ${colors.bg} border-2 rounded-2xl shadow-2xl
          transition-all duration-300 ease-out
          ${isAnimating 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-8'
          } animate-slide-down
        `}
        style={{
          backgroundColor: type === 'success' ? '#f0fdf4' : 
                          type === 'error' ? '#fef2f2' : 
                          type === 'warning' ? '#fffbeb' : '#eff6ff',
          borderColor: type === 'success' ? '#bbf7d0' : 
                      type === 'error' ? '#fecaca' : 
                      type === 'warning' ? '#fed7aa' : '#bfdbfe'
        }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/20 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
        </div>
        
        <div className="relative p-6">
          {/* 关闭按钮 */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/50 transition-colors duration-200 group"
          >
            <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          </button>

          {/* 内容 */}
          <div className="flex items-start space-x-4 pr-8">
            {/* 图标 */}
            <div className="flex-shrink-0">
              <div 
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  shadow-lg border-2
                  ${isAnimating ? 'animate-bounce' : ''}
                `}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderColor: 'rgba(255, 255, 255, 0.5)'
                }}
              >
                {getIcon()}
              </div>
            </div>

            {/* 文本内容 */}
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`text-lg font-bold ${colors.title} mb-1`}>
                  {title}
                </h4>
              )}
              {message && (
                <p className={`text-sm ${colors.message} leading-relaxed`}>
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* 顶部进度条（倒计时） */}
          {duration > 0 && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100/30 rounded-t-2xl overflow-hidden">
              <div 
                className={`
                  h-full transition-all duration-100 ease-linear
                  ${type === 'success' ? 'bg-gradient-to-r from-green-300 to-green-400' :
                    type === 'error' ? 'bg-gradient-to-r from-red-300 to-red-400' :
                    type === 'warning' ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' :
                    'bg-gradient-to-r from-blue-300 to-blue-400'}
                `}
                style={{
                  width: `${progress}%`
                }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* 自定义CSS动画 */}
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slideDown 300ms ease-out; }
      `}</style>
    </div>
  )
}

export default AnimatedNotification
