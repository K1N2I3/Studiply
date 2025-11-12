// 验证码显示测试脚本
// 运行命令: node test-verification-code.js

console.log(`
🔍 验证码显示问题诊断
========================

问题: 邮件发送成功，但验证码没有显示在邮件内容中

🔧 问题分析:
1. EmailJS 模板配置正确
2. 邮件发送成功
3. 但是验证码变量 {{verification_code}} 没有正确替换

📧 你的 EmailJS 配置:
- Service ID: service_wx8tfa8
- Template ID: template_8ncg4ek
- Public Key: q3eK04PCYjcxxpUzh

🚨 可能的原因:
1. 模板中的变量名不正确
2. 变量名拼写错误
3. 模板没有正确保存
4. 变量格式问题

🔧 立即修复步骤:

1. 📧 登录 EmailJS Dashboard:
   https://dashboard.emailjs.com/

2. 📝 编辑模板 template_8ncg4ek:
   - 点击 "Email Templates"
   - 找到 template_8ncg4ek
   - 点击 "Edit"

3. ✅ 检查验证码变量:
   
   当前可能的问题:
   ❌ {{verificationcode}} (缺少下划线)
   ❌ {{verification_code}} (变量名错误)
   ❌ {{code}} (变量名不匹配)
   
   正确配置:
   ✅ {{verification_code}}
   ✅ {{code}} (备用)
   ✅ {{otp}} (备用)

4. 📋 完整的邮件内容模板:

<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Studiply</h1>
  </div>
  
  <div style="padding: 40px 30px; background: white;">
    <h2 style="color: #333; margin-bottom: 20px;">Email Verification Code</h2>
    <p style="color: #666; font-size: 16px; line-height: 1.6;">
      Hello {{to_name}}!<br>
      Your verification code is:
    </p>
    
    <div style="background: #f8f9fa; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center; border: 2px solid #667eea;">
      <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: monospace;">{{verification_code}}</h1>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      This code is valid for 10 minutes.
    </p>
  </div>
</div>

5. 💾 保存模板并测试

🧪 测试步骤:

1. 修复模板配置
2. 保存模板
3. 访问 http://localhost:3002/
4. 注册页面输入邮箱
5. 点击 "Verify" 按钮
6. 检查邮箱收件箱
7. 确认验证码正确显示

🚨 常见错误检查:

□ 变量名是否正确：{{verification_code}}
□ 模板是否已保存
□ 邮件内容是否为 HTML 格式
□ 变量名拼写是否正确
□ 是否使用了正确的 Template ID

✅ 修复成功指标:

- 邮件中正确显示 6 位数字验证码
- 验证码格式清晰可见
- 验证码可以正常使用
- 完成注册流程

🔍 如果仍有问题:

1. 尝试使用备用变量：{{code}} 或 {{otp}}
2. 检查模板是否使用了正确的格式
3. 重新创建模板
4. 检查 EmailJS Dashboard 中的配置

修复完成后，验证码将正确显示在邮件中！
`);

console.log('\n🎯 快速修复检查清单:');
console.log('□ 登录 EmailJS Dashboard');
console.log('□ 编辑模板 template_8ncg4ek');
console.log('□ 检查变量名：{{verification_code}}');
console.log('□ 复制上面的 HTML 模板');
console.log('□ 保存模板');
console.log('□ 测试邮件发送');

console.log('\n🚀 修复完成后，验证码将正确显示在邮件中！');
