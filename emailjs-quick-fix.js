// EmailJS 快速修复脚本
// 这个脚本会生成正确的模板配置

console.log(`
🚀 EmailJS 快速修复工具
========================

你的配置信息:
- Service ID: service_wx8tfa8
- Template ID: template_8ncg4ek
- Public Key: q3eK04PCYjcxxpUzh

🔧 422 错误修复方案:

问题: "The recipients address is empty"
原因: EmailJS 模板中收件人地址配置不正确

📧 立即修复步骤:

1. 登录 EmailJS Dashboard:
   https://dashboard.emailjs.com/

2. 进入模板编辑:
   - 点击 "Email Templates"
   - 找到 template_8ncg4ek
   - 点击 "Edit"

3. 复制以下配置到模板:

═══════════════════════════════════════════════════════════════

模板名称: Studiply Verification

主题 (Subject):
Studiply - Email Verification Code

收件人 (To) - 关键设置:
{{to_email}}

发件人 (From):
{{from_name}} <{{from_email}}>

邮件内容 (HTML):
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

═══════════════════════════════════════════════════════════════

4. 保存模板 (点击 "Save" 按钮)

5. 测试邮件发送:
   - 访问 http://localhost:3002/
   - 注册页面输入邮箱
   - 点击 "Verify" 按钮

🚨 常见错误检查:

❌ 错误配置:
- To: (空)
- To: user@example.com (硬编码)
- To: {{email}} (变量名错误)

✅ 正确配置:
- To: {{to_email}}

📋 模板变量说明:

{{to_email}}     - 收件人邮箱地址
{{to_name}}      - 收件人姓名
{{verification_code}} - 验证码
{{app_name}}     - 应用名称
{{from_name}}    - 发件人姓名

🔍 如果仍有问题:

1. 检查邮件服务连接状态
2. 确认模板已正确保存
3. 尝试创建新模板
4. 检查浏览器控制台错误

✅ 修复成功指标:

- 控制台显示 "Email sent successfully"
- 收到真实的验证码邮件
- 验证码可以正常使用

修复完成后，EmailJS 将完美适合生产环境使用！
`);

console.log('\n🎯 快速修复检查清单:');
console.log('□ 登录 EmailJS Dashboard');
console.log('□ 编辑模板 template_8ncg4ek');
console.log('□ 设置 To: {{to_email}');
console.log('□ 复制上面的 HTML 内容');
console.log('□ 保存模板');
console.log('□ 测试邮件发送');

console.log('\n🚀 修复完成后，你的邮件验证码系统就可以正常工作了！');
