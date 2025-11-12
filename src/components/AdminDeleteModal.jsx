import React, { useState } from 'react'
import { X, AlertTriangle, Trash2, User, Star } from 'lucide-react'
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

  if (!isOpen) return null

  const isTutor = type === 'tutor'
  const isReview = type === 'review'
  const isAccount = type === 'account'
  
  const requiredConfirmText = isTutor ? 'DELETE TUTOR' : isAccount ? 'DELETE ACCOUNT' : 'DELETE REVIEW'
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
    onConfirm()
  }

  const getTitle = () => {
    if (isTutor) return 'Delete Tutor Profile'
    if (isAccount) return 'Delete User Account'
    if (isReview) return 'Delete Review'
    return 'Delete Item'
  }

  const getDescription = () => {
    if (isTutor) {
      return `Are you sure you want to delete ${item?.name}'s tutor profile? This will permanently remove all their tutor information, sessions, and reviews.`
    }
    if (isAccount) {
      return `Are you sure you want to permanently delete ${item?.name}'s entire account? This will remove ALL user data including profile, sessions, ratings, progress, friends, and messages.`
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
      return 'This will permanently delete the entire user account and ALL associated data including profile, sessions, ratings, skill progress, quest progress, friends, and messages. This action is IRREVERSIBLE.'
    }
    if (isReview) {
      return 'This will permanently delete the review and update the tutor\'s rating statistics.'
    }
    return 'This action cannot be undone.'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
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

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{getDescription()}</p>
            
            {isTutor && item && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">Tutor Information</span>
                </div>
                <div className="text-sm text-red-700">
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>Sessions:</strong> {item.stats?.totalSessions || 0}</p>
                  <p><strong>Reviews:</strong> {item.stats?.ratingCount || 0}</p>
                </div>
              </div>
            )}

            {isAccount && item && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">Account Information</span>
                </div>
                <div className="text-sm text-red-700">
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Email:</strong> {item.email}</p>
                  <p><strong>School:</strong> {item.school || 'Not specified'}</p>
                  <p><strong>Grade:</strong> {item.grade || 'Not specified'}</p>
                  <p><strong>Is Tutor:</strong> {item.isTutor ? 'Yes' : 'No'}</p>
                  {item.isTutor && (
                    <>
                      <p><strong>Tutor Sessions:</strong> {item.stats?.totalSessions || 0}</p>
                      <p><strong>Tutor Reviews:</strong> {item.stats?.ratingCount || 0}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {isReview && item && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Star className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">Review Information</span>
                </div>
                <div className="text-sm text-red-700">
                  <p><strong>Rating:</strong> {item.rating}/5 stars</p>
                  <p><strong>Student:</strong> {item.studentName}</p>
                  <p><strong>Review:</strong> {item.review || 'No comment'}</p>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">Warning</p>
                  <p className="text-sm text-yellow-700">{getWarningText()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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
            <div className="flex space-x-3">
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
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete {isTutor ? 'Tutor' : isAccount ? 'Account' : 'Review'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminDeleteModal
