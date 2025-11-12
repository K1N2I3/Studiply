import React from 'react'
import { useNotification } from '../contexts/NotificationContext'

const NotificationTest = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotification()

  const handleSuccess = () => {
    showSuccess('Profile updated successfully! 🎉', 4000, 'Success')
  }

  const handleError = () => {
    showError('Invalid phone number format 📱', 5000, 'Error')
  }

  const handleWarning = () => {
    showWarning('Please check your input data ⚠️', 4000, 'Warning')
  }

  const handleInfo = () => {
    showInfo('This is an informational message 💡', 4000, 'Info')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🎨 Notification Polish Test
        </h1>
        
        <p className="text-gray-600 mb-8 text-center">
          点击下面的按钮测试新的polished通知效果
        </p>

        <div className="space-y-4">
          <button
            onClick={handleSuccess}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            ✅ Success Notification
          </button>
          
          <button
            onClick={handleError}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            ❌ Error Notification
          </button>
          
          <button
            onClick={handleWarning}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            ⚠️ Warning Notification
          </button>
          
          <button
            onClick={handleInfo}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            💡 Info Notification
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">✨ 新功能:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 居中显示的通知</li>
            <li>• 丝滑的进入/退出动画</li>
            <li>• 顶部进度条显示剩余时间</li>
            <li>• 自定义图标设计（蓝色圆圈+绿色勾号）</li>
            <li>• 现代化的玻璃质感设计</li>
            <li>• 独特的地球图标设计</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NotificationTest
