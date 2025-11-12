import React, { useState } from 'react'
import { Star, X, MessageSquare } from 'lucide-react'
import { createRating } from '../services/ratingService'
import { useNotification } from '../contexts/NotificationContext'

const RatingModal = ({ isOpen, onClose, sessionData, user }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showSuccess, showError } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      showError('Please select a rating')
      return
    }

    setSubmitting(true)
    
    try {
      const result = await createRating(
        sessionData.id,
        sessionData.tutor.id,
        user?.id,
        rating,
        review.trim()
      )

      if (result.success) {
        showSuccess('Rating submitted successfully!')
        onClose()
        // 重置表单
        setRating(0)
        setReview('')
      } else {
        showError(result.error || 'Failed to submit rating')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      showError('An error occurred while submitting your rating')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setReview('')
    setHoveredRating(0)
    onClose()
  }

  if (!isOpen || !sessionData) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Rate Your Session</h2>
              <p className="text-sm text-gray-500">How was your tutoring experience?</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Session Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {sessionData.tutor.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{sessionData.tutor.name}</h3>
                <p className="text-sm text-gray-500">{sessionData.subject}</p>
                <p className="text-xs text-gray-400">
                  {sessionData.date ? new Date(sessionData.date).toLocaleDateString() : 'Session completed'}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate this session?
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Share your experience (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="How did this session help you? What did you learn?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {review.length}/500 characters
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Rating'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingModal
