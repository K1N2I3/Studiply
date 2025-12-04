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
                    <a href="${process.env.FRONTEND_URL || 'https://www.studiply.it'}/unsubscribe" style="color: #999999; text-decoration: none; font-size: 11px;">Unsubscribe</a>
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
 */
const sendWithResend = async (email, code) => {
  const startTime = Date.now()
  
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_USER || 'noreply@studiply.it'
    const websiteUrl = process.env.FRONTEND_URL || 'https://www.studiply.it'
    
    const { data, error } = await resend.emails.send({
      from: `Studiply <${fromEmail}>`,
      to: [email],
      subject: 'Studiply - Email Verification',
      html: generateVerificationEmailHTML(code),
      // 添加防垃圾邮件配置
      headers: {
        'X-Entity-Ref-ID': `verification-${Date.now()}`,
        'List-Unsubscribe': `<${websiteUrl}/unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      // 添加纯文本版本（提高送达率）
      text: `Welcome to Studiply!\n\nYour verification code is: ${code}\n\nThis code is valid for 10 minutes.\n\nIf you didn't create a Studiply account, you can safely ignore this email.\n\n© ${new Date().getFullYear()} Studiply. All rights reserved.`,
    })

    if (error) {
      throw new Error(`Resend API error: ${error.message}`)
    }

    const duration = Date.now() - startTime
    console.log(`✅ [Resend] Verification email sent to ${email} in ${duration}ms. Message ID: ${data?.id}`)
    return { success: true, messageId: data?.id, provider: 'resend' }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ [Resend] Failed to send email to ${email} after ${duration}ms:`, error)
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
        return await sendWithResend(email, code)
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

