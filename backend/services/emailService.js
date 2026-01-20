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
 * 生成验证码邮件 HTML 模板（简洁专业版，降低垃圾邮件风险）
 */
const generateVerificationEmailHTML = (code) => {
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Email Verification - Studiply</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333333;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb;">
              <!-- Simple Header -->
              <tr>
                <td style="padding: 32px 24px 24px; text-align: left; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827; letter-spacing: -0.5px;">Studiply</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 24px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #374151;">Hello,</p>
                  
                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.5; color: #374151;">Please use the following code to verify your email address:</p>
                  
                  <!-- Verification Code -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                    <tr>
                      <td align="center" style="padding: 24px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Verification Code</p>
                        <p style="margin: 0; font-size: 36px; font-weight: 700; color: #111827; letter-spacing: 4px; font-family: 'Courier New', Courier, monospace;">${code}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #6b7280;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
                  
                  <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #374151;">Best regards,<br>Studiply Team</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
                    <a href="${websiteUrl}" style="color: #6b7280; text-decoration: underline;">Visit Studiply</a> | 
                    <a href="${websiteUrl}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
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
        const text = `Hello,\n\nPlease use the following code to verify your email address:\n\n${code}\n\nThis code will expire in 10 minutes. If you did not request this code, please ignore this email.\n\nBest regards,\nStudiply Team\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`
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

  const verificationLink = `${process.env.FRONTEND_URL || 'https://www.studiply.it'}/verify-email-change?token=${token}`
  const fromEmail = process.env.RESEND_CHANGE_EMAIL || 'change-email@studiply.it'
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Email Change - Studiply</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333333;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb;">
              <tr>
                <td style="padding: 32px 24px 24px; text-align: left; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Studiply</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 24px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #374151;">Hello,</p>
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #374151;">You requested to change your email address from <strong>${oldEmail}</strong> to <strong>${email}</strong>.</p>
                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.5; color: #374151;">Click the button below to confirm this change:</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                    <tr>
                      <td align="center">
                        <a href="${verificationLink}" style="display: inline-block; padding: 12px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">Verify Email Change</a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #6b7280;">If the button does not work, copy and paste this link into your browser:</p>
                  <p style="margin: 0 0 24px 0; font-size: 12px; line-height: 1.5; color: #6b7280; word-break: break-all; font-family: 'Courier New', monospace;">${verificationLink}</p>
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">This link will expire in 1 hour. If you did not request this change, please ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
                    <a href="${websiteUrl}" style="color: #6b7280; text-decoration: underline;">Visit Studiply</a> | 
                    <a href="${websiteUrl}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Calendar Reminder - Studiply</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333333;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb;">
              <tr>
                <td style="padding: 32px 24px 24px; text-align: left; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Studiply</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 24px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #374151;">Hello,</p>
                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.5; color: #374151;">You have an upcoming event:</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">${eventTitle}</p>
                        ${formattedDate ? `<p style="margin: 8px 0; font-size: 15px; line-height: 1.5; color: #374151;">Date: ${formattedDate}</p>` : ''}
                        ${eventTime ? `<p style="margin: 8px 0; font-size: 15px; line-height: 1.5; color: #374151;">Time: ${eventTime}</p>` : ''}
                        <p style="margin: 16px 0 0 0; font-size: 14px; line-height: 1.5; color: #6b7280;">Reminder: ${reminderDays} day${reminderDays > 1 ? 's' : ''} before</p>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">Make sure to prepare everything you need for this event ahead of time.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
                    <a href="${websiteUrl}" style="color: #6b7280; text-decoration: underline;">Visit Studiply</a> | 
                    <a href="${websiteUrl}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
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

  // 移除 emoji 从主题行，避免触发垃圾邮件过滤器
  const subject = `Reminder: ${eventTitle} - ${reminderDays} day${reminderDays > 1 ? 's' : ''} before`

  return await sendWithResend(email, subject, html, text, fromEmail)
}

/**
 * 发送连续学习提醒邮件
 */
