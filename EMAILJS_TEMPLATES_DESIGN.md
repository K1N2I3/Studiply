# 📧 EmailJS Template Design Guide

## 🎨 Two Beautiful Email Templates

### Template 1: Verification Code Email
**Template ID**: `template_2vft7pq`

---

### Template 2: Event Reminder Email
**Template ID**: `template_5fhs9v8`

---

## 📋 How to Use

1. Login to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Go to **Email Templates**
3. Find the corresponding template and click **Edit**
4. Copy the HTML code below to the template's **Content** section
5. Make sure **Subject** and **To Email** fields are also correctly configured
6. Click **Save** to save

---

## 🎯 Template 1: Verification Code Email

### Subject:
```
Studiply - Your Verification Code
```

### To Email:
```
{{to_email}}
```

### From Name:
```
Studiply Team
```

### Content (HTML):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #c7d2fe 0%, #e9d5ff 50%, #fce7f3 100%);">
  <table role="presentation" style="width: 100%; border-collapse: collapse; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse;">
          
          <!-- Main Card -->
          <tr>
            <td style="background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(255, 255, 255, 0.7); border-radius: 32px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);">
              
              <!-- Compact Header -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 32px 40px 24px; text-align: center;">
                    <div style="display: inline-block; background: rgba(168, 85, 247, 0.1); border-radius: 9999px; padding: 6px 14px; margin-bottom: 16px;">
                      <span style="color: #a855f7; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email Verification</span>
                    </div>
                    <h1 style="color: #1a202c; margin: 0 0 8px 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Studiply</h1>
                  </td>
                </tr>
              </table>
              
              <!-- Main Content -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <p style="color: #4b5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                      Hello <strong style="color: #a855f7; font-weight: 600;">{{to_name}}</strong>!
                    </p>
                    <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">
                      Thank you for registering with Studiply! Please use the following verification code to complete your registration:
                    </p>
                    
                    <!-- Verification Code Box -->
                    <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 24px; padding: 36px 32px; text-align: center; margin: 32px 0;">
                      <p style="color: #6b7280; margin: 0 0 16px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Verification Code</p>
                      <div style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%); padding: 24px 48px; border-radius: 20px; box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);">
                        <h1 style="color: #ffffff; font-size: 48px; font-weight: 700; margin: 0; letter-spacing: 10px; font-family: 'Courier New', monospace; text-align: center;">{{verification_code}}</h1>
                      </div>
                    </div>
                    
                    <!-- Important Notice -->
                    <div style="background: rgba(168, 85, 247, 0.06); border-left: 4px solid #a855f7; border-radius: 16px; padding: 20px; margin: 24px 0;">
                      <p style="color: #7c3aed; margin: 0; font-size: 14px; line-height: 1.8;">
                        <strong style="display: block; margin-bottom: 8px; color: #a855f7; font-size: 15px;">⚠️ Important:</strong>
                        • This code is valid for <strong>10 minutes</strong><br>
                        • Do not share this code with anyone<br>
                        • If you didn't request this code, please ignore this email
                      </p>
                    </div>
                    
                    <!-- Additional Info -->
                    <p style="color: #6b7280; margin: 24px 0 0 0; font-size: 15px; line-height: 1.6;">
                      Thank you for choosing Studiply!<br>
                      If you have any questions, please contact our support team.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="background: linear-gradient(135deg, #120b2c 0%, #1a1240 50%, #09071b 100%); padding: 24px 40px; text-align: center;">
                    <p style="color: rgba(255, 255, 255, 0.7); margin: 0 0 6px 0; font-size: 13px; font-weight: 400;">
                      © 2024 Studiply. All rights reserved.
                    </p>
                    <p style="color: rgba(255, 255, 255, 0.5); margin: 0; font-size: 11px;">
                      This is an automated email, please do not reply.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🎯 Template 2: Event Reminder Email

### Subject:
```
📅 Reminder: {{event_title}} is coming up
```

### To Email:
```
{{to_email}}
```

### From Name:
```
Studiply Calendar
```

