import React from 'react'
import { X, Star, Clock, DollarSign, BookOpen, User, Calendar, MessageCircle } from 'lucide-react'
import Avatar from './Avatar'

const TutorProfileModal = ({ isOpen, onClose, tutor }) => {
  if (!isOpen || !tutor) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tutor Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
            <div className="relative">
              <Avatar 
                user={tutor} 
                size="xl"
                className="w-24 h-24"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tutor.name}</h3>
              <p className="text-gray-600 mb-4">{tutor.email}</p>
              
              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(tutor.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {tutor.rating ? tutor.rating.toFixed(1) : 'No ratings yet'}
                </span>
                {tutor.stats?.totalSessions > 0 && (
                  <span className="text-sm text-gray-500">
                    ({tutor.stats.totalSessions} sessions)
                  </span>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{tutor.stats?.totalSessions || 0}</div>
                  <div className="text-xs text-blue-700 font-medium">Sessions</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    Studiply Pass
                  </div>
                  <div className="text-xs text-green-700 font-medium">Service</div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Subjects */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Subjects
              </h4>
              <div className="flex flex-wrap gap-2">
                {tutor.tutorProfile?.subjects?.map((subject, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {subject}
                  </span>
                )) || (
                  <span className="text-gray-500 text-sm">No subjects specified</span>
                )}
              </div>
            </div>

            {/* Experience */}
            {tutor.tutorProfile?.experience && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Experience
                </h4>
                <p className="text-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  {tutor.tutorProfile.experience}
                </p>
              </div>
            )}

            {/* Description */}
            {tutor.tutorProfile?.description && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                  About Me
                </h4>
                <p className="text-gray-700 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl leading-relaxed">
                  {tutor.tutorProfile.description}
                </p>
              </div>
            )}

            {/* Availability */}
            {tutor.tutorProfile?.availability && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Availability
                </h4>
                <p className="text-gray-700 bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl">
                  {tutor.tutorProfile.availability}
                </p>
              </div>
            )}

            {/* Stats */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Statistics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-indigo-600">{tutor.stats?.totalSessions || 0}</div>
                  <div className="text-xs text-indigo-700 font-medium">Total Sessions</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-yellow-600">{tutor.stats?.ratingCount || 0}</div>
                  <div className="text-xs text-yellow-700 font-medium">Reviews</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-pink-600">{tutor.stats?.averageRating?.toFixed(1) || '0.0'}</div>
                  <div className="text-xs text-pink-700 font-medium">Avg Rating</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center">
                  <div className="text-xl font-bold text-emerald-600">{tutor.stats?.completedSessions || 0}</div>
                  <div className="text-xs text-emerald-700 font-medium">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // This would typically trigger a session request
                onClose()
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Request Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorProfileModal
