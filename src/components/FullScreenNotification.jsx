import React, { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

const FullScreenNotification = ({ isVisible, onClose, title, message, type = 'warning' }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      // 5秒后自动关闭
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(() => onClose(), 300) // 等待动画完成
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!show) return null

  const typeStyles = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`max-w-md w-full mx-4 p-6 rounded-xl border-2 shadow-2xl transform transition-all duration-300 ${typeStyles[type]}`}>
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-lg mb-4">{message}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShow(false)
                  setTimeout(() => onClose(), 300)
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                I Understand
              </button>
              <button
                onClick={() => {
                  setShow(false)
                  setTimeout(() => onClose(), 300)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setShow(false)
              setTimeout(() => onClose(), 300)
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FullScreenNotification