### Content (HTML):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #c7d2fe 0%, #e9d5ff 50%, #fce7f3 100%);">
  <table role="presentation" style="width: 100%; border-collapse: collapse; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse;">
          
          <!-- Main Card -->
          <tr>
            <td style="background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(255, 255, 255, 0.7); border-radius: 32px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);">
              
              <!-- Compact Header -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 32px 40px 24px; text-align: center;">
                    <div style="display: inline-block; background: rgba(168, 85, 247, 0.1); border-radius: 9999px; padding: 6px 14px; margin-bottom: 16px;">
                      <span style="color: #a855f7; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📅 Event Reminder</span>
                    </div>
                    <h1 style="color: #1a202c; margin: 0 0 6px 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">Coming up in {{reminder_days}} day(s)</h1>
                    <p style="color: #6b7280; margin: 0; font-size: 14px; font-weight: 400;">Don't miss this important event</p>
                  </td>
                </tr>
              </table>
              
              <!-- Main Content -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <p style="color: #4b5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                      Hello <strong style="color: #a855f7; font-weight: 600;">{{to_name}}</strong>!
                    </p>
                    <p style="color: #4b5563; margin: 0 0 32px 0; font-size: 16px; line-height: 1.6;">
                      This is a friendly reminder that you have an event coming up:
                    </p>
                    
                    <!-- Event Card -->
                    <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 24px; padding: 28px; margin: 28px 0; box-shadow: 0 4px 12px rgba(168, 85, 247, 0.1);">
                      <h2 style="color: #1a202c; margin: 0 0 24px 0; font-size: 24px; font-weight: 800; line-height: 1.3; letter-spacing: -0.5px;">
                        {{event_title}}
                      </h2>
                      
                      <!-- Event Details -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid rgba(168, 85, 247, 0.1);">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 90px; color: #6b7280; font-size: 13px; font-weight: 600;">📅 Date</td>
                                <td style="color: #1a202c; font-size: 15px; font-weight: 600;">{{event_date}}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid rgba(168, 85, 247, 0.1);">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 90px; color: #6b7280; font-size: 13px; font-weight: 600;">🕐 Time</td>
                                <td style="color: #1a202c; font-size: 15px; font-weight: 600;">{{event_time}}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid rgba(168, 85, 247, 0.1);">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 90px; color: #6b7280; font-size: 13px; font-weight: 600;">📋 Type</td>
                                <td style="color: #1a202c; font-size: 15px; font-weight: 600;">{{event_type}}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        {{#event_subject}}
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid rgba(168, 85, 247, 0.1);">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 90px; color: #6b7280; font-size: 13px; font-weight: 600;">📚 Subject</td>
                                <td style="color: #1a202c; font-size: 15px; font-weight: 600;">{{event_subject}}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        {{/event_subject}}
                        {{#event_description}}
                        <tr>
                          <td style="padding: 12px 0;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="width: 90px; color: #6b7280; font-size: 13px; font-weight: 600; vertical-align: top; padding-top: 12px;">📝 Description</td>
                                <td style="color: #4b5563; font-size: 15px; line-height: 1.6;">{{event_description}}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        {{/event_description}}
                      </table>
                    </div>
                    
                    <!-- Reminder Info -->
                    <div style="background: rgba(168, 85, 247, 0.06); border-left: 4px solid #a855f7; border-radius: 16px; padding: 20px; margin: 24px 0;">
                      <p style="color: #7c3aed; margin: 0; font-size: 14px; line-height: 1.8;">
                        <strong style="color: #a855f7; font-size: 15px;">💡 Reminder Info:</strong><br>
                        This event will start in <strong>{{reminder_days}} day(s)</strong>. Please prepare in advance!
                      </p>
                    </div>
                    
                    <!-- Call to Action -->
                    <div style="text-align: center; margin: 32px 0 0 0;">
                      <a href="https://www.studiply.it/calendar" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 20px; font-weight: 600; font-size: 15px; box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);">
                        View Calendar
                      </a>
                    </div>
                    
                    <!-- Additional Info -->
                    <p style="color: #6b7280; margin: 24px 0 0 0; font-size: 15px; line-height: 1.6; text-align: center;">
                      Thank you for using Studiply Calendar!<br>
                      If you have any questions, please contact our support team.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="background: linear-gradient(135deg, #120b2c 0%, #1a1240 50%, #09071b 100%); padding: 24px 40px; text-align: center;">
                    <p style="color: rgba(255, 255, 255, 0.7); margin: 0 0 6px 0; font-size: 13px; font-weight: 400;">
                      © 2024 Studiply. All rights reserved.
                    </p>
                    <p style="color: rgba(255, 255, 255, 0.5); margin: 0; font-size: 11px;">
                      This is an automated email, please do not reply.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## ✅ Configuration Checklist

### Verification Code Email Template (`template_2vft7pq`)
- [ ] Subject: `Studiply - Your Verification Code`
- [ ] To Email: `{{to_email}}`
- [ ] From Name: `Studiply Team`
- [ ] Content: Copy the HTML code above
- [ ] Ensure variables `{{to_name}}` and `{{verification_code}}` are correct

### Event Reminder Email Template (`template_5fhs9v8`)
- [ ] Subject: `📅 Reminder: {{event_title}} is coming up`
- [ ] To Email: `{{to_email}}`
- [ ] From Name: `Studiply Calendar`
- [ ] Content: Copy the HTML code above
- [ ] Ensure all variables are correct:
  - `{{to_name}}`
  - `{{event_title}}`
  - `{{event_date}}`
  - `{{event_time}}`
  - `{{event_type}}`
  - `{{event_subject}}` (optional)
  - `{{event_description}}` (optional)
  - `{{reminder_days}}`

---

## 🎨 Design Features

### Common Features:
- ✅ **Clean & Modern**: Simplified design without excessive decoration
- ✅ **Compact Header**: Minimal padding, no large decorative elements
- ✅ **Large Rounded Corners**: 32px border-radius matching website
- ✅ **Gradient Backgrounds**: Subtle purple/pink/blue gradients
- ✅ **Modern Typography**: Bold headings with gradient text effects
- ✅ **Elegant Shadows**: Soft shadows matching website style
- ✅ **Badge Elements**: Rounded-full badges with purple accent
- ✅ **Professional Spacing**: Balanced padding and margins

### Verification Code Email:
- ✅ Large verification code display with gradient background
- ✅ Prominent code box with shadow
- ✅ Security notice with purple accent border
- ✅ Clean, modern layout

### Event Reminder Email:
- ✅ Detailed event information card with glassmorphism
- ✅ Structured information display
- ✅ Clear date and time display
- ✅ Call-to-action button with gradient
- ✅ Conditional display (subject and description)

---

## 📱 Mobile Optimization

Both templates are optimized for mobile:
- Responsive table layout
- Adaptive width (max 600px)
- Mobile-friendly font sizes
- Touch-friendly button sizes
- Proper padding for small screens

---

## 🔧 Troubleshooting

If emails don't display correctly:
1. Make sure the HTML code is completely copied (including `<!DOCTYPE html>`)
2. Check if the EmailJS template editor supports HTML
3. Test sending an email to see the result
4. Check if variables are correctly replaced
5. Note: Some email clients may not support `backdrop-filter`, but the design will still look good with the fallback background

---

**Last Updated**: January 2024
