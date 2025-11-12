# 🔧 EmailJS 模板修复指南 - 解决 422 错误

## 🚨 问题分析
**错误**: `422 - The recipients address is empty`
**原因**: EmailJS 模板中收件人地址配置不正确

## 📧 你的 EmailJS 配置信息
- **Service ID**: `service_wx8tfa8`
- **Template ID**: `template_8ncg4ek`
- **Public Key**: `q3eK04PCYjcxxpUzh`

## 🔧 修复步骤

### 步骤 1: 登录 EmailJS Dashboard
1. 访问: https://dashboard.emailjs.com/
2. 使用你的 EmailJS 账户登录

### 步骤 2: 检查邮件服务
1. 点击左侧菜单 "Email Services"
2. 找到 `service_wx8tfa8`
3. 确认状态为 "Connected"
4. 如果没有连接，重新连接你的 Gmail/Outlook

### 步骤 3: 修复邮件模板
1. 点击左侧菜单 "Email Templates"
2. 找到模板 `template_8ncg4ek`
3. 点击 "Edit" 编辑模板

### 步骤 4: 关键配置修复

#### ✅ 正确的模板设置:

**模板名称**: Studiply Verification

**主题 (Subject)**:
```
Studiply - Email Verification Code
```

**收件人 (To) - 这是关键！**:
```
{{to_email}}
```

**邮件内容 (HTML)**:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Studiply</h1>
    <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Learning Platform</p>
  </div>
  
  <div style="padding: 40px 30px; background: white;">
    <h2 style="color: #333; margin-bottom: 20px;">Email Verification Code</h2>
    <p style="color: #666; font-size: 16px; line-height: 1.6;">
      Hello {{to_name}}!<br>
      You are registering for Studiply. Please use the following verification code to complete your registration:
    </p>
    
    <div style="background: #f8f9fa; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center; border: 2px solid #667eea;">
      <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: monospace;">{{verification_code}}</h1>
    </div>
    
    <div style="background: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="color: #1976d2; margin: 0; font-size: 14px;">
        <strong>⚠️ Important:</strong><br>
        • This code is valid for 10 minutes<br>
        • Do not share this code with anyone<br>
        • If you didn't request this, please ignore this email
      </p>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Thank you for choosing Studiply!<br>
      If you have any questions, please contact our support team.
    </p>
  </div>
  
  <div style="background: #333; padding: 20px; text-align: center;">
    <p style="color: #999; margin: 0; font-size: 12px;">
      © 2024 Studiply. All rights reserved.
    </p>
  </div>
</div>
```

### 步骤 5: 模板变量检查

确保以下变量正确配置：
- `{{to_email}}` - 收件人邮箱地址
- `{{to_name}}` - 收件人姓名
- `{{verification_code}}` - 验证码
- `{{app_name}}` - 应用名称
- `{{from_name}}` - 发件人姓名

### 步骤 6: 保存并测试
1. 点击 "Save" 保存模板
2. 返回 Studiply 应用测试
3. 输入邮箱地址，点击 "Verify"
4. 检查邮箱收件箱

## 🚨 常见错误和解决方案

### 错误 1: "To" 字段为空
**问题**: 模板中没有设置收件人
**解决**: 确保 "To" 字段设置为 `{{to_email}}`

### 错误 2: 变量名不匹配
**问题**: 代码中的变量名与模板不匹配
**解决**: 确保变量名完全一致

### 错误 3: 模板没有保存
**问题**: 修改后忘记保存
**解决**: 点击 "Save" 按钮保存模板

## 🔄 替代方案：创建新模板

如果现有模板无法修复：

1. **删除旧模板**: 删除 `template_8ncg4ek`
2. **创建新模板**:
   - 点击 "Create New Template"
   - 使用上面的配置
   - 保存并获取新的 Template ID
3. **更新代码**: 替换 `template_8ncg4ek` 为新 ID

## 🧪 测试步骤

### 1. 模板修复后测试
1. 访问: http://localhost:3002/
2. 进入注册页面
3. 输入邮箱地址
4. 点击 "Verify" 按钮
5. 查看控制台是否有成功消息

### 2. 邮箱收件检查
1. 检查收件箱
2. 检查垃圾邮件文件夹
3. 查找 "Studiply - Email Verification Code"
4. 记录收到的验证码

### 3. 验证码测试
1. 输入收到的验证码
2. 确认验证成功
3. 完成注册流程

## ✅ 成功指标

修复成功后，你会看到：
- ✅ 控制台显示: "Email sent successfully"
- ✅ 弹窗提示: "Verification code sent to [email]!"
- ✅ 收到真实的验证码邮件
- ✅ 验证码可以正常使用

## 🆘 如果仍有问题

如果修复后仍有问题：
1. 检查 EmailJS Dashboard 中的模板配置
2. 确认邮件服务已正确连接
3. 尝试创建全新的模板
4. 检查浏览器控制台的详细错误信息

---

**修复模板配置后，EmailJS 将正常工作，适合生产环境使用！** 🎉
