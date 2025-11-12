import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, Users, X } from 'lucide-react'

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Remove Tutor Status',
  message = 'Are you sure you want to remove your tutor status? This will permanently delete your tutor profile, and students will no longer be able to request courses from you. This action cannot be undone.',
  confirmText = 'Confirm Removal',
  cancelText = 'Cancel',
  loading = false,
  userName = 'TESTING ACCOUNT'
}) => {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const closeModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 500)
  }

  const handleConfirm = async () => {
    setIsClosing(true)
    await onConfirm()
  }

  if (!isOpen) return null

  const modalContent = (
    <div>
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modalEnter {
          from { 
            opacity: 0;
            transform: scale(0.7) translateY(30px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes modalExit {
          from { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to { 
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
        }
        @keyframes slideInDown {
          from { 
            opacity: 0;
            transform: translateY(-30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideOutUp {
          from { 
            opacity: 1;
            transform: translateY(0);
          }
          to { 
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>

      {/* 全屏模态框容器 */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-500 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={closeModal}
        style={{
          animation: isClosing ? 'fadeOut 0.5s ease-in-out' : 'fadeIn 0.5s ease-in-out',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
      >
        {/* 居中容器 */}
        <div 
          className="flex items-center justify-center w-full h-full p-4"
          style={{
            minHeight: '100vh',
            width: '100%'
          }}
        >
          {/* 模态框 */}
          <div 
            className={`bg-white rounded-3xl shadow-2xl max-w-md w-full border border-white/20 overflow-hidden transition-all duration-500 ${
              isClosing ? 'opacity-0 scale-95 translate-y-8' : 'opacity-100 scale-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isClosing ? 'modalExit 0.5s ease-in-out' : 'modalEnter 0.5s ease-in-out'
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div 
                className={`flex items-center space-x-3 transition-all duration-500 ${
                  isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
                style={{
                  animation: isClosing ? 'slideOutUp 0.3s ease-in-out 0.1s' : 'slideInDown 0.5s ease-out 0.1s'
                }}
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                  <Trash2 className="w-6 h-6 text-white animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Remove Tutor Status</h3>
                  <p className="text-white/90">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div 
                className={`flex items-center space-x-4 mb-6 transition-all duration-500 ${
                  isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
                style={{
                  animation: isClosing ? 'slideOutUp 0.3s ease-in-out 0.15s' : 'slideInDown 0.5s ease-out 0.2s'
                }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Are you sure you want to remove your tutor status?</p>
                  <p className="text-lg font-bold text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-600">This will permanently delete your tutor profile</p>
                </div>
              </div>
              
              <div 
                className={`bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 mb-6 transition-all duration-500 ${
                  isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
                style={{
                  animation: isClosing ? 'slideOutUp 0.3s ease-in-out 0.2s' : 'slideInDown 0.5s ease-out 0.3s'
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
                    <X className="w-4 h-4 text-white animate-ping" />
                  </div>
                  <div className="text-orange-800">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">Students will no longer be able to request courses from you, and you will lose all tutor privileges.</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div 
                className={`flex space-x-3 transition-all duration-500 ${
                  isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
                style={{
                  animation: isClosing ? 'slideOutUp 0.3s ease-in-out 0.25s' : 'slideInDown 0.5s ease-out 0.4s'
                }}
              >
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{confirmText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // 使用Portal渲染到body元素，确保覆盖整个屏幕
  return createPortal(modalContent, document.body)
}

export default DeleteConfirmModal