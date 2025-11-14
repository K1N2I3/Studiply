import React, { useState } from 'react'
import { X, AlertTriangle, Trash2, User, Star, CheckCircle } from 'lucide-react'
import { useNotification } from '../contexts/NotificationContext'

const AdminDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  item, 
  loading = false 
}) => {
  const { showError } = useNotification()
  const [confirmText, setConfirmText] = useState('')
  const [deletionMessage, setDeletionMessage] = useState('')

  if (!isOpen) return null

  const isTutor = type === 'tutor'
  const isReview = type === 'review'
  const isAccount = type === 'account'
  const isUnban = type === 'unban'
  
  const requiredConfirmText = isTutor ? 'DELETE TUTOR' : isAccount ? 'BAN ACCOUNT' : isUnban ? 'UNBAN ACCOUNT' : 'DELETE REVIEW'
  const isConfirmValid = confirmText === requiredConfirmText

  const handleSubmit = (e) => {
    e.preventDefault()
    
    console.log('🔍 Delete modal form submitted')
    console.log('🔍 Confirm text:', confirmText)
    console.log('🔍 Required text:', requiredConfirmText)
    console.log('🔍 Is valid:', isConfirmValid)
    
    if (!isConfirmValid) {
      showError('Please type the confirmation text exactly as shown', 'Invalid Confirmation')
      return
    }
    
    console.log('✅ Confirmation valid, calling onConfirm')
    // 如果是封禁账户，传递封禁消息
    if (isAccount) {
      onConfirm(deletionMessage)
    } else {
      onConfirm()
    }
  }

  const getTitle = () => {
    if (isTutor) return 'Delete Tutor Profile'
    if (isAccount) return 'Ban User Account'
    if (isUnban) return 'Unban User Account'
    if (isReview) return 'Delete Review'
    return 'Delete Item'
  }

  const getDescription = () => {
    if (isTutor) {
      return `Are you sure you want to delete ${item?.name}'s tutor profile? This will permanently remove all their tutor information, sessions, and reviews.`
    }
    if (isAccount) {
      return `Are you sure you want to ban ${item?.name}'s account? This will prevent them from logging in and they will be logged out immediately with a 5-second countdown.`
    }
    if (isUnban) {
      return `Are you sure you want to unban ${item?.name}'s account? This will restore their access and allow them to log in again.`
    }
    if (isReview) {
      return `Are you sure you want to delete this review? This action cannot be undone.`
    }
    return 'Are you sure you want to delete this item? This action cannot be undone.'
  }

  const getWarningText = () => {
    if (isTutor) {
      return 'This will permanently delete the tutor profile and all associated data including sessions, reviews, and statistics.'
    }
    if (isAccount) {
      return 'This will ban the user account. The user will be logged out immediately with a 5-second countdown and will not be able to log in again. They will see a message that their account has been banned by the administrator.'
    }
    if (isUnban) {
      return 'This will restore the user\'s access to their account. They will be able to log in again immediately.'
    }
    if (isReview) {
      return 'This will permanently delete the review and update the tutor\'s rating statistics.'
    }
    return 'This action cannot be undone.'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isUnban 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}>
              {isUnban ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
              <p className="text-sm text-gray-600">Administrative action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Two Column Layout */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">{getDescription()}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Information */}
            <div className="space-y-4">
              {isTutor && item && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Tutor Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-red-700">
                    <p><strong>Name:</strong> {item.name}</p>
                    <p><strong>Email:</strong> {item.email}</p>
                    <p><strong>Sessions:</strong> {item.stats?.totalSessions || 0}</p>
                    <p><strong>Reviews:</strong> {item.stats?.ratingCount || 0}</p>
                  </div>
                </div>
              )}

              {isAccount && item && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Account Information</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-red-700">
                    <p><strong>Name:</strong> {item.name}</p>
                    <p><strong>Email:</strong> {item.email}</p>
                    <p><strong>School:</strong> {item.school || 'N/A'}</p>
                    <p><strong>Grade:</strong> {item.grade || 'N/A'}</p>
                    <p><strong>Is Tutor:</strong> {item.isTutor ? 'Yes' : 'No'}</p>
                    {item.isTutor && (
                      <>
                        <p><strong>Sessions:</strong> {item.stats?.totalSessions || 0}</p>
                        <p><strong>Reviews:</strong> {item.stats?.ratingCount || 0}</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {isReview && item && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Star className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Review Information</span>
                  </div>
                  <div className="text-sm text-red-700 space-y-1">
                    <p><strong>Rating:</strong> {item.rating}/5 stars</p>
                    <p><strong>Student:</strong> {item.studentName}</p>
                    <p><strong>Review:</strong> {item.review || 'No comment'}</p>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800 mb-1">Warning</p>
                    <p className="text-sm text-yellow-700">{getWarningText()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Confirmation Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 封禁消息输入框（仅当封禁账户时显示） */}
                {isAccount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message to user (optional):
                    </label>
                    <textarea
                      value={deletionMessage}
                      onChange={(e) => setDeletionMessage(e.target.value)}
                      placeholder="Enter a message that will be shown to the user before they are logged out..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This message will be displayed to the user with a 5-second countdown before logout. If left empty, a default message will be shown.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">{requiredConfirmText}</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={`Type "${requiredConfirmText}" here`}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isConfirmValid || loading}
                    className={`flex-1 py-3 px-4 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2 ${
                      isUnban
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isUnban ? 'Unbanning...' : 'Deleting...'}</span>
                      </>
                    ) : (
                      <>
                        {isUnban ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span>
                          {isTutor ? 'Delete Tutor' : isAccount ? 'Ban Account' : isUnban ? 'Unban Account' : 'Delete Review'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDeleteModal
