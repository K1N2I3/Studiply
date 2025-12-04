import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// 初始化 Resend（如果配置了 API Key）
let resend = null
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
}

// SMTP 配置（作为备选方案）
let smtpTransporter = null
if (process.env.SMTP_HOST && process.env.EMAIL_PASSWORD) {
  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp0001.neo.space',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL_USER || 'noreply@studiply.it',
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    pool: true,
    maxConnections: 10,
    maxMessages: 100,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    rateDelta: 1000,
    rateLimit: 10,
    disableFileAccess: true,
    disableUrlAccess: true,
    requireTLS: false
  })
}

/**
 * 生成验证码邮件 HTML 模板
 */
const generateVerificationEmailHTML = (code) => {
  const logoUrl = 'https://www.studiply.it/studiply-logo.png'
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" href="${logoUrl}" type="image/png">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 20px;">
        <tr>
          <td align="center" valign="top">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 600px;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                  <img src="${logoUrl}" alt="Studiply Logo" style="width: 120px; height: auto; margin: 0 auto 20px; display: block; border-radius: 12px; background: rgba(255, 255, 255, 0.1); padding: 10px;" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Email Verification</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 15px;">Verify your account to get started</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 45px 40px;">
                  <p style="color: #333333; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">Welcome to Studiply! Please enter the verification code below to complete your registration.</p>
                  
                  <!-- Verification Code Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border: 2px solid #667eea; border-radius: 12px; padding: 30px;">
                          <tr>
                            <td align="center" style="padding: 0;">
                              <p style="color: #667eea; margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Verification Code</p>
                              <div style="background: #ffffff; border-radius: 8px; padding: 20px 30px; margin: 0;">
                                <h1 style="color: #667eea; margin: 0; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace; line-height: 1.2;">${code}</h1>
                              </div>
                              <p style="color: #999999; margin: 12px 0 0 0; font-size: 12px; font-weight: 500;">Valid for 10 minutes</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Instructions -->
                  <div style="background: #f8f9fa; border-left: 3px solid #667eea; border-radius: 6px; padding: 18px; margin: 25px 0;">
                    <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #667eea;">Next Steps:</strong> Copy the code above and paste it into the verification field in the Studiply app.
                    </p>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background: #f8f9fa; padding: 25px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #999999; margin: 0 0 8px 0; font-size: 12px; line-height: 1.5;">If you didn't create a Studiply account, you can safely ignore this email.</p>
                  <p style="color: #cccccc; margin: 0; font-size: 11px;">
                    © ${new Date().getFullYear()} Studiply. All rights reserved.<br>
                    <a href="${websiteUrl}/unsubscribe" style="color: #999999; text-decoration: none; font-size: 11px;">Unsubscribe</a> | 
                    <a href="${websiteUrl}" style="color: #999999; text-decoration: none; font-size: 11px;">Visit Studiply</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

/**
 * 使用 Resend 发送邮件（推荐，速度快）
 * @param {string} to - 收件人邮箱
 * @param {string} subject - 邮件主题
 * @param {string} html - HTML 内容
 * @param {string} text - 纯文本内容
 * @param {string} fromEmail - 发件人邮箱（可选，默认使用 RESEND_FROM_EMAIL）
 * @param {object} headers - 额外的邮件头（可选）
 */
const sendWithResend = async (to, subject, html, text, fromEmail = null, headers = {}) => {
  const startTime = Date.now()
  
  try {
    const defaultFromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_USER || 'noreply@studiply.it'
    const from = fromEmail || defaultFromEmail
    const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'
    
    // 优化邮件头，提高送达率
    const defaultHeaders = {
      'X-Entity-Ref-ID': `${subject.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      'List-Unsubscribe': `<${websiteUrl}/unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      'X-Mailer': 'Studiply Email Service',
      'X-Priority': '3', // Normal priority (避免 high 触发过滤器)
      'Importance': 'normal',
      'Precedence': 'bulk',
      'Auto-Submitted': 'auto-generated', // 标记为自动生成
      ...headers
    }
    
    const { data, error } = await resend.emails.send({
      from: `Studiply <${from}>`,
      to: [to],
      replyTo: process.env.RESEND_REPLY_TO || `support@studiply.it`, // 添加回复地址
      subject: subject,
      html: html,
      text: text,
      headers: defaultHeaders,
      // 添加标签用于分类（Resend 功能）
      tags: [
        { name: 'category', value: 'transactional' },
        { name: 'source', value: 'studiply-api' }
      ]
    })

    if (error) {
      throw new Error(`Resend API error: ${error.message}`)
    }

    const duration = Date.now() - startTime
    console.log(`✅ [Resend] Email sent to ${to} in ${duration}ms. Message ID: ${data?.id}`)
    return { success: true, messageId: data?.id, provider: 'resend' }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ [Resend] Failed to send email to ${to} after ${duration}ms:`, error)
    throw error
  }
}

/**
 * 使用 SMTP 发送邮件（备选方案）
 */
const sendWithSMTP = async (email, code) => {
  const startTime = Date.now()
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'
  
  const mailOptions = {
    from: `"Studiply" <${process.env.EMAIL_USER || 'noreply@studiply.it'}>`,
    to: email,
    subject: 'Studiply - Email Verification',
    priority: 'normal', // 改为 normal，high priority 可能触发垃圾邮件过滤器
    headers: {
      'X-Priority': '3', // 改为 3 (normal)，1 (high) 可能触发垃圾邮件过滤器
      'X-MSMail-Priority': 'Normal',
      'Importance': 'normal',
      'Date': new Date().toUTCString(),
      'X-Entity-Ref-ID': `verification-${Date.now()}`,
      'List-Unsubscribe': `<${websiteUrl}/unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      'Precedence': 'bulk', // 标记为批量邮件
    },
    html: generateVerificationEmailHTML(code),
    // 添加纯文本版本（提高送达率）
    text: `Welcome to Studiply!\n\nYour verification code is: ${code}\n\nThis code is valid for 10 minutes.\n\nIf you didn't create a Studiply account, you can safely ignore this email.\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`
  }

  try {
    const info = await smtpTransporter.sendMail(mailOptions)
    const duration = Date.now() - startTime
    console.log(`✅ [SMTP] Verification email sent to ${email} in ${duration}ms. Message ID: ${info.messageId}`)
    return { success: true, messageId: info.messageId, provider: 'smtp' }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ [SMTP] Failed to send email to ${email} after ${duration}ms:`, error)
    throw error
  }
}

/**
 * 发送验证码邮件（自动选择最快的服务）
 * 优先级：Resend > SMTP
 */
export const sendVerificationEmail = async (email, code, options = {}) => {
  const { waitForCompletion = false } = options
  const startTime = Date.now()

  // 发送邮件的异步函数
  const sendEmailAsync = async () => {
    try {
      // 优先使用 Resend（如果配置了）
      if (resend) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@studiply.it'
        const text = `Welcome to Studiply!\n\nYour verification code is: ${code}\n\nThis code is valid for 10 minutes.\n\nIf you didn't create a Studiply account, you can safely ignore this email.\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`
        return await sendWithResend(email, 'Studiply - Email Verification', generateVerificationEmailHTML(code), text, fromEmail)
      }
      
      // 备选：使用 SMTP
      if (smtpTransporter) {
        return await sendWithSMTP(email, code)
      }
      
      // 如果都没有配置，抛出错误
      throw new Error('No email service configured. Please set RESEND_API_KEY or SMTP credentials.')
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`❌ Failed to send verification email to ${email} after ${duration}ms:`, error)
      // 不抛出错误，避免影响主流程
      return null
    }
  }

  // 如果需要等待完成（如注册流程），则等待
  if (waitForCompletion) {
    return await sendEmailAsync()
  } else {
    // 否则异步发送，不阻塞
    sendEmailAsync().catch(err => {
      console.error(`Background email sending error for ${email}:`, err)
    })
    // 立即返回，不等待邮件发送完成
    return Promise.resolve({ accepted: [email], messageId: 'queued', provider: resend ? 'resend' : 'smtp' })
  }
}

/**
 * 发送更换邮箱验证邮件
 */
export const sendEmailChangeVerification = async (email, token, oldEmail) => {
  if (!resend) {
    throw new Error('Resend is not configured. Please set RESEND_API_KEY.')
  }

  const logoUrl = 'https://www.studiply.it/studiply-logo.png'
  const verificationLink = `${process.env.FRONTEND_URL || 'https://www.studiply.it'}/verify-email-change?token=${token}`
  const fromEmail = process.env.RESEND_CHANGE_EMAIL || 'change-email@studiply.it'
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 20px;">
        <tr>
          <td align="center" valign="top">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 600px;">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                  <img src="${logoUrl}" alt="Studiply Logo" style="width: 120px; height: auto; margin: 0 auto 20px; display: block; border-radius: 12px; background: rgba(255, 255, 255, 0.1); padding: 10px;" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Change Email Address</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 15px;">Verify your new email address</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 45px 40px;">
                  <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">You requested to change your email address from <strong>${oldEmail}</strong> to <strong>${email}</strong>.</p>
                  <p style="color: #333333; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">Click the button below to confirm this change:</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">Verify Email Change</a>
                      </td>
                    </tr>
                  </table>
                  <div style="background: #f8f9fa; border-left: 3px solid #667eea; border-radius: 6px; padding: 18px; margin: 25px 0;">
                    <p style="color: #666666; margin: 0 0 8px 0; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #667eea;">Button not working?</strong> Copy and paste this link into your browser:
                    </p>
                    <p style="color: #667eea; margin: 0; font-size: 12px; word-break: break-all; font-family: 'Courier New', monospace;">${verificationLink}</p>
                  </div>
                  <div style="background: #fff3cd; border-left: 3px solid #ffc107; border-radius: 6px; padding: 18px; margin: 25px 0;">
                    <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
                      <strong>⏰ Important:</strong> This verification link will expire in 1 hour. If you didn't request this change, you can safely ignore this email.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background: #f8f9fa; padding: 25px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #999999; margin: 0 0 8px 0; font-size: 12px; line-height: 1.5;">If you didn't request to change your email address, you can safely ignore this email.</p>
                  <p style="color: #cccccc; margin: 0; font-size: 11px;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `You requested to change your email address from ${oldEmail} to ${email}.\n\nClick this link to confirm: ${verificationLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this change, you can safely ignore this email.\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`

  return await sendWithResend(email, 'Studiply - Verify Your New Email Address', html, text, fromEmail)
}

/**
 * 发送日历提醒邮件
 */
export const sendCalendarReminder = async (email, eventTitle, eventDate, eventTime, reminderDays) => {
  if (!resend) {
    throw new Error('Resend is not configured. Please set RESEND_API_KEY.')
  }

  const logoUrl = 'https://www.studiply.it/studiply-logo.png'
  const fromEmail = process.env.RESEND_CALENDAR_EMAIL || 'calendar@studiply.it'
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'

  // Format event date
  let formattedDate = ''
  if (eventDate) {
    try {
      const date = new Date(eventDate)
      formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      formattedDate = eventDate
    }
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 20px;">
        <tr>
          <td align="center" valign="top">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 600px;">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                  <img src="${logoUrl}" alt="Studiply Logo" style="width: 120px; height: auto; margin: 0 auto 20px; display: block; border-radius: 12px; background: rgba(255, 255, 255, 0.1); padding: 10px;" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">📅 Calendar Reminder</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 15px;">Don't forget your upcoming event!</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 45px 40px;">
                  <p style="color: #333333; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">You have an upcoming event:</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border: 2px solid #667eea; border-radius: 12px; padding: 30px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 12px 0; color: #667eea; font-size: 18px; font-weight: 700;">${eventTitle}</p>
                        ${formattedDate ? `<p style="margin: 8px 0; color: #333333; font-size: 15px; line-height: 1.6;"><span style="color: #667eea; margin-right: 8px;">📅</span>${formattedDate}</p>` : ''}
                        ${eventTime ? `<p style="margin: 8px 0; color: #333333; font-size: 15px; line-height: 1.6;"><span style="color: #667eea; margin-right: 8px;">🕐</span>${eventTime}</p>` : ''}
                        <p style="margin: 12px 0 0 0; color: #333333; font-size: 15px; line-height: 1.6;"><span style="color: #667eea; font-size: 18px; margin-right: 8px;">🔔</span><strong style="color: #667eea;">Reminder:</strong> ${reminderDays} day${reminderDays > 1 ? 's' : ''} before</p>
                      </td>
                    </tr>
                  </table>
                  <div style="background: #f8f9fa; border-left: 3px solid #667eea; border-radius: 6px; padding: 18px; margin: 25px 0;">
                    <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #667eea;">💡 Tip:</strong> Make sure to prepare everything you need for this event ahead of time!
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background: #f8f9fa; padding: 25px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #999999; margin: 0 0 8px 0; font-size: 12px; line-height: 1.5;">This is an automated reminder from Studiply Calendar.</p>
                  <p style="color: #cccccc; margin: 0; font-size: 11px;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `Calendar Reminder\n\nYou have an upcoming event: ${eventTitle}\n${formattedDate ? `Date: ${formattedDate}\n` : ''}${eventTime ? `Time: ${eventTime}\n` : ''}Reminder: ${reminderDays} day${reminderDays > 1 ? 's' : ''} before\n\nMake sure to prepare everything you need for this event ahead of time!\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`

  return await sendWithResend(email, `📅 Reminder: ${eventTitle}`, html, text, fromEmail)
}

/**
 * 发送连续学习提醒邮件
 */
export const sendStreakReminder = async (email, userName, currentStreak) => {
  if (!resend) {
    throw new Error('Resend is not configured. Please set RESEND_API_KEY.')
  }

  const logoUrl = 'https://www.studiply.it/studiply-logo.png'
  const fromEmail = process.env.RESEND_NOTIFICATION_EMAIL || 'notification@studiply.it'
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; padding: 40px 20px;">
        <tr>
          <td align="center" valign="top">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 600px;">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
                  <img src="${logoUrl}" alt="Studiply Logo" style="width: 120px; height: auto; margin: 0 auto 20px; display: block; border-radius: 12px; background: rgba(255, 255, 255, 0.1); padding: 10px;" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">🔥 Keep Your Streak Going!</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 15px;">Don't break your learning streak!</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 45px 40px;">
                  <p style="color: #333333; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">Hi ${userName},</p>
                  <p style="color: #333333; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">You're on a ${currentStreak}-day learning streak! 🎉 Don't let it break today!</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border: 2px solid #667eea; border-radius: 12px; padding: 30px; margin: 20px 0;">
                    <tr>
                      <td align="center">
                        <p style="color: #667eea; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Current Streak</p>
                        <h1 style="color: #667eea; margin: 0; font-size: 48px; font-weight: 700; font-family: 'Courier New', monospace;">${currentStreak} days</h1>
                      </td>
                    </tr>
                  </table>
                  <div style="background: #f8f9fa; border-left: 3px solid #667eea; border-radius: 6px; padding: 18px; margin: 25px 0;">
                    <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #667eea;">💪 Keep it up!</strong> Log in today to maintain your streak and continue your learning journey.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background: #f8f9fa; padding: 25px 40px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="color: #999999; margin: 0 0 8px 0; font-size: 12px; line-height: 1.5;">This is an automated reminder from Studiply.</p>
                  <p style="color: #cccccc; margin: 0; font-size: 11px;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `Hi ${userName},\n\nYou're on a ${currentStreak}-day learning streak! 🎉 Don't let it break today!\n\nLog in today to maintain your streak and continue your learning journey.\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`

  return await sendWithResend(email, `🔥 Keep Your ${currentStreak}-Day Streak Going!`, html, text, fromEmail)
}

