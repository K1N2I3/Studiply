import React, { useState, useEffect, useRef } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  BookOpen,
  Star,
  Settings,
  Camera
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { updateUserProfile, validateProfileData, deleteUserAccount } from '../services/userService'
import { useNotification } from '../contexts/NotificationContext'
import { compressImage, validateImageFile, getImageFileInfo } from '../utils/imageCompression'
import Avatar from '../components/Avatar'
import ClearTutorStatus from '../components/ClearTutorStatus'
import PhoneNumberInput from '../components/PhoneNumberInput'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import PhoneVerificationModal from '../components/PhoneVerificationModal'

const Profile = () => {
  const { user, updateUser } = useSimpleAuth()
  const { isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    bio: '',
    subjects: [],
    location: ''
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [phoneNeedsVerification, setPhoneNeedsVerification] = useState(false)
  const [originalPhone, setOriginalPhone] = useState('')

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar)
    } else {
      setAvatarPreview(null)
    }
  }, [user?.avatar])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        school: user.school || '',
        grade: user.grade || '',
        bio: user.bio || '',
        subjects: user.subjects || [],
        location: user.location || ''
      })
      setOriginalPhone(user.phone || '')
    }
  }, [user])

  useEffect(() => {
    if (user && !isEditing) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        school: user.school || '',
        grade: user.grade || '',
        bio: user.bio || '',
        subjects: user.subjects || [],
        location: user.location || ''
      })
      setOriginalPhone(user.phone || '')
      setPhoneNeedsVerification(false)
    }
  }, [user, isEditing])


  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // If phone number changes, mark it as needing verification
    if (field === 'phone' && value !== originalPhone && value.trim()) {
      setPhoneNeedsVerification(true)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Check if phone number needs verification
      if (phoneNeedsVerification && profileData.phone && profileData.phone.trim()) {
        showError('Please verify your phone number before saving', 5000, 'Verification Required')
        setShowPhoneVerification(true)
        setIsSaving(false)
        return
      }
      
      const validation = validateProfileData(profileData)
      if (!validation.isValid) {
        showError(validation.errors.join(', '))
        return
      }
      const result = await updateUserProfile(user?.id, profileData)
      if (result.success) {
        const updatedUser = {
          ...user,
          ...profileData,
          email: user.email,
          phoneVerified: phoneNeedsVerification ? false : user.phoneVerified
        }
        updateUser(updatedUser)
        showSuccess('Profile updated successfully!', 4000, 'Success')
        setIsEditing(false)
        setPhoneNeedsVerification(false)
        setOriginalPhone(profileData.phone)
      } else {
        showError(result.error || 'Failed to update profile', 5000, 'Error')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      showError('An unexpected error occurred while saving your profile', 5000, 'Error')
    } finally {
      setIsSaving(false)
    }
  }

  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
    'Geography', 'Computer Science', 'Programming', 'Art', 'Music',
    'Physical Education', 'Psychology', 'Economics', 'Business', 'Languages'
  ]

  const handleSubjectToggle = (subject) => {
    const newSubjects = profileData.subjects.includes(subject)
      ? profileData.subjects.filter(s => s !== subject)
      : [...profileData.subjects, subject]
    setProfileData(prev => ({
      ...prev,
      subjects: newSubjects
    }))
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    try {
      setIsUploadingAvatar(true)
      const validation = validateImageFile(file, {
        maxSizeMB: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      })
      if (!validation.valid) {
        showError(validation.errors.join(', '))
        return
      }
      const fileInfo = getImageFileInfo(file)
      const compressedAvatar = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.8,
        maxSizeKB: 500
      })
      const compressedSizeKB = Math.round((compressedAvatar.length * 3 / 4) / 1024)
      setAvatarPreview(compressedAvatar)
      const result = await updateUserProfile(user?.id, { avatar: compressedAvatar })
      if (result.success) {
        const updatedUser = { ...user, avatar: compressedAvatar }
        updateUser(updatedUser)
        showSuccess(`Avatar updated successfully! Compressed size: ${compressedSizeKB}KB`, 4000, 'Success')
      } else {
        showError('Failed to save avatar', 5000, 'Error')
        setAvatarPreview(null)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      showError(`Avatar upload failed: ${error.message}`, 5000, 'Error')
      setAvatarPreview(null)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true)
      const result = await updateUserProfile(user?.id, { avatar: null })
      if (result.success) {
        const updatedUser = { ...user, avatar: null }
        updateUser(updatedUser)
        setAvatarPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        showSuccess('Avatar removed', 4000, 'Success')
      } else {
        showError('Failed to remove avatar', 5000, 'Error')
      }
    } catch (error) {
      console.error('Error removing avatar:', error)
      showError('Failed to remove avatar', 5000, 'Error')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark
          ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b]'
          : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
            isDark
              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}>
            <User className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>Loading Profile</h3>
          <p className={`text-sm ${
            isDark ? 'text-white/70' : 'text-slate-600'
          }`}>Loading your information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-[#120b2c] via-[#1a1240] to-[#09071b] text-white'
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
        .hide-scrollbar { scrollbar-width: none; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-12 h-80 w-80 rounded-full bg-pink-400/25 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-indigo-400/15 blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 hide-scrollbar">
        {/* Page Header */}
        <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-500 mb-4">
            <User className="h-4 w-4" /> Your profile
          </div>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight mb-2 ${
            isDark
              ? 'bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700 bg-clip-text text-transparent'
          }`}>
            My Profile
          </h1>
          <p className={`text-sm md:text-base ${
            isDark ? 'text-white/70' : 'text-slate-600'
          }`}>
            Manage your account and view your progress
          </p>
        </section>

        {/* Profile Overview Section */}
        <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
          isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div 
                className="cursor-pointer group-hover:scale-105 transition-transform duration-300"
                onClick={handleAvatarClick}
              >
                <Avatar 
                  user={{
                    ...user,
                    avatar: user.avatar || avatarPreview
                  }} 
                  size="3xl" 
                  className={`border-4 shadow-2xl ${
                    isDark ? 'border-white/30' : 'border-purple-200'
                  }`}
                />
              </div>
              <button 
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className={`absolute bottom-2 right-2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? 'bg-white/90 backdrop-blur-sm hover:bg-white'
                    : 'bg-white hover:bg-purple-50'
                }`}
              >
                {isUploadingAvatar ? (
                  <div className={`w-4 h-4 border-2 rounded-full animate-spin ${
                    isDark ? 'border-blue-600 border-t-transparent' : 'border-purple-600 border-t-transparent'
                  }`} />
                ) : (
                  <Camera className={`w-5 h-5 ${isDark ? 'text-gray-700' : 'text-purple-700'}`} />
                )}
              </button>
              {(user.avatar || avatarPreview) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveAvatar()
                  }}
                  disabled={isUploadingAvatar}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingAvatar ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <X className="w-4 h-4 text-white" />
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full mb-3 rounded-xl px-4 py-3 text-2xl font-bold transition-all ${
                    isDark
                      ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/70 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                  placeholder="Your Name"
                />
              ) : (
                <h1 className={`text-3xl md:text-4xl font-black mb-3 ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-purple-700 via-pink-600 to-blue-700 bg-clip-text text-transparent'
                }`}>
                  {user.name || 'User Name'}
                </h1>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  placeholder="Grade/Level"
                  className={`w-full rounded-xl px-4 py-2 text-lg transition-all ${
                    isDark
                      ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/60 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                      : 'bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                />
              ) : (
                <p className={`text-xl mb-4 ${
                  isDark ? 'text-white/80' : 'text-slate-600'
                }`}>
                  {user.grade || 'Student'}
                </p>
              )}
              <p className={`text-sm mb-6 ${
                isDark ? 'text-white/60' : 'text-slate-500'
              }`}>
                Click on avatar to upload a new photo
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-blue-600'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      }`}
                    >
                      <Save className="h-5 w-5" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                        isDark
                          ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <X className="h-5 w-5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${
                        isDark
                          ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      }`}
                    >
                      <Edit3 className="h-5 w-5" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold bg-red-500/80 text-white border border-red-400/50 hover:bg-red-600 transition hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                    >
                      <X className="h-5 w-5" />
                      Delete Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 text-white shadow-lg">
                <User className="h-6 w-6" />
              </div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Contact Information</h2>
            </div>
            
            <div className="space-y-5">
              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className={`h-4 w-4 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>Email Address</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDark ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-50'
                  }`}>Read-only</span>
                </div>
                <div className={`rounded-xl p-4 border ${
                  isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                }`}>
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>{user.email}</span>
                </div>
              </div>
              
              {/* Phone */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className={`h-4 w-4 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>
                    Phone Number
                    {user?.phoneVerified && (
                      <span className="ml-2 text-xs text-green-500">✓ Verified</span>
                    )}
                    {phoneNeedsVerification && (
                      <span className="ml-2 text-xs text-orange-500">⚠ Needs verification</span>
                    )}
                  </span>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <PhoneNumberInput
                      value={profileData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      placeholder="Enter your phone number"
                    />
                    {phoneNeedsVerification && profileData.phone && (
                      <button
                        type="button"
                        onClick={() => setShowPhoneVerification(true)}
                        className={`text-sm font-medium transition-all ${
                          isDark
                            ? 'text-purple-400 hover:text-purple-300'
                            : 'text-purple-600 hover:text-purple-700'
                        }`}
                      >
                        Verify phone number
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-xl p-4 border ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <span className={`font-medium ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{user.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>
              
              {/* Location */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className={`h-4 w-4 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>Location</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your location"
                    className={`w-full rounded-xl px-4 py-3 transition-all ${
                      isDark
                        ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30'
                        : 'bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                  />
                ) : (
                  <div className={`rounded-xl p-4 border ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <span className={`font-medium ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{user.location || 'Not provided'}</span>
                  </div>
                )}
              </div>
              
              {/* School */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className={`h-4 w-4 ${
                    isDark ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>School</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.school}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    placeholder="Enter your school name"
                    className={`w-full rounded-xl px-4 py-3 transition-all ${
                      isDark
                        ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/30'
                        : 'bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                ) : (
                  <div className={`rounded-xl p-4 border ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <span className={`font-medium ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{user.school || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white shadow-lg">
                <Settings className="h-6 w-6" />
              </div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Additional Information</h2>
            </div>
            
            <div className="space-y-5">
              {/* Bio */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Edit3 className={`h-4 w-4 ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>Bio</span>
                </div>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className={`w-full rounded-xl px-4 py-3 resize-none transition-all ${
                      isDark
                        ? 'bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-500/30'
                        : 'bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-500/20'
                    }`}
                  />
                ) : (
                  <div className={`rounded-xl p-4 border min-h-[100px] ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <span className={`font-medium leading-relaxed ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {user.bio || 'No bio provided'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Subjects */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className={`h-4 w-4 ${
                    isDark ? 'text-teal-400' : 'text-teal-600'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    isDark ? 'text-white/90' : 'text-slate-700'
                  }`}>Subjects</span>
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className={`rounded-2xl border p-4 max-h-64 overflow-y-auto ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
                    }`}>
                      <div className="grid grid-cols-2 gap-3">
                        {availableSubjects.map((subject) => (
                          <label key={subject} className="flex items-center gap-2 text-sm cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={profileData.subjects.includes(subject)}
                              onChange={() => handleSubjectToggle(subject)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${
                              profileData.subjects.includes(subject)
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400'
                                : isDark
                                  ? 'bg-white/10 border-white/30 group-hover:bg-blue-500/20'
                                  : 'bg-white border-slate-300 group-hover:bg-blue-50'
                            }`}>
                              {profileData.subjects.includes(subject) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`${
                              isDark ? 'text-white/80' : 'text-slate-700'
                            }`}>{subject}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {profileData.subjects.length > 0 && (
                      <div className={`rounded-xl p-4 border ${
                        isDark ? 'border-blue-400/30 bg-blue-500/20' : 'border-blue-200 bg-blue-50'
                      }`}>
                        <p className={`text-sm font-medium mb-2 ${
                          isDark ? 'text-blue-300' : 'text-blue-800'
                        }`}>Selected Subjects:</p>
                        <div className="flex flex-wrap gap-2">
                          {profileData.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full shadow-sm"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-xl p-4 border min-h-[60px] ${
                    isDark ? 'border-blue-400/30 bg-blue-500/20' : 'border-blue-100 bg-blue-50'
                  }`}>
                    {user.subjects && user.subjects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className={`text-sm ${
                        isDark ? 'text-white/60' : 'text-slate-500'
                      }`}>No subjects selected</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Tutor Settings */}
        {user?.isTutor && (
          <section className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-transparent/35' : 'border-white/70 bg-white'
          }`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-red-600 text-white shadow-lg">
                <Settings className="h-6 w-6" />
              </div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Tutor Settings</h2>
            </div>
            <div className={`rounded-xl p-6 border ${
              isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
            }`}>
              <ClearTutorStatus 
                user={user} 
                onSuccess={() => {
                  user.isTutor = false
                  localStorage.setItem('simpleUser', JSON.stringify(user))
                  window.location.reload()
                }}
              />
            </div>
          </section>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            try {
              setDeleting(true)
              const res = await deleteUserAccount(user?.id)
              if (res.success) {
                showSuccess('Account deleted successfully', 4000, 'Success')
                localStorage.removeItem('simpleUser')
                window.location.href = '/'
              } else {
                showError(res.error || 'Failed to delete account', 5000, 'Error')
              }
            } finally {
              setDeleting(false)
            }
          }}
          title="Delete Account"
          message="This action will permanently delete your account and all related sessions. This cannot be undone."
          confirmText={deleting ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          loading={deleting}
          userName={user?.name || 'User'}
        />
      )}

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isOpen={showPhoneVerification}
        onClose={() => setShowPhoneVerification(false)}
        phoneNumber={profileData.phone}
        onVerified={() => {
          setPhoneNeedsVerification(false)
          setOriginalPhone(profileData.phone)
          setShowPhoneVerification(false)
          showSuccess('Phone number verified! You can now save your profile.', 3000, 'Success')
        }}
      />

    </div>
  )
}

export default Profile
