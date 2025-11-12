import React, { useState, useEffect } from 'react'
import { X, Save, Star, Clock, BookOpen, User, AlertCircle } from 'lucide-react'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useNotification } from '../contexts/NotificationContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const EditTutorProfileModal = ({ isOpen, onClose, currentProfile }) => {
  const { showSuccess, showError } = useNotification()
  const { user, reloadUser } = useSimpleAuth()
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

  // 初始化表单数据
  useEffect(() => {
    if (currentProfile && isOpen) {
      setFormData({
        isAvailable: currentProfile.isAvailable !== false,
        specialties: currentProfile.specialties || [],
        description: currentProfile.description || '',
        experience: currentProfile.experience || 'Student',
        responseTime: currentProfile.responseTime || 'Usually responds within a few hours'
      })
    }
  }, [currentProfile, isOpen])

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
    
    if (!user?.id) {
      showError('User not found', 'Error')
      return
    }

    if (formData.specialties.length === 0) {
      showError('Please select at least one specialty', 'Validation Error')
      return
    }

    if (!formData.description.trim()) {
      showError('Please provide a description', 'Validation Error')
      return
    }

    try {
      setLoading(true)
      
      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, {
        tutorProfile: {
          isAvailable: formData.isAvailable,
          specialties: formData.specialties,
          description: formData.description.trim(),
          experience: formData.experience,
          responseTime: formData.responseTime,
          updatedAt: serverTimestamp()
        },
        subjects: formData.specialties, // 同步更新subjects字段
        updatedAt: serverTimestamp()
      })

      // 更新本地用户状态
      const updatedUser = {
        ...user,
        tutorProfile: {
          ...user.tutorProfile,
          isAvailable: formData.isAvailable,
          specialties: formData.specialties,
          description: formData.description.trim(),
          experience: formData.experience,
          responseTime: formData.responseTime,
          updatedAt: new Date()
        },
        subjects: formData.specialties
      }
      
      localStorage.setItem('simpleUser', JSON.stringify(updatedUser))
      reloadUser()

      showSuccess('Tutor profile updated successfully!', 'Profile Updated')
      onClose()
    } catch (error) {
      console.error('Error updating tutor profile:', error)
      showError(`Failed to update profile: ${error.message}`, 'Update Failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Tutor Profile</h2>
              <p className="text-sm text-gray-600">Update your tutoring information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Availability */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Availability</span>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className="text-gray-700">I'm available for tutoring sessions</span>
            </label>
          </div>

          {/* Specialties */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Specialties *</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSubjects.map((subject) => (
                <label
                  key={subject}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.specialties.includes(subject)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.specialties.includes(subject)}
                    onChange={() => handleSpecialtyToggle(subject)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium">{subject}</span>
                </label>
              ))}
            </div>
            {formData.specialties.length === 0 && (
              <p className="text-red-500 text-sm mt-2">Please select at least one specialty</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Description *</span>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell students about your teaching style, experience, and what makes you a great tutor..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400 bg-white"
              rows={4}
              required
            />
            <p className="text-gray-500 text-sm mt-2">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Experience Level */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Experience Level</span>
            </div>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
            >
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Response Time */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Response Time</span>
            </div>
            <select
              name="responseTime"
              value={formData.responseTime}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
            >
              {responseTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.specialties.length === 0 || !formData.description.trim()}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTutorProfileModal
