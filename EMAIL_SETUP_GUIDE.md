# 📧 邮件验证码设置指南

这个指南将帮助你设置真实的邮件验证码功能。

## 🚀 快速开始 - 使用 EmailJS (推荐)

### 1. 注册 EmailJS 账户
1. 访问 [https://www.emailjs.com/](https://www.emailjs.com/)
2. 点击 "Sign Up" 注册免费账户
3. 验证你的邮箱

### 2. 创建邮件服务
1. 登录后进入 Dashboard
2. 点击 "Email Services" → "Add New Service"
3. 选择你的邮件提供商：
   - **Gmail** (推荐，简单易用)
   - **Outlook**
   - **Yahoo**
   - **自定义 SMTP**

### 3. 创建邮件模板
1. 点击 "Email Templates" → "Create New Template"
2. 使用以下模板：

```html
Subject: Studiply - 邮箱验证码

Hello,

您正在注册 Studiply 账户，请使用以下验证码完成注册：

验证码：{{verification_code}}

此验证码有效期为 10 分钟。

如果您没有请求此验证码，请忽略此邮件。

谢谢！
Studiply 团队
```

### 4. 获取配置信息
1. 复制以下信息：
   - **Service ID**
   - **Template ID** 
   - **Public Key**

### 5. 更新配置文件
编辑 `src/services/emailService.js`：

```javascript
const EMAILJS_SERVICE_ID = 'your_service_id_here'
const EMAILJS_TEMPLATE_ID = 'your_template_id_here' 
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'
```

### 6. 启用 EmailJS
在 `src/pages/Register.jsx` 中，将：
```javascript
import { sendVerificationEmailSimple } from '../services/emailService'
```
改为：
```javascript
import { sendVerificationEmail } from '../services/emailService'
```

然后在 `sendVerificationCode` 函数中，将：
```javascript
const result = await sendVerificationEmailSimple(email, code)
```
改为：
```javascript
const result = await sendVerificationEmail(email, code)
```

## 🔧 其他邮件服务选项

### 选项 2: SendGrid
1. 注册 [SendGrid](https://sendgrid.com/)
2. 获取 API Key
3. 创建邮件模板
4. 集成到后端 API

### 选项 3: Mailgun
1. 注册 [Mailgun](https://www.mailgun.com/)
2. 获取 API Key
3. 配置域名
4. 发送邮件

### 选项 4: AWS SES
1. 注册 AWS 账户
2. 启用 SES 服务
3. 验证邮件域名
4. 获取 API 凭证

## 🛠️ 后端集成 (Node.js + Nodemailer)

如果你想要更高级的控制，可以创建后端 API：

### 1. 安装依赖
```bash
npm install nodemailer express cors dotenv
```

### 2. 创建后端服务
```javascript
// server.js
const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())

// 创建邮件传输器
const transporter = nodemailer.createTransporter({
  service: 'gmail', // 或其他邮件服务
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// 发送验证码 API
app.post('/api/send-verification', async (req, res) => {
  const { email, code } = req.body
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Studiply - 邮箱验证码',
      html: `
        <h2>邮箱验证码</h2>
        <p>您的验证码是：<strong>${code}</strong></p>
        <p>此验证码有效期为 10 分钟。</p>
      `
    })
    
    res.json({ success: true, message: '验证码已发送' })
  } catch (error) {
    res.json({ success: false, message: '发送失败' })
  }
})

app.listen(3001, () => {
  console.log('Server running on port 3001')
})
```

### 3. 环境变量
创建 `.env` 文件：
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🔒 安全建议

1. **API 密钥保护**：不要将 API 密钥提交到代码仓库
2. **速率限制**：限制每个 IP 的发送频率
3. **验证码过期**：设置验证码过期时间（如 10 分钟）
4. **输入验证**：验证邮箱格式和长度
5. **错误处理**：不要暴露敏感信息

## 📱 测试

### 测试步骤：
1. 输入有效邮箱地址
2. 点击 "Verify" 按钮
3. 检查邮箱收件箱
4. 输入收到的验证码
5. 验证成功

### 常见问题：
- **邮件进入垃圾箱**：检查垃圾邮件文件夹
- **发送失败**：检查 API 配置和网络连接
- **验证码无效**：确认输入正确且未过期

## 🎯 生产环境部署

1. **使用 HTTPS**：确保网站使用 HTTPS
2. **环境变量**：使用环境变量存储敏感信息
3. **监控日志**：监控邮件发送状态
4. **备用方案**：准备多个邮件服务提供商

## 📞 支持

如果遇到问题：
1. 检查浏览器控制台错误
2. 验证邮件服务配置
3. 查看 EmailJS 文档
4. 联系邮件服务提供商

---

**注意**：这个指南提供了多种实现方式，选择最适合你项目需求的方法。EmailJS 是最简单的开始方式，适合快速原型和中小型项目。
