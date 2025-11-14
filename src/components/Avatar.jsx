import React from 'react'
import { isUserOnline } from '../services/presenceService'

const Avatar = ({ 
  user, 
  size = 'md', 
  showOnlineStatus = false, 
  className = '',
  onClick = null,
  ...props 
}) => {
  // 如果没有用户数据，显示默认头像
  if (!user) {
    return (
      <div 
        className={`bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold ${getSizeClasses(size)} ${className}`}
        {...props}
      >
        <span>U</span>
      </div>
    )
  }

  // 获取用户名首字母
  const getInitials = (name) => {
    if (!name) return 'U'
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  // 根据用户名生成一致的背景色
  const getBackgroundColor = (name) => {
    if (!name) return 'from-gray-400 to-gray-600'
    
    // 使用用户名生成一致的背景色
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600', 
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-cyan-500 to-cyan-600'
    ]
    
    // 使用用户名的字符码来选择一个颜色
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const colorIndex = Math.abs(hash) % colors.length
    return colors[colorIndex]
  }

  const sizeClasses = getSizeClasses(size)
  const initials = getInitials(user.name)
  const backgroundColor = getBackgroundColor(user.name)
  
  // 如果有头像图片，显示图片；否则显示首字母
  const hasAvatar = user.avatar && user.avatar.trim() !== ''

  return (
    <div className="relative">
      <div 
        className={`${sizeClasses} ${hasAvatar ? 'bg-gradient-to-r from-gray-400 to-gray-600' : `bg-gradient-to-r ${backgroundColor}`} rounded-full flex items-center justify-center text-white font-bold overflow-hidden cursor-pointer ${className}`}
        style={hasAvatar ? {
          backgroundImage: `url(${user.avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
        onClick={onClick}
        {...props}
      >
        {!hasAvatar && (
          <span className="select-none">{initials}</span>
        )}
      </div>
      
      {/* 在线状态指示器 */}
      {showOnlineStatus && (() => {
        // 优先使用计算出的在线状态（如果存在），否则实时计算
        const online = user._computedOnline !== undefined ? user._computedOnline : isUserOnline(user)
        return (
          <div className={`absolute -bottom-1 -right-1 ${getOnlineStatusSize(size)} rounded-full border-2 border-white shadow-lg ${
            online ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        )
      })()}
    </div>
  )
}

// 获取尺寸样式类
const getSizeClasses = (size) => {
  switch (size) {
    case 'xs':
      return 'w-6 h-6 text-xs'
    case 'sm':
      return 'w-8 h-8 text-sm'
    case 'md':
      return 'w-10 h-10 text-base'
    case 'lg':
      return 'w-12 h-12 text-lg'
    case 'xl':
      return 'w-16 h-16 text-xl'
    case '2xl':
      return 'w-20 h-20 text-2xl'
    case '3xl':
      return 'w-32 h-32 text-3xl'
    default:
      return 'w-10 h-10 text-base'
  }
}

// 获取在线状态指示器尺寸
const getOnlineStatusSize = (size) => {
  switch (size) {
    case 'xs':
      return 'w-2 h-2'
    case 'sm':
      return 'w-3 h-3'
    case 'md':
      return 'w-3 h-3'
    case 'lg':
      return 'w-4 h-4'
    case 'xl':
      return 'w-5 h-5'
    case '2xl':
      return 'w-6 h-6'
    case '3xl':
      return 'w-8 h-8'
    default:
      return 'w-3 h-3'
  }
}

export default Avatar
