# 🔧 EmailJS 模板配置修复指南

## 🚨 错误分析
错误信息：`The recipients address is empty`

这个错误表示 EmailJS 模板中没有正确配置收件人地址。

## 🔧 修复步骤

### 1. 检查 EmailJS 模板配置

登录 [EmailJS Dashboard](https://dashboard.emailjs.com/) 并检查你的模板：

#### 模板设置检查：
1. **收件人地址** - 确保模板中有 `{{to_email}}` 变量
2. **发件人地址** - 确保模板中有发件人邮箱配置
3. **模板变量** - 确保所有变量名正确

#### 正确的模板配置：

**收件人设置：**
```
To: {{to_email}}
```

**邮件内容：**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0;">Studiply</h1>
  </div>
  <div style="padding: 30px; background: white;">
    <h2>邮箱验证码</h2>
    <p>您好 {{to_name}}！</p>
    <p>您的验证码是：</p>
    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px;">
      <h1 style="color: #667eea; font-size: 32px; margin: 0;">{{verification_code}}</h1>
    </div>
    <p>此验证码有效期为 10 分钟。</p>
  </div>
</div>
```

### 2. 模板变量映射

确保模板中使用的变量名与代码中的参数名匹配：

| 代码参数 | 模板变量 | 说明 |
|---------|---------|------|
| `to_email` | `{{to_email}}` | 收件人邮箱 |
| `to_name` | `{{to_name}}` | 收件人姓名 |
| `verification_code` | `{{verification_code}}` | 验证码 |
| `app_name` | `{{app_name}}` | 应用名称 |
| `from_name` | `{{from_name}}` | 发件人姓名 |

### 3. 常见配置错误

#### ❌ 错误配置：
```
To: user@example.com  // 硬编码邮箱
To: {{email}}         // 变量名不匹配
```

#### ✅ 正确配置：
```
To: {{to_email}}      // 使用正确的变量名
```

### 4. 重新创建模板

如果问题持续，建议重新创建模板：

1. **删除旧模板**
2. **创建新模板**
3. **使用上面的正确配置**
4. **保存并获取新的 Template ID**

### 5. 测试配置

更新代码中的 Template ID（如果重新创建了模板）：

```javascript
const EMAILJS_TEMPLATE_ID = 'template_新ID' // 替换为新的模板ID
```

## 🧪 测试步骤

1. **更新模板配置**
2. **保存模板**
3. **重新测试注册功能**
4. **检查浏览器控制台**
5. **确认邮件发送成功**

## 🚀 备用方案

如果 EmailJS 仍有问题，系统会自动使用演示模式：
- 验证码会在控制台显示
- 可以直接完成注册测试
- 不影响功能验证

## 📞 获取帮助

- EmailJS 官方文档：https://www.emailjs.com/docs/
- 模板配置指南：https://www.emailjs.com/docs/user-guide/creating-email-templates/
- 常见问题：https://www.emailjs.com/docs/user-guide/troubleshooting/

---

**修复完成后，重新测试注册功能即可！** 🎉
