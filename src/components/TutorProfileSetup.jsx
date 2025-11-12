import React, { useState } from 'react'
import { X, Save, Star, DollarSign, Clock, BookOpen, MapPin, User } from 'lucide-react'
import { setUserAsTutor } from '../services/tutorService'
import { useNotification } from '../contexts/NotificationContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const TutorProfileSetup = ({ user, onClose, onSuccess }) => {
  const { showSuccess, showError } = useNotification()
  const { reloadUser } = useSimpleAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    isAvailable: true,
    specialties: [],
    description: '',
    experience: 'Student',
    responseTime: 'Usually responds within a few hours'
  })

  const availableSubjects = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Literature', 'Writing', 'History', 'Geography',
    'Art', 'Music', 'Programming', 'Computer Science', 'Economics',
    'Psychology', 'Philosophy', 'Languages', 'Other'
  ]

  const experienceLevels = [
    'Student',
    'Recent Graduate',
    'Graduate Student',
    'Professional',
    'Teacher/Professor'
  ]

  const responseTimes = [
    'Usually responds within a few hours',
    'Usually responds within a day',
    'Usually responds within a few days'
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      const result = await setUserAsTutor(user?.id, formData)
      if (result.success) {
        showSuccess('Tutor profile setup successfully! You are now available for tutoring sessions.')
        // 更新用户状态，标记为导师
        const updatedUser = { ...user, isTutor: true }
        localStorage.setItem('simpleUser', JSON.stringify(updatedUser))
        reloadUser() // 重新加载用户状态
        onSuccess && onSuccess()
        onClose()
      } else {
        showError(`Failed to setup tutor profile: ${result.error}`)
      }
    } catch (error) {
      showError('An error occurred while setting up your tutor profile')
      console.error('Error setting up tutor profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Set Up Your Tutor Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Availability */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Available for tutoring</span>
                <p className="text-xs text-gray-500">Students can request sessions from you</p>
              </div>
            </label>
          </div>

          {/* Hourly Rate */}

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Experience Level
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Subjects You Can Teach
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {availableSubjects.map(subject => (
                <label key={subject} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(subject)}
                    onChange={() => handleSpecialtyToggle(subject)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span>{subject}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Select all subjects you're comfortable teaching</p>
          </div>

          {/* Response Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Response Time
            </label>
            <select
              name="responseTime"
              value={formData.responseTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {responseTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell students about your teaching style, experience, and what makes you a great tutor..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">This will be shown to students looking for help</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.specialties.length === 0}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Setting up...' : 'Set Up Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TutorProfileSetup
