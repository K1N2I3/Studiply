const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// Agora配置
const APP_ID = process.env.AGORA_APP_ID || 'YOUR_APP_ID';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || 'YOUR_APP_CERTIFICATE';

// 生成Token的API
app.post('/api/generate-token', (req, res) => {
  try {
    const { channelName, uid, role = 'publisher' } = req.body;
    
    // 验证必需参数
    if (!channelName || !uid) {
      return res.status(400).json({
        success: false,
        error: 'channelName and uid are required'
      });
    }
    
    // 设置过期时间（1小时）
    const expirationTimeInSeconds = 3600;
    
    // 设置用户角色
    const userRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    
    // 生成Token
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      parseInt(uid),
      userRole,
      expirationTimeInSeconds
    );
    
    res.json({
      success: true,
      token,
      appId: APP_ID,
      channelName,
      uid: parseInt(uid),
      expirationTime: expirationTimeInSeconds
    });
    
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate token'
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    appId: APP_ID ? 'configured' : 'not configured'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Token server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Token endpoint: http://localhost:${PORT}/api/generate-token`);
});

module.exports = app;
