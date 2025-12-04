/**
 * Streak 样式工具函数
 * 根据 streak 天数返回对应的样式配置
 * 每 25 天一个等级
 */

/**
 * 获取 Streak 样式配置
 * @param {number} dayCount - Streak 天数
 * @returns {object} 样式配置对象
 */
export const getStreakStyle = (dayCount) => {
  const level = Math.floor(dayCount / 25) + 1
  
  // 限制最大等级为 5
  const finalLevel = Math.min(level, 5)
  
  const styles = {
    1: {
      level: 1,
      name: 'Beginner',
      colors: {
        gradient: 'from-blue-500 to-cyan-500',
        border: 'border-blue-400/50',
        text: 'text-blue-100',
        bg: 'bg-blue-500/20'
      },
      icon: '🔥',
      animation: ''
    },
    2: {
      level: 2,
      name: 'Dedicated',
      colors: {
        gradient: 'from-green-500 to-emerald-500',
        border: 'border-green-400/60',
        text: 'text-green-100',
        bg: 'bg-green-500/20'
      },
      icon: '⭐',
      animation: ''
    },
    3: {
      level: 3,
      name: 'Committed',
      colors: {
        gradient: 'from-purple-500 to-pink-500',
        border: 'border-purple-400/70',
        text: 'text-purple-100',
        bg: 'bg-purple-500/20'
      },
      icon: '✨',
      animation: 'animate-pulse'
    },
    4: {
      level: 4,
      name: 'Elite',
      colors: {
        gradient: 'from-yellow-400 via-orange-500 to-amber-500',
        border: 'border-yellow-400/80',
        text: 'text-yellow-100',
        bg: 'bg-yellow-500/20'
      },
      icon: '👑',
      animation: 'animate-pulse'
    },
    5: {
      level: 5,
      name: 'Legendary',
      colors: {
        gradient: 'from-pink-500 via-purple-500 via-blue-500 to-cyan-500',
        border: 'border-pink-400/90',
        text: 'text-white',
        bg: 'bg-gradient-to-r from-pink-500/30 via-purple-500/30 via-blue-500/30 to-cyan-500/30'
      },
      icon: '🌟',
      animation: 'animate-pulse'
    }
  }
  
  return styles[finalLevel] || styles[1]
}

/**
 * 获取下一个等级所需的天数
 * @param {number} dayCount - 当前 Streak 天数
 * @returns {number} 距离下一个等级所需的天数，如果已经是最高等级则返回 null
 */
export const getDaysToNextLevel = (dayCount) => {
  const currentLevel = Math.floor(dayCount / 25) + 1
  if (currentLevel >= 5) {
    return null // 已经是最高等级
  }
  const nextLevelDays = currentLevel * 25
  return nextLevelDays - dayCount
}

