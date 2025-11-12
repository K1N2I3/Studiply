# 📧 EmailJS Real Email Setup Guide

## 🚨 Current Issue
**Error**: `422 - The recipients address is empty`

**Cause**: EmailJS template is not properly configured with recipient address.

## 🔧 Step-by-Step Fix

### 1. Login to EmailJS Dashboard
1. Go to: https://dashboard.emailjs.com/
2. Login with your EmailJS account

### 2. Check Email Service
1. Click "Email Services" in the left menu
2. Find `service_wx8tfa8`
3. Make sure it shows "Connected" status
4. If not connected, reconnect your Gmail/Outlook

### 3. Fix Email Template
1. Click "Email Templates" in the left menu
2. Find template `template_8ncg4ek`
3. Click "Edit" to modify the template

### 4. Template Configuration

#### ✅ Correct Template Settings:

**Template Name**: Studiply Verification

**Subject**: 
```
Studiply - Email Verification Code
```

**To Field** (CRITICAL):
```
{{to_email}}
```

**Email Content**:
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

### 5. Template Variables
Make sure these variables are used correctly:
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Recipient name (extracted from email)
- `{{verification_code}}` - 6-digit verification code
- `{{app_name}}` - Application name
- `{{from_name}}` - Sender name

### 6. Save and Test
1. Click "Save" to save the template
2. Go back to your Studiply application
3. Test the registration with a real email address
4. Check your email inbox (and spam folder)

### 7. Alternative: Create New Template
If the current template doesn't work:

1. **Delete current template**: `template_8ncg4ek`
2. **Create new template**:
   - Click "Create New Template"
   - Use the settings above
   - Save and get the new Template ID
3. **Update code**: Replace `template_8ncg4ek` with new Template ID

## 🧪 Testing Steps

### 1. Test Email Sending
1. Go to: http://localhost:3002/
2. Navigate to registration page
3. Enter a real email address
4. Click "Verify" button
5. Check browser console for success message

### 2. Verify Email Receipt
1. Check your email inbox
2. Look for "Studiply - Email Verification Code"
3. Note the 6-digit verification code
4. Enter the code in the registration form

### 3. Complete Registration
1. Enter the verification code
2. Complete the remaining registration steps
3. Verify account creation

## 🚨 Common Issues & Solutions

### Issue 1: Still getting 422 error
**Solution**: 
- Double-check the "To" field is set to `{{to_email}}`
- Make sure template is saved properly
- Try creating a new template

### Issue 2: Email not received
**Solution**:
- Check spam/junk folder
- Verify email address is correct
- Wait a few minutes for delivery

### Issue 3: Template variables not working
**Solution**:
- Ensure variable names match exactly: `{{verification_code}}`
- Check for typos in variable names
- Test with simple template first

## ✅ Success Indicators

When working correctly, you should see:
- ✅ Console message: "Email sent successfully"
- ✅ Alert: "Verification code sent to [email]!"
- ✅ Email received in inbox
- ✅ Verification code works in registration

## 🔄 Fallback Option

If EmailJS still doesn't work, you can:
1. Use the backend email service (Node.js + Nodemailer)
2. Switch to a different email service (SendGrid, Mailgun)
3. Use the demo mode temporarily

---

**After fixing the template, you'll receive real verification emails!** 🎉
