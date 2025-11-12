# 📧 EmailJS 设置指南

## 🚀 步骤 1: 注册 EmailJS 账户

1. 访问 [https://www.emailjs.com/](https://www.emailjs.com/)
2. 点击右上角的 "Sign Up" 按钮
3. 使用你的邮箱注册账户
4. 验证邮箱地址

## 🔧 步骤 2: 连接邮件服务

### 2.1 添加邮件服务
1. 登录后进入 Dashboard
2. 点击左侧菜单的 "Email Services"
3. 点击 "Add New Service" 按钮
4. 选择你的邮件提供商：

#### Gmail (推荐)
- 选择 "Gmail"
- 输入你的 Gmail 地址
- 按照提示授权 EmailJS 访问你的 Gmail

#### Outlook
- 选择 "Outlook"
- 输入你的 Outlook 地址
- 完成授权流程

#### Yahoo
- 选择 "Yahoo"
- 输入你的 Yahoo 邮箱
- 完成授权

### 2.2 获取 Service ID
- 服务创建成功后，你会看到一个 Service ID
- 格式类似：`service_abc123`
- 复制这个 ID，稍后需要用到

## 📝 步骤 3: 创建邮件模板

### 3.1 创建新模板
1. 点击左侧菜单的 "Email Templates"
2. 点击 "Create New Template" 按钮
3. 使用以下模板内容：

### 3.2 邮件模板内容

**模板名称**: Studiply 验证码

**主题**: Studiply - 邮箱验证码

**内容**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Studiply</h1>
    <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">学习平台</p>
  </div>
  
  <div style="padding: 40px 30px; background: white;">
    <h2 style="color: #333; margin-bottom: 20px;">邮箱验证码</h2>
    <p style="color: #666; font-size: 16px; line-height: 1.6;">
      您好！<br>
      您正在注册 Studiply 账户，请使用以下验证码完成注册：
    </p>
    
    <div style="background: #f8f9fa; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center; border: 2px solid #667eea;">
      <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: monospace;">{{verification_code}}</h1>
    </div>
    
    <div style="background: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="color: #1976d2; margin: 0; font-size: 14px;">
        <strong>⚠️ 重要提示：</strong><br>
        • 此验证码有效期为 10 分钟<br>
        • 请勿将验证码告诉他人<br>
        • 如果您没有请求此验证码，请忽略此邮件
      </p>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      感谢您选择 Studiply！<br>
      如有疑问，请联系我们的客服团队。
    </p>
  </div>
  
  <div style="background: #333; padding: 20px; text-align: center;">
    <p style="color: #999; margin: 0; font-size: 12px;">
      © 2024 Studiply. All rights reserved.
    </p>
  </div>
</div>
```

### 3.3 模板变量设置
在模板中使用以下变量：
- `{{verification_code}}` - 6位验证码
- `{{to_email}}` - 收件人邮箱
- `{{app_name}}` - 应用名称

### 3.4 获取 Template ID
- 模板创建成功后，你会看到一个 Template ID
- 格式类似：`template_xyz789`
- 复制这个 ID，稍后需要用到

## 🔑 步骤 4: 获取 Public Key

1. 点击左侧菜单的 "Account"
2. 在 "API Keys" 部分找到你的 Public Key
3. 格式类似：`user_abcdef123456`
4. 复制这个 Key，稍后需要用到

## ⚙️ 步骤 5: 更新配置文件

编辑 `src/services/emailService.js` 文件，替换以下配置：

```javascript
const EMAILJS_SERVICE_ID = 'service_abc123' // 替换为你的 Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789' // 替换为你的 Template ID
const EMAILJS_PUBLIC_KEY = 'user_abcdef123456' // 替换为你的 Public Key
```

## 🔄 步骤 6: 启用 EmailJS

在 `src/pages/Register.jsx` 中，确保使用正确的导入：

```javascript
import { sendVerificationEmail } from '../services/emailService'

// 在 sendVerificationCode 函数中使用：
const result = await sendVerificationEmail(email, code)
```

## 🧪 步骤 7: 测试

1. 启动前端应用：`npm run dev`
2. 访问注册页面
3. 输入有效的邮箱地址
4. 点击 "Verify" 按钮
5. 检查邮箱收件箱
6. 输入收到的验证码

## 📊 免费额度

EmailJS 免费账户包含：
- **200 封邮件/月**
- **2 个邮件服务**
- **2 个邮件模板**
- **1000 次 API 调用/月**

## 🐛 常见问题

### 问题 1: 邮件发送失败
**解决方案**：
- 检查 Service ID, Template ID, Public Key 是否正确
- 确认邮件服务已正确连接
- 检查邮箱地址格式是否正确

### 问题 2: 邮件进入垃圾箱
**解决方案**：
- 检查垃圾邮件文件夹
- 将发送邮箱添加到联系人
- 使用专业的邮件服务

### 问题 3: 模板变量不显示
**解决方案**：
- 确认模板中使用正确的变量名：`{{verification_code}}`
- 检查变量名拼写是否正确
- 确认在发送时传递了正确的参数

## 📞 获取帮助

如果遇到问题：
1. 查看 EmailJS 官方文档
2. 检查浏览器控制台错误信息
3. 确认所有配置信息正确
4. 联系 EmailJS 客服支持

---

**配置完成后，你就可以发送真实的邮件验证码了！** 🎉
