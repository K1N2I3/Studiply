import React, { useState, useEffect, useCallback } from 'react'
import { Star, MessageSquare, User, Calendar, ThumbsUp } from 'lucide-react'
import { getTutorRatings, getTutorRatingStats } from '../services/ratingService'
import { formatTimestamp, safeToDate } from '../utils/timestampUtils'

const TutorReviews = ({ tutorId, tutorName }) => {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0
  })
  const [loading, setLoading] = useState(true)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      console.log('🔍 Loading reviews for tutor:', tutorId)
      
      // 获取评分统计
      const statsResult = await getTutorRatingStats(tutorId)
      console.log('📊 Stats result:', statsResult)
      if (statsResult.success) {
        setStats({
          averageRating: statsResult.averageRating || 0,
          totalReviews: statsResult.ratingCount || 0
        })
        console.log('✅ Stats loaded:', {
          averageRating: statsResult.averageRating || 0,
          totalReviews: statsResult.ratingCount || 0
        })
      }
      
      // 获取评论列表
      const reviewsResult = await getTutorRatings(tutorId, showAllReviews ? 20 : 3)
      console.log('💬 Reviews result:', reviewsResult)
      if (reviewsResult.success) {
        console.log('✅ Reviews loaded:', reviewsResult.ratings.length, 'reviews')
        console.log('📝 Reviews data:', reviewsResult.ratings)
        setReviews(reviewsResult.ratings)
      } else {
        console.error('❌ Failed to load reviews:', reviewsResult.error)
      }
    } catch (error) {
      console.error('❌ Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [tutorId, showAllReviews])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const formatDate = (timestamp) => {
    try {
      if (!timestamp) return 'Recently'
      return formatTimestamp(timestamp) || 'Recently'
    } catch (error) {
      console.error('Error formatting date:', error, 'Original timestamp:', timestamp)
      return 'Recently'
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }


  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (stats.totalReviews === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">This tutor hasn't received any reviews yet. Be the first to share your experience!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Header with Rating Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.averageRating.toFixed(1)}
            </span>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">{stats.totalReviews}</span> review{stats.totalReviews !== 1 ? 's' : ''}
          </div>
        </div>
        
        {stats.totalReviews > 3 && (
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {showAllReviews ? 'Show Less' : `View All ${stats.totalReviews} Reviews`}
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-600">We found {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''} in our database, but couldn't load the details.</p>
            <p className="text-sm text-gray-500 mt-2">This might be a temporary issue. Please try again later.</p>
          </div>
        ) : (
          reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{review.studentName || 'Student'}</span>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {review.review && (
              <div className="mt-3 pl-11">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{review.review}</p>
                </div>
              </div>
            )}
          </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {!showAllReviews && stats.totalReviews > 3 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAllReviews(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Show More Reviews
          </button>
        </div>
      )}
    </div>
  )
}

export default TutorReviews
