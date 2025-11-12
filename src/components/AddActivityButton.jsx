import React, { useState } from 'react'
import { Plus, BookOpen, Trophy, Target, Users } from 'lucide-react'
import { logActivity, ACTIVITY_TYPES } from '../services/userActivity'
import { updateStudyTime, incrementTutoringSessions, incrementBadges } from '../services/userStats'

const AddActivityButton = ({ userId, onActivityAdded }) => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const addActivity = async (activityType, description, metadata = {}) => {
    setLoading(true)
    try {
      // 记录活动
      const activityResult = await logActivity(userId, activityType, description, metadata)
      
      if (activityResult.success) {
        // 更新相关统计数据
        switch (activityType) {
          case ACTIVITY_TYPES.STUDY_SESSION:
            // 这里可以添加学习时间更新逻辑
            break
          case ACTIVITY_TYPES.TUTORING_SESSION:
            await incrementTutoringSessions(userId)
            break
          case ACTIVITY_TYPES.BADGE_EARNED:
            await incrementBadges(userId)
            break
        }
        
        // 通知父组件刷新数据
        if (onActivityAdded) {
          onActivityAdded()
        }
        
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error adding activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActivities = [
    {
      type: ACTIVITY_TYPES.STUDY_SESSION,
      description: 'Completed Math study session for 30 minutes',
      metadata: { subject: 'Math', duration: 30 },
      icon: BookOpen,
      color: 'blue'
    },
    {
      type: ACTIVITY_TYPES.TUTORING_SESSION,
      description: 'Completed tutoring session in Physics',
      metadata: { subject: 'Physics' },
      icon: BookOpen,
      color: 'green'
    },
    {
      type: ACTIVITY_TYPES.BADGE_EARNED,
      description: 'Earned "Focused Learner" badge',
      metadata: { badgeName: 'Focused Learner' },
      icon: Trophy,
      color: 'yellow'
    },
    {
      type: ACTIVITY_TYPES.FOCUS_MODE,
      description: 'Used Focus Mode for 45 minutes',
      metadata: { duration: 45 },
      icon: Target,
      color: 'purple'
    }
  ]

  if (!userId) return null

  return (
    <>
      {/* 现代化的浮动按钮 */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 group hover:scale-110 transform"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-lg w-full border border-white/20 overflow-hidden">
            {/* 头部 */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Add Activity</h3>
              <p className="text-white/90">Choose a quick activity to add to your profile</p>
            </div>
            
            {/* 内容 */}
            <div className="p-6">
              <div className="space-y-4">
                {quickActivities.map((activity, index) => {
                  const IconComponent = activity.icon
                  const colorClasses = {
                    blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300',
                    green: 'border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300',
                    yellow: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300',
                    purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300'
                  }
                  const iconColorClasses = {
                    blue: 'text-blue-600',
                    green: 'text-green-600',
                    yellow: 'text-yellow-600',
                    purple: 'text-purple-600'
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => addActivity(activity.type, activity.description, activity.metadata)}
                      disabled={loading}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-4 group ${
                        colorClasses[activity.color]
                      } ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] transform'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className={`w-5 h-5 ${iconColorClasses[activity.color]}`} />
                      </div>
                      <span className="text-gray-900 font-medium text-left flex-1">{activity.description}</span>
                    </button>
                  )
                })}
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddActivityButton
