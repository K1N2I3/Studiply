// EmailJS 快速配置脚本
// 运行命令: node setup-emailjs.js

console.log(`
🚀 EmailJS 配置助手
==================

请按照以下步骤配置 EmailJS：

📧 步骤 1: 注册 EmailJS 账户
   访问: https://www.emailjs.com/
   点击 "Sign Up" 注册账户

🔧 步骤 2: 添加邮件服务
   1. 登录后进入 Dashboard
   2. 点击 "Email Services" → "Add New Service"
   3. 选择 Gmail/Outlook/Yahoo
   4. 完成授权
   5. 复制 Service ID (格式: service_abc123)

📝 步骤 3: 创建邮件模板
   1. 点击 "Email Templates" → "Create New Template"
   2. 使用以下模板内容:

   主题: Studiply - 邮箱验证码
    
   HTML 内容:
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
     <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
       <h1 style="color: white; margin: 0;">Studiply</h1>
     </div>
     <div style="padding: 30px; background: white;">
       <h2>邮箱验证码</h2>
       <p>您的验证码是：</p>
       <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px;">
         <h1 style="color: #667eea; font-size: 32px; margin: 0;">{{verification_code}}</h1>
       </div>
       <p>此验证码有效期为 10 分钟。</p>
     </div>
   </div>

   3. 复制 Template ID (格式: template_xyz789)

🔑 步骤 4: 获取 Public Key
   1. 点击 "Account"
   2. 在 "API Keys" 部分复制 Public Key (格式: user_abcdef123456)

⚙️ 步骤 5: 更新配置文件
   编辑 src/services/emailService.js，替换以下配置:

   const EMAILJS_SERVICE_ID = '你的_Service_ID'
   const EMAILJS_TEMPLATE_ID = '你的_Template_ID' 
   const EMAILJS_PUBLIC_KEY = '你的_Public_Key'

🧪 步骤 6: 测试
   1. 启动应用: npm run dev
   2. 访问注册页面
   3. 输入邮箱地址
   4. 点击 "Verify" 按钮
   5. 检查邮箱收件箱

📊 免费额度:
   • 200 封邮件/月
   • 2 个邮件服务
   • 2 个邮件模板
   • 1000 次 API 调用/月

🐛 如果遇到问题:
   • 检查所有配置信息是否正确
   • 查看浏览器控制台错误
   • 确认邮件服务已正确连接
   • 检查邮件是否进入垃圾箱

配置完成后，你就可以发送真实的邮件验证码了！🎉
`);

// 等待用户输入配置信息
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n请输入你的 Service ID: ', (serviceId) => {
  rl.question('请输入你的 Template ID: ', (templateId) => {
    rl.question('请输入你的 Public Key: ', (publicKey) => {
      
      // 生成配置文件内容
      const configContent = `import emailjs from '@emailjs/browser'

// EmailJS configuration
const EMAILJS_SERVICE_ID = '${serviceId}'
const EMAILJS_TEMPLATE_ID = '${templateId}'
const EMAILJS_PUBLIC_KEY = '${publicKey}'

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // Template parameters for EmailJS
    const templateParams = {
      to_email: email,
      verification_code: verificationCode,
      app_name: 'Studiply',
      from_name: 'Studiply Team'
    }

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', response)
    return { success: true, message: 'Verification code sent successfully' }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, message: 'Failed to send verification code' }
  }
}

// Alternative: Backend API email sending
export const sendVerificationEmailBackend = async (email, verificationCode) => {
  try {
    const response = await fetch('http://localhost:3001/api/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        code: verificationCode
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log(\`✅ Backend email sent to: \${email}\`)
      return { success: true, message: result.message }
    } else {
      console.error('❌ Backend email failed:', result.message)
      return { success: false, message: result.message }
    }
  } catch (error) {
    console.error('❌ Backend API error:', error)
    return { success: false, message: '无法连接到邮件服务，请检查后端服务是否运行' }
  }
}

// Simple email sending without EmailJS (for demo)
export const sendVerificationEmailSimple = async (email, verificationCode) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log(\`📧 Verification email sent to: \${email}\`)
    console.log(\`🔐 Verification code: \${verificationCode}\`)
    
    return { success: true, message: 'Verification code sent successfully' }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, message: 'Failed to send verification code' }
  }
}`;

      console.log('\n✅ 配置完成！');
      console.log('\n📁 配置文件内容已生成，请复制以下内容到 src/services/emailService.js:');
      console.log('\n' + '='.repeat(50));
      console.log(configContent);
      console.log('='.repeat(50));
      
      rl.close();
    });
  });
});
