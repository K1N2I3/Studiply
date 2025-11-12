# 📧 Gmail App Password Setup Guide

## 🚨 Current Issue
EmailJS is giving 422 error "recipients address is empty". We'll use a backend email service with Gmail instead.

## 🔧 Step 1: Enable 2-Factor Authentication

1. **Go to Google Account Settings**:
   - Visit: https://myaccount.google.com/
   - Sign in with your Gmail account

2. **Enable 2FA**:
   - Click "Security" in the left menu
   - Find "2-Step Verification"
   - Click "Get started"
   - Follow the setup process

## 🔑 Step 2: Generate App Password

1. **Access App Passwords**:
   - Go back to "Security" section
   - Find "App passwords" (only appears after enabling 2FA)
   - Click "App passwords"

2. **Create New App Password**:
   - Select app: "Mail"
   - Select device: "Other (custom name)"
   - Enter name: "Studiply"
   - Click "Generate"

3. **Copy the App Password**:
   - You'll get a 16-character password like: `abcd efgh ijkl mnop`
   - Copy this password (remove spaces)

## ⚙️ Step 3: Update Backend Configuration

1. **Edit the backend file**:
   ```bash
   nano backend-email-service.js
   ```

2. **Update the email configuration**:
   ```javascript
   const emailConfig = {
     service: 'gmail',
     auth: {
       user: 'hudefei1979@gmail.com', // Your Gmail address
       pass: 'your_16_character_app_password' // The App Password you generated
     }
   }
   ```

## 🚀 Step 4: Start Backend Service

1. **Start the email service**:
   ```bash
   node backend-email-service.js
   ```

2. **You should see**:
   ```
   🚀 邮件服务已启动: http://localhost:3001
   ✅ 邮件服务已就绪
   ```

## 🧪 Step 5: Test Email Sending

1. **Go to your Studiply app**: http://localhost:3002/
2. **Register with your email**: hudefei1979@gmail.com
3. **Click "Verify"**
4. **Check your Gmail inbox** for the verification code

## 🔧 Alternative: Use Different Email Service

If Gmail doesn't work, you can use:

### Outlook/Hotmail:
```javascript
const emailConfig = {
  service: 'hotmail',
  auth: {
    user: 'your_email@outlook.com',
    pass: 'your_password'
  }
}
```

### Yahoo:
```javascript
const emailConfig = {
  service: 'yahoo',
  auth: {
    user: 'your_email@yahoo.com',
    pass: 'your_app_password'
  }
}
```

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid login"
**Solution**: 
- Make sure you're using App Password, not regular password
- Check that 2FA is enabled

### Issue 2: "Less secure app access"
**Solution**:
- Gmail doesn't support "less secure apps" anymore
- Must use App Password with 2FA

### Issue 3: Backend service not starting
**Solution**:
- Check if port 3001 is available
- Install dependencies: `npm install`

## ✅ Success Indicators

When working correctly:
- ✅ Backend service shows "邮件服务已就绪"
- ✅ Console shows "验证码已发送到: [email]"
- ✅ You receive email in Gmail inbox
- ✅ Verification code works in registration

## 🎯 Quick Setup Commands

```bash
# Install dependencies
npm install nodemailer express cors

# Start backend service
node backend-email-service.js

# In another terminal, start frontend
npm run dev
```

---

**After setting up Gmail App Password, you'll receive real verification emails!** 🎉
