// EmailJS Configuration Test
// Run with: node test-emailjs.js

console.log(`
🧪 EmailJS Configuration Test
=============================

Current Configuration:
- Service ID: service_wx8tfa8
- Template ID: template_8ncg4ek
- Public Key: q3eK04PCYjcxxpUzh

🔍 Testing Configuration...

To fix the "recipients address is empty" error, you need to:

1. 📧 Check EmailJS Template Configuration:
   - Go to: https://dashboard.emailjs.com/
   - Navigate to "Email Templates"
   - Find template: template_8ncg4ek
   - Edit the template

2. 🔧 Required Template Settings:
   
   Subject Line:
   Studiply - Email Verification Code
   
   Recipient (To field):
   {{to_email}}
   
   Email Content:
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

3. 🚨 Critical Settings:
   - Make sure "To" field is set to: {{to_email}}
   - Make sure template variables match exactly:
     * {{to_email}} - recipient email
     * {{to_name}} - recipient name
     * {{verification_code}} - verification code

4. 💾 Save the template and test again

5. 🔄 Alternative: Create a new template
   - Delete the current template
   - Create a new template with the correct settings
   - Update the Template ID in the code

Common Issues:
❌ "To" field is empty or hardcoded
❌ Template variables don't match
❌ Template not saved properly
❌ Service not connected properly

✅ Correct configuration:
- To: {{to_email}}
- Subject: Studiply - Email Verification Code
- Body: HTML with {{verification_code}} variable

After fixing the template, the real email verification will work!
`);

// Test the configuration format
const config = {
  serviceId: 'service_wx8tfa8',
  templateId: 'template_8ncg4ek',
  publicKey: 'q3eK04PCYjcxxpUzh'
};

console.log('\n✅ Configuration Format Check:');
console.log('Service ID format:', config.serviceId.startsWith('service_') ? '✅ Correct' : '❌ Wrong');
console.log('Template ID format:', config.templateId.startsWith('template_') ? '✅ Correct' : '❌ Wrong');
console.log('Public Key format:', config.publicKey.length > 10 ? '✅ Correct' : '❌ Wrong');

console.log('\n🎯 Next Steps:');
console.log('1. Fix EmailJS template configuration');
console.log('2. Test email sending');
console.log('3. Verify emails are received');
