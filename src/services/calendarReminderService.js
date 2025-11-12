import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import emailjs from '@emailjs/browser'
import { emailjsConfig } from '../config/emailjs'

// 初始化 EmailJS
emailjs.init(emailjsConfig.publicKey)

/**
 * 检查并发送即将到来的事件提醒
 */
export const checkAndSendEventReminders = async (userId, userEmail, userName) => {
  if (!userId || !userEmail) {
    console.log('Missing userId or userEmail, skipping reminder check')
    return { success: false, error: 'Missing user information' }
  }

  try {
    // 获取用户的所有 events
    const eventsRef = collection(db, 'users', userId, 'calendarEvents')
    const eventsSnapshot = await getDocs(eventsRef)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const remindersToSend = []
    
    eventsSnapshot.forEach((docSnap) => {
      const event = docSnap.data()
      if (!event.date) {
        console.log(`⚠️ Event ${docSnap.id} has no date, skipping`)
        return
      }
      
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      
      // 计算距离事件还有多少天
      const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
      const reminderDays = event.reminderDays || 1
      
      console.log(`📅 Event: ${event.title || 'Untitled'}, Date: ${eventDate.toISOString()}, Days until: ${daysUntilEvent}, Reminder days: ${reminderDays}`)
      
      // 如果正好是提醒日期（例如提前1天），且事件还没过期
      if (daysUntilEvent === reminderDays && daysUntilEvent > 0) {
        console.log(`✅ Event "${event.title || 'Untitled'}" matches reminder criteria (${daysUntilEvent} days until event, reminder set for ${reminderDays} days)`)
        remindersToSend.push({
          eventId: docSnap.id,
          event: {
            ...event,
            id: docSnap.id
          },
          daysUntilEvent
        })
      } else {
        console.log(`⏭️  Event "${event.title || 'Untitled'}" does not match reminder criteria (${daysUntilEvent} days until event, reminder set for ${reminderDays} days)`)
      }
    })
    
    // 收集所有事件信息用于调试
    const allEventsInfo = []
    eventsSnapshot.forEach((docSnap) => {
      const event = docSnap.data()
      if (!event.date) return
      
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
      const reminderDays = event.reminderDays || 1
      
      allEventsInfo.push({
        id: docSnap.id,
        title: event.title || 'Untitled',
        date: eventDate.toISOString(),
        daysUntilEvent,
        reminderDays,
        matches: daysUntilEvent === reminderDays && daysUntilEvent > 0,
        isPast: daysUntilEvent < 0
      })
    })
    
    if (remindersToSend.length === 0) {
      console.log('No reminders to send')
      return { 
        success: true, 
        remindersSent: 0,
        totalEvents: allEventsInfo.length,
        eventsInfo: allEventsInfo
      }
    }
    
    // 发送每个需要提醒的事件
    let sentCount = 0
    const sendResults = []
    
    for (const reminder of remindersToSend) {
      console.log(`📧 Sending reminder for event: ${reminder.event.title} (${reminder.daysUntilEvent} days until event)`)
      const result = await sendEventReminder(userId, userEmail, userName, reminder.event, reminder.eventId)
      sendResults.push({
        eventTitle: reminder.event.title,
        success: result.success,
        alreadySent: result.alreadySent,
        error: result.error
      })
      
      if (result.success && !result.alreadySent) {
        sentCount++
        console.log(`✅ Reminder sent successfully for: ${reminder.event.title}`)
      } else if (result.alreadySent) {
        console.log(`⏭️  Reminder already sent today for: ${reminder.event.title}`)
      } else {
        console.error(`❌ Failed to send reminder for: ${reminder.event.title}`, result.error)
      }
    }
    
    console.log(`✅ Sent ${sentCount} event reminder(s) out of ${remindersToSend.length} total`)
    return {
      success: true,
      remindersSent: sentCount,
      totalReminders: remindersToSend.length,
      totalEvents: allEventsInfo.length,
      eventsInfo: allEventsInfo,
      sendResults: sendResults
    }
  } catch (error) {
    console.error('Error checking event reminders:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 发送单个事件的提醒邮件
 */
const sendEventReminder = async (userId, userEmail, userName, event, eventId) => {
  try {
    // 检查是否已经发送过提醒
    const reminderRef = doc(db, 'users', userId, 'calendarEvents', eventId, 'reminders', 'sent')
    const reminderSnap = await getDoc(reminderRef)
    
    if (reminderSnap.exists()) {
      const reminderData = reminderSnap.data()
      const reminderDate = reminderData.date?.toDate?.() || new Date(reminderData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // 如果今天已经发送过，跳过
      if (reminderDate && reminderDate.toDateString() === today.toDateString()) {
        console.log(`Reminder already sent today for event: ${event.title}`)
        return { success: true, alreadySent: true }
      }
    }
    
    // 格式化事件日期和时间
    const eventDate = new Date(event.date)
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const eventTime = event.time || 'All day'
    
    // 获取事件类型的中文名称
    const eventTypeNames = {
      'study': 'Study Session',
      'homework': 'Homework',
      'summative': 'Summative Test',
      'social': 'Social Event',
      'mission': 'Mission',
      'reward': 'Reward'
    }
    
    // 准备邮件模板参数
    const templateParams = {
      to_email: userEmail,
      to_name: userName || userEmail.split('@')[0],
      event_title: event.title || 'Untitled Event',
      event_date: formattedDate,
      event_time: eventTime,
      event_type: eventTypeNames[event.type] || event.type || 'Event',
      event_description: event.description || 'No description provided.',
      event_subject: event.subject || '',
      reminder_days: event.reminderDays || 1,
      app_name: 'Studiply',
      from_name: 'Studiply Calendar',
      // 兼容性字段
      user_email: userEmail,
      user_name: userName || userEmail.split('@')[0],
      email: userEmail,
      name: userName || userEmail.split('@')[0]
    }
    
    // Try Neo Email (backend API) first
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'
    
    try {
      console.log('📧 Attempting to send calendar reminder via Neo Email (backend)...', {
        to: userEmail,
        event: event.title
      })
      
      const requestBody = {
        email: userEmail,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        reminderDays: event.reminderDays
      }
      
      console.log('📤 Sending calendar reminder request to backend:', {
        url: `${API_BASE_URL}/send-calendar-reminder`,
        email: userEmail,
        eventTitle: event.title,
        eventDate: event.date
      })
      
      const response = await fetch(`${API_BASE_URL}/send-calendar-reminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Backend API error (${response.status}):`, errorText)
        throw new Error(`Backend API error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('📥 Backend API response:', result)
      
      if (result.success) {
        // 记录已发送的提醒
        await setDoc(reminderRef, {
          sent: true,
          date: new Date(),
          reminderDays: event.reminderDays,
          eventTitle: event.title
        })
        
        console.log(`✅ Calendar reminder sent via Neo Email for: ${event.title}`)
        return { success: true, alreadySent: false }
      } else {
        throw new Error(result.error || 'Backend email failed')
      }
    } catch (backendError) {
      console.warn('⚠️ Neo Email failed for calendar reminder, falling back to EmailJS:', backendError.message || backendError)
      // Continue to EmailJS fallback
    }
    
    // Fallback to EmailJS
    // 发送邮件（使用事件提醒模板）
    // 注意：需要在 EmailJS 中创建模板 ID 为 'template_event_reminder' 的模板
    // 或者使用现有的模板 ID（如果支持这些变量）
    const templateId = emailjsConfig.eventReminderTemplateId || 'template_event_reminder'
    
    console.log('📧 Sending event reminder email via EmailJS (fallback)...', {
      to: userEmail,
      event: event.title,
      templateId
    })
    
    const result = await emailjs.send(
      emailjsConfig.serviceId,
      templateId,
      templateParams,
      emailjsConfig.publicKey
    )
    
    if (result.status === 200) {
      // 记录已发送的提醒
      await setDoc(reminderRef, {
        sent: true,
        date: new Date(),
        reminderDays: event.reminderDays,
        eventTitle: event.title
      })
      
      console.log(`✅ Event reminder sent via EmailJS for: ${event.title}`)
      return { success: true, alreadySent: false }
    } else {
      throw new Error(`EmailJS returned status ${result.status}`)
    }
  } catch (error) {
    console.error('Error sending event reminder:', error)
    // 即使发送失败也不抛出错误，避免影响其他提醒
    return { success: false, error: error.message, alreadySent: false }
  }
}

/**
 * 手动触发提醒检查（用于测试）
 */
export const triggerReminderCheck = async (userId, userEmail, userName) => {
  return await checkAndSendEventReminders(userId, userEmail, userName)
}

