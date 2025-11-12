// EmailJS Configuration Test Script
// Run with: node test-emailjs-config.js

console.log(`
🧪 EmailJS 配置测试工具
========================

你的 EmailJS 配置信息:
- Service ID: service_wx8tfa8
- Template ID: template_8ncg4ek  
- Public Key: q3eK04PCYjcxxpUzh

🔍 422 错误 "recipients address is empty" 分析:

这个错误表示 EmailJS 模板配置中缺少收件人地址。

🔧 必须修复的模板设置:

1. 📧 登录 EmailJS Dashboard:
   https://dashboard.emailjs.com/

2. 📝 编辑模板 template_8ncg4ek:
   - 点击 "Email Templates"
   - 找到 template_8ncg4ek
   - 点击 "Edit"

3. ✅ 关键配置 - "To" 字段:
   
   当前可能的问题:
   ❌ To: (空)
   ❌ To: user@example.com (硬编码)
   ❌ To: {{email}} (变量名错误)
   
   正确配置:
   ✅ To: {{to_email}}

4. 📋 完整的模板配置:

   主题: Studiply - Email Verification Code
    
   收件人: {{to_email}}
   
   邮件内容:
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
     <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
       <h1 style="color: white; margin: 0;">Studiply</h1>
     </div>
     <div style="padding: 30px; background: white;">
       <h2>Email Verification Code</h2>
       <p>Hello {{to_name}}!</p>
       <p>Your verification code is:</p>
       <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px;">
         <h1 style="color: #667eea; font-size: 32px; margin: 0;">{{verification_code}}</h1>
       </div>
       <p>This code is valid for 10 minutes.</p>
     </div>
   </div>

5. 💾 保存模板并测试

🚨 常见错误检查清单:

□ To 字段是否设置为 {{to_email}}？
□ 模板是否已保存？
□ 邮件服务是否已连接？
□ 变量名是否完全匹配？
□ 是否使用了正确的 Template ID？

✅ 修复后的测试流程:

1. 修复模板配置
2. 保存模板
3. 访问 http://localhost:3002/
4. 注册页面输入邮箱
5. 点击 "Verify" 按钮
6. 检查邮箱收件箱
7. 输入验证码完成注册

🎯 成功指标:

- 控制台显示 "Email sent successfully"
- 收到真实的验证码邮件
- 验证码可以正常使用

如果修复后仍有问题，请检查:
- EmailJS Dashboard 中的模板配置
- 邮件服务连接状态
- 浏览器控制台的详细错误信息

修复完成后，EmailJS 将完美适合生产环境使用！
`);

// 配置验证
const config = {
  serviceId: 'service_wx8tfa8',
  templateId: 'template_8ncg4ek',
  publicKey: 'q3eK04PCYjcxxpUzh'
};

console.log('\n✅ 配置格式验证:');
console.log('Service ID 格式:', config.serviceId.startsWith('service_') ? '✅ 正确' : '❌ 错误');
console.log('Template ID 格式:', config.templateId.startsWith('template_') ? '✅ 正确' : '❌ 错误');
console.log('Public Key 格式:', config.publicKey.length > 10 ? '✅ 正确' : '❌ 错误');

console.log('\n🎯 下一步:');
console.log('1. 按照上面的指南修复 EmailJS 模板');
console.log('2. 确保 "To" 字段设置为 {{to_email}}');
console.log('3. 保存模板并测试邮件发送');
