// EmailJS 调试工具
// 运行命令: node debug-emailjs.js

console.log(`
🔍 EmailJS 配置调试工具
========================

当前配置信息:
- Service ID: service_wx8tfa8
- Template ID: template_8ncg4ek  
- Public Key: q3eK04PCYjcxxpUzh

🔧 可能的问题和解决方案:

1. 📧 EmailJS 服务未正确连接
   - 检查 EmailJS Dashboard 中的服务状态
   - 确认 Gmail/Outlook 服务已正确授权
   - 重新连接邮件服务

2. 📝 邮件模板问题
   - 检查模板是否存在
   - 确认模板变量名正确: {{verification_code}}
   - 重新创建邮件模板

3. 🔑 API Key 问题
   - 检查 Public Key 是否正确
   - 确认 API Key 没有过期
   - 重新生成 API Key

4. 🌐 网络问题
   - 检查网络连接
   - 尝试使用不同的网络
   - 检查防火墙设置

5. 📱 浏览器问题
   - 清除浏览器缓存
   - 尝试不同的浏览器
   - 检查浏览器控制台错误

🧪 测试步骤:
1. 打开浏览器开发者工具 (F12)
2. 进入 Console 标签
3. 尝试发送验证码
4. 查看错误信息

🔧 快速修复:
如果 EmailJS 不工作，系统会自动使用演示模式：
- 验证码会在浏览器控制台显示
- 可以直接使用显示的验证码完成注册
- 这是临时的解决方案，不影响功能测试

📞 获取帮助:
- EmailJS 官方文档: https://www.emailjs.com/docs/
- 检查 EmailJS Dashboard: https://dashboard.emailjs.com/
- 重新配置邮件服务和模板

现在可以重新测试注册功能了！
`);

// 检查配置的简单验证
const config = {
  serviceId: 'service_wx8tfa8',
  templateId: 'template_8ncg4ek',
  publicKey: 'q3eK04PCYjcxxpUzh'
};

console.log('\n✅ 配置格式检查:');
console.log('Service ID 格式:', config.serviceId.startsWith('service_') ? '✅ 正确' : '❌ 错误');
console.log('Template ID 格式:', config.templateId.startsWith('template_') ? '✅ 正确' : '❌ 错误');
console.log('Public Key 格式:', config.publicKey.length > 10 ? '✅ 正确' : '❌ 错误');

console.log('\n🚀 建议操作:');
console.log('1. 重新检查 EmailJS Dashboard 配置');
console.log('2. 确认邮件服务已正确连接');
console.log('3. 重新创建邮件模板');
console.log('4. 如果仍有问题，使用演示模式进行测试');
