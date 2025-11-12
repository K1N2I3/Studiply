import React, { useState } from 'react'
import { Star, X, MessageSquare, Send } from 'lucide-react'
import { createRating } from '../services/ratingService'
import { useNotification } from '../contexts/NotificationContext'
import { safeToDate } from '../utils/timestampUtils'

const SubmitReviewModal = ({ isOpen, onClose, sessionData, tutor }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showSuccess, showError } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      showError('Please select a rating', 'Rating Required')
      return
    }

    if (!review.trim()) {
      showError('Please write a review', 'Review Required')
      return
    }

    setSubmitting(true)
    
    try {
      const result = await createRating(
        sessionData.id,
        sessionData.tutorId,
        sessionData.studentId,
        rating,
        review.trim()
      )

      if (result.success) {
        showSuccess('Thank you for your review! Your feedback helps other students.', 'Review Submitted!')
        onClose()
        // 重置表单
        setRating(0)
        setReview('')
        setHoveredRating(0)
      } else {
        showError(result.error || 'Failed to submit review', 'Submission Failed')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      showError('An error occurred while submitting your review', 'Error')
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

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-8 h-8 cursor-pointer transition-colors ${
          i < (hoveredRating || rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 hover:text-yellow-200'
        }`}
        onMouseEnter={() => setHoveredRating(i + 1)}
        onMouseLeave={() => setHoveredRating(0)}
        onClick={() => setRating(i + 1)}
      />
    ))
  }

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    }
    return texts[rating] || ''
  }

  if (!isOpen || !sessionData || !tutor) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Rate Your Session</h2>
              <p className="text-blue-100 mt-1">How was your tutoring session with {tutor.name}?</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Session Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Session Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><span className="font-medium">Tutor:</span> {tutor.name}</div>
                <div><span className="font-medium">Subject:</span> {sessionData.subject || 'General'}</div>
                <div><span className="font-medium">Date:</span> {sessionData.createdAt ? safeToDate(sessionData.createdAt).toLocaleDateString() : 'Unknown'}</div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                How would you rate this session? *
              </label>
              <div className="flex items-center space-x-2 mb-2">
                {renderStars()}
                {rating > 0 && (
                  <span className="ml-3 text-lg font-medium text-gray-700">
                    {getRatingText(rating)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Click on a star to rate from 1 (Poor) to 5 (Excellent)
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Write a review *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this tutor. What did you like? How did they help you? Any suggestions for improvement?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={5}
                  maxLength={500}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  Be specific and helpful for other students
                </p>
                <span className="text-sm text-gray-400">
                  {review.length}/500
                </span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Review Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be honest and constructive</li>
                <li>• Focus on the tutoring experience</li>
                <li>• Help other students make informed decisions</li>
                <li>• Avoid personal attacks or inappropriate language</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rating === 0 || !review.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Review
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

export default SubmitReviewModal
