import React, { useState } from 'react'
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { removeUserAsTutor } from '../services/tutorService'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import DeleteConfirmModal from './DeleteConfirmModal'

const ClearTutorStatus = ({ user, onSuccess }) => {
  const { reloadUser } = useSimpleAuth()
  const { showSuccess, showError } = useNotification()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleClearTutorStatus = async () => {
    if (!user?.id) {
      showError('用户信息未找到', '错误')
      return
    }

    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      const result = await removeUserAsTutor(user?.id)
      if (result.success) {
        setShowModal(false)
        showSuccess('导师身份已成功移除！', '删除成功')
        
        // 更新本地用户状态
        const updatedUser = { ...user, isTutor: false }
        localStorage.setItem('simpleUser', JSON.stringify(updatedUser))
        reloadUser() // 重新加载用户状态
        onSuccess && onSuccess()
      } else {
        showError(`无法移除导师身份: ${result.error}`, '删除失败')
      }
    } catch (error) {
      showError('移除导师身份时发生错误', '发生错误')
      console.error('Error removing tutor status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Trash2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Remove Tutor Status</h3>
          <p className="text-gray-600">Stop being a tutor and remove your tutor profile</p>
        </div>
      </div>

      {/* 警告信息 */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="text-orange-800">
            <p className="font-semibold text-lg mb-2">Warning</p>
            <p className="leading-relaxed">This will permanently remove your tutor profile and you won't appear in the tutor list anymore. Students won't be able to request sessions from you.</p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <button
        onClick={handleClearTutorStatus}
        disabled={loading}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Removing...</span>
          </>
        ) : (
          <>
            <Trash2 className="w-5 h-5" />
            <span>Remove Tutor Status</span>
          </>
        )}
      </button>

      {/* 删除确认模态框 */}
      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Tutor Status"
        message="Are you sure you want to remove your tutor status? This will permanently delete your tutor profile, and students will no longer be able to request courses from you. This action cannot be undone."
        confirmText="Confirm Removal"
        cancelText="Cancel"
        loading={loading}
        userName={user?.name || 'User'}
      />

    </div>
  )
}

export default ClearTutorStatus
