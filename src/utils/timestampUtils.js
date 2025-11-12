// 安全的timestamp处理工具函数

/**
 * 安全地将Firestore timestamp转换为Date对象
 * @param {any} timestamp - Firestore timestamp对象或Date对象
 * @returns {Date} JavaScript Date对象
 */
export const safeToDate = (timestamp) => {
  if (!timestamp) return new Date()
  
  try {
    // 如果已经是Date对象
    if (timestamp instanceof Date) {
      return timestamp
    }
    
    // 检查是否是Firestore Timestamp对象
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate()
    }
    
    // 检查是否是Firestore ServerTimestamp格式 { seconds, nanoseconds }
    if (timestamp.seconds && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000)
    }
    
    // 检查是否是毫秒时间戳
    if (typeof timestamp === 'number') {
      return new Date(timestamp)
    }
    
    // 检查是否是字符串时间戳
    if (typeof timestamp === 'string') {
      const parsed = new Date(timestamp)
      if (!isNaN(parsed.getTime())) {
        return parsed
      }
    }
    
    // 尝试直接创建Date对象
    const date = new Date(timestamp)
    if (!isNaN(date.getTime())) {
      return date
    }
    
    // 如果所有方法都失败，返回当前时间
    return new Date()
  } catch (error) {
    console.error('Error converting timestamp to date:', error, 'Original timestamp:', timestamp)
    return new Date()
  }
}

/**
 * 安全地获取timestamp的毫秒数
 * @param {any} timestamp - Firestore timestamp对象或Date对象
 * @returns {number} 毫秒时间戳
 */
export const safeToMillis = (timestamp) => {
  if (!timestamp) return 0
  
  try {
    // 如果已经是Date对象
    if (timestamp instanceof Date) {
      return timestamp.getTime()
    }
    
    // 检查是否是Firestore Timestamp对象
    if (timestamp.toMillis && typeof timestamp.toMillis === 'function') {
      return timestamp.toMillis()
    }
    
    // 检查是否是Firestore ServerTimestamp格式
    if (timestamp.seconds && typeof timestamp.seconds === 'number') {
      return timestamp.seconds * 1000
    }
    
    // 检查是否是毫秒时间戳
    if (typeof timestamp === 'number') {
      return timestamp
    }
    
    // 尝试转换为Date然后获取毫秒数
    const date = safeToDate(timestamp)
    return date.getTime()
  } catch (error) {
    console.error('Error converting timestamp to millis:', error, 'Original timestamp:', timestamp)
    return 0
  }
}

/**
 * 格式化timestamp为本地日期字符串
 * @param {any} timestamp - Firestore timestamp对象或Date对象
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化的日期字符串
 */
export const formatTimestamp = (timestamp, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  try {
    const date = safeToDate(timestamp)
    if (!date || isNaN(date.getTime())) {
      return 'Unknown'
    }
    return date.toLocaleDateString('en-US', defaultOptions)
  } catch (error) {
    console.error('Error formatting timestamp:', error, 'Original timestamp:', timestamp)
    return 'Unknown'
  }
}

/**
 * 格式化timestamp为本地日期时间字符串
 * @param {any} timestamp - Firestore timestamp对象或Date对象
 * @returns {string} 格式化的日期时间字符串
 */
export const formatTimestampFull = (timestamp) => {
  try {
    const date = safeToDate(timestamp)
    if (!date || isNaN(date.getTime())) {
      return 'Unknown'
    }
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  } catch (error) {
    console.error('Error formatting timestamp full:', error, 'Original timestamp:', timestamp)
    return 'Unknown'
  }
}