export const sendStreakReminder = async (email, userName, currentStreak) => {
  if (!resend) {
    throw new Error('Resend is not configured. Please set RESEND_API_KEY.')
  }

  const fromEmail = process.env.RESEND_NOTIFICATION_EMAIL || 'notification@studiply.it'
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Keep Your Streak Going - Studiply</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333333;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb;">
              <tr>
                <td style="padding: 32px 24px 24px; text-align: left; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Studiply</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 24px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #374151;">Hi ${userName},</p>
                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.5; color: #374151;">You're on a ${currentStreak}-day learning streak. Don't let it break today.</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Current Streak</p>
                        <p style="margin: 0; font-size: 36px; font-weight: 700; color: #111827; font-family: 'Courier New', Courier, monospace;">${currentStreak} days</p>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #374151;">Log in today to maintain your streak and continue your learning journey.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
                    <a href="${websiteUrl}" style="color: #6b7280; text-decoration: underline;">Visit Studiply</a> | 
                    <a href="${websiteUrl}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `Hi ${userName},\n\nYou're on a ${currentStreak}-day learning streak. Don't let it break today.\n\nLog in today to maintain your streak and continue your learning journey.\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`

  return await sendWithResend(email, `Keep Your ${currentStreak}-Day Streak Going`, html, text, fromEmail)
}

/**
 * 生成密码重置邮件 HTML 模板
 */
const generatePasswordResetEmailHTML = (code) => {
  const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Password Reset - Studiply</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #333333;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb;">
              <!-- Simple Header -->
              <tr>
                <td style="padding: 32px 24px 24px; text-align: left; border-bottom: 1px solid #e5e7eb;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827; letter-spacing: -0.5px;">Studiply</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 24px;">
                  <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #374151;">Hello,</p>
                  
                  <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.5; color: #374151;">We received a request to reset your password. Use the following code to reset it:</p>
                  
                  <!-- Reset Code -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                    <tr>
                      <td align="center" style="padding: 24px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Password Reset Code</p>
                        <p style="margin: 0; font-size: 36px; font-weight: 700; color: #111827; letter-spacing: 4px; font-family: 'Courier New', Courier, monospace;">${code}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #6b7280;">This code will expire in 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                  
                  <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #374151;">Best regards,<br>Studiply Team</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; line-height: 1.5; color: #6b7280;">
                    <a href="${websiteUrl}" style="color: #6b7280; text-decoration: underline;">Visit Studiply</a> | 
                    <a href="${websiteUrl}/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Studiply. All rights reserved.</p>
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
 * 发送密码重置邮件
 */
export const sendPasswordResetEmail = async (email, code) => {
  const startTime = Date.now()

  try {
    // 优先使用 Resend（如果配置了）
    if (resend) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@studiply.it'
      const text = `Hello,\n\nWe received a request to reset your password. Use the following code to reset it:\n\n${code}\n\nThis code will expire in 10 minutes. If you did not request a password reset, please ignore this email.\n\nBest regards,\nStudiply Team\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`
      return await sendWithResend(email, 'Studiply - Password Reset Code', generatePasswordResetEmailHTML(code), text, fromEmail)
    }
    
    // 备选：使用 SMTP
    if (smtpTransporter) {
      const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'
      const mailOptions = {
        from: `"Studiply" <${process.env.EMAIL_USER || 'noreply@studiply.it'}>`,
        to: email,
        subject: 'Studiply - Password Reset Code',
        priority: 'normal',
        headers: {
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'normal',
          'Date': new Date().toUTCString(),
          'X-Entity-Ref-ID': `password-reset-${Date.now()}`,
          'List-Unsubscribe': `<${websiteUrl}/unsubscribe>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'Precedence': 'bulk',
        },
        html: generatePasswordResetEmailHTML(code),
        text: `Hello,\n\nWe received a request to reset your password. Use the following code:\n\n${code}\n\nThis code is valid for 10 minutes.\n\nIf you didn't request this, you can safely ignore this email.\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`
      }

      const info = await smtpTransporter.sendMail(mailOptions)
      const duration = Date.now() - startTime
      console.log(`✅ [SMTP] Password reset email sent to ${email} in ${duration}ms. Message ID: ${info.messageId}`)
      return { success: true, messageId: info.messageId, provider: 'smtp' }
    }
    
    // 如果都没有配置，抛出错误
    throw new Error('No email service configured. Please set RESEND_API_KEY or SMTP credentials.')
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ Failed to send password reset email to ${email} after ${duration}ms:`, error)
    throw error
  }
}
