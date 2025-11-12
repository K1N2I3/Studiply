# 📧 快速设置真实邮件验证码

## 🚀 方法一：使用后端邮件服务 (推荐)

### 1. 安装后端依赖
```bash
# 在项目根目录运行
npm install express nodemailer cors
```

### 2. 配置邮箱信息
编辑 `backend-email-service.js` 文件，替换以下信息：
```javascript
const emailConfig = {
  service: 'gmail', // 或 'outlook', 'yahoo'
  auth: {
    user: 'your_email@gmail.com', // 你的邮箱
    pass: 'your_app_password'     // 你的应用密码
  }
}
```

### 3. 获取 Gmail 应用密码
1. 打开 [Google 账户设置](https://myaccount.google.com/)
2. 点击 "安全性" → "两步验证"
3. 启用两步验证
4. 点击 "应用密码"
5. 生成新的应用密码
6. 复制密码到配置文件中

### 4. 启动后端服务
```bash
node backend-email-service.js
```

### 5. 更新前端代码
在 `src/pages/Register.jsx` 中，将：
```javascript
import { sendVerificationEmailSimple } from '../services/emailService'
```
改为：
```javascript
import { sendVerificationEmailBackend } from '../services/emailService'
```

然后在 `sendVerificationCode` 函数中，将：
```javascript
const result = await sendVerificationEmailSimple(email, code)
```
改为：
```javascript
const result = await sendVerificationEmailBackend(email, code)
```

## 🎯 方法二：使用 EmailJS (最简单)

### 1. 注册 EmailJS
访问 [https://www.emailjs.com/](https://www.emailjs.com/) 注册账户

### 2. 配置服务
1. 添加邮件服务 (Gmail/Outlook等)
2. 创建邮件模板
3. 获取 Service ID, Template ID, Public Key

### 3. 更新配置
编辑 `src/services/emailService.js`：
```javascript
const EMAILJS_SERVICE_ID = 'your_service_id'
const EMAILJS_TEMPLATE_ID = 'your_template_id'
const EMAILJS_PUBLIC_KEY = 'your_public_key'
```

### 4. 启用 EmailJS
在 `src/pages/Register.jsx` 中：
```javascript
import { sendVerificationEmail } from '../services/emailService'

// 在 sendVerificationCode 函数中使用：
const result = await sendVerificationEmail(email, code)
```

## 🔧 测试

### 测试步骤：
1. 启动前端：`npm run dev`
2. 启动后端：`node backend-email-service.js` (如果使用方法一)
3. 访问注册页面
4. 输入邮箱地址
5. 点击 "Verify" 按钮
6. 检查邮箱收件箱

### 预期结果：
- ✅ 验证码成功发送到邮箱
- ✅ 邮箱收到包含验证码的邮件
- ✅ 输入验证码后验证成功

## 🐛 常见问题

### 问题1：后端服务无法启动
**解决方案**：
- 检查端口 3001 是否被占用
- 确认已安装所有依赖：`npm install express nodemailer cors`

### 问题2：邮件发送失败
**解决方案**：
- 检查邮箱配置是否正确
- 确认应用密码正确
- 检查网络连接

### 问题3：邮件进入垃圾箱
**解决方案**：
- 检查垃圾邮件文件夹
- 将发送邮箱添加到联系人
- 使用专业的邮件服务提供商

## 📱 生产环境建议

1. **使用环境变量**：
```javascript
// 创建 .env 文件
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

2. **添加错误处理**：
- 网络错误重试机制
- 用户友好的错误提示
- 日志记录

3. **安全措施**：
- API 速率限制
- 验证码过期时间
- 输入验证

---

选择最适合你的方法：
- **后端服务**：更灵活，完全控制
- **EmailJS**：最简单，无需后端

两种方法都已经在代码中准备好，只需要按照步骤配置即可！
