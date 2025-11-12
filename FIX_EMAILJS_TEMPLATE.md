# 🔧 EmailJS 模板修复指南

## 🚨 当前问题
- **错误**: 422 Unprocessable Content
- **原因**: EmailJS 模板配置中收件人地址为空
- **状态**: 已切换到演示模式，功能正常

## 🔧 修复 EmailJS 模板的步骤

### 1. 登录 EmailJS Dashboard
访问: https://dashboard.emailjs.com/

### 2. 检查邮件服务
1. 点击 "Email Services"
2. 确认 `service_wx8tfa8` 状态为 "Connected"
3. 如果没有连接，重新连接 Gmail/Outlook

### 3. 修复邮件模板
1. 点击 "Email Templates"
2. 找到模板 `template_8ncg4ek`
3. 点击 "Edit" 编辑模板

### 4. 正确的模板配置

#### 模板设置：
```
Subject: Studiply - 邮箱验证码
```

#### 收件人设置：
```
To: {{to_email}}
```

#### 邮件内容：
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">Studiply</h1>
    <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">学习平台</p>
  </div>
  
  <div style="padding: 40px 30px; background: white;">
    <h2 style="color: #333; margin-bottom: 20px;">邮箱验证码</h2>
    <p style="color: #666; font-size: 16px; line-height: 1.6;">
      您好 {{to_name}}！<br>
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

### 5. 关键配置检查

#### ✅ 必须包含的变量：
- `{{to_email}}` - 收件人邮箱
- `{{to_name}}` - 收件人姓名
- `{{verification_code}}` - 验证码

#### ❌ 常见错误：
- 忘记设置 `To: {{to_email}}`
- 变量名拼写错误
- 模板没有保存

### 6. 保存并测试
1. 点击 "Save" 保存模板
2. 返回应用测试注册功能
3. 检查是否收到真实邮件

### 7. 如果仍有问题
1. **重新创建模板** - 删除旧模板，创建新模板
2. **检查服务连接** - 确认邮件服务已正确连接
3. **验证 API Key** - 检查 Public Key 是否正确

## 🎯 当前状态
- ✅ **功能正常** - 演示模式可以完成注册
- ✅ **验证码显示** - 在控制台和弹窗中显示
- ✅ **用户体验** - 界面和流程完全正常
- 🔧 **待修复** - EmailJS 真实邮件发送

## 🚀 测试方法
1. 访问 http://localhost:3002/
2. 进入注册页面
3. 输入邮箱地址
4. 点击 "Verify" 按钮
5. 查看弹窗中的验证码
6. 输入验证码完成注册

---

**修复完成后，重新启用 EmailJS 即可发送真实邮件！** 🎉
