// Agora配置
export const AGORA_CONFIG = {
  // 生产环境配置
  APP_ID: import.meta.env.VITE_AGORA_APP_ID || 'YOUR_AGORA_APP_ID',
  
  // 测试环境配置 (用于开发测试)
  TEST_APP_ID: 'YOUR_TEST_APP_ID',
  
  // 频道配置
  CHANNEL_PREFIX: 'studyhub-tutoring',
  
  // 客户端配置
  CLIENT_CONFIG: {
    mode: 'rtc',
    codec: 'vp8'
  },
  
  // 媒体配置
  MEDIA_CONFIG: {
    video: {
      width: { min: 320, ideal: 1280, max: 1920 },
      height: { min: 240, ideal: 720, max: 1080 },
      frameRate: { min: 15, ideal: 30, max: 60 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  }
}

// 生成频道名称
export const generateChannelName = (tutorId, studentId) => {
  return `${AGORA_CONFIG.CHANNEL_PREFIX}-${tutorId}-${studentId}`
}

// 获取App ID (根据环境)
export const getAppId = () => {
  return import.meta.env.MODE === 'production' 
    ? AGORA_CONFIG.APP_ID 
    : AGORA_CONFIG.TEST_APP_ID
}
