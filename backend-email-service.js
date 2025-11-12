// 简单的后端邮件服务示例
// 运行命令: node backend-email-service.js

import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express()
const PORT = 3003

// 中间件
app.use(express.json())
app.use(cors())

// 邮件配置 - 请替换为你的邮箱信息
const emailConfig = {
  service: 'gmail', // 或 'outlook', 'yahoo' 等
  auth: {
    user: 'hudefei1979@gmail.com', // 替换为你的邮箱
    pass: 'your_app_password_here'     // 替换为你的应用密码
  }
}

// 创建邮件传输器
const transporter = nodemailer.createTransport(emailConfig)

// 验证邮件配置
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ 邮件配置错误:', error)
  } else {
    console.log('✅ 邮件服务已就绪')
  }
})

// 发送验证码 API
app.post('/api/send-verification', async (req, res) => {
  const { email, code } = req.body
  
  if (!email || !code) {
    return res.status(400).json({ 
      success: false, 
      message: '邮箱和验证码不能为空' 
    })
  }

  try {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: email,
      subject: 'Studiply - 邮箱验证码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Studiply</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">邮箱验证码</h2>
            <p style="color: #666; font-size: 16px;">您正在注册 Studiply 账户，请使用以下验证码完成注册：</p>
            
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 2px solid #667eea;">
              <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              ⏰ 此验证码有效期为 10 分钟<br>
              🔒 请勿将验证码告诉他人<br>
              ❓ 如果您没有请求此验证码，请忽略此邮件
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              © 2024 Studiply. All rights reserved.
            </p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    
    console.log(`✅ 验证码已发送到: ${email}`)
    console.log(`🔐 验证码: ${code}`)
    
    res.json({ 
      success: true, 
      message: '验证码已发送到您的邮箱' 
    })
    
  } catch (error) {
    console.error('❌ 发送邮件失败:', error)
    res.status(500).json({ 
      success: false, 
      message: '发送验证码失败，请稍后重试' 
    })
  }
})

// 健康检查 API
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '邮件服务运行正常',
    timestamp: new Date().toISOString()
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 邮件服务已启动: http://localhost:${PORT}`)
  console.log(`📧 发送验证码 API: http://localhost:${PORT}/api/send-verification`)
  console.log(`🏥 健康检查 API: http://localhost:${PORT}/api/health`)
})

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 邮件服务已关闭')
  process.exit(0)
})
