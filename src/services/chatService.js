import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToDate } from '../utils/timestampUtils'

// 发送消息
export const sendMessage = async (senderId, receiverId, messageText) => {
  try {
    const messagesRef = collection(db, 'messages')
    const messageData = {
      senderId,
      receiverId,
      message: messageText.trim(),
      timestamp: serverTimestamp(),
      read: false
    }
    
    const docRef = await addDoc(messagesRef, messageData)
    
    return {
      success: true,
      messageId: docRef.id,
      message: 'Message sent successfully'
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return {
      success: false,
      error: 'Failed to send message'
    }
  }
}

// 获取聊天历史
export const getChatHistory = async (userId1, userId2, limitCount = 50) => {
  try {
    const messagesRef = collection(db, 'messages')
    
    // 简化查询，分别获取两个方向的消息
    const q1 = query(
      messagesRef,
      where('senderId', '==', userId1),
      where('receiverId', '==', userId2)
    )
    
    const q2 = query(
      messagesRef,
      where('senderId', '==', userId2),
      where('receiverId', '==', userId1)
    )
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ])
    
    const messages = []
    
    // 处理第一个查询结果
    snapshot1.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        timestamp: data.timestamp,
        read: data.read
      })
    })
    
    // 处理第二个查询结果
    snapshot2.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        timestamp: data.timestamp,
        read: data.read
      })
    })
    
    // 按时间排序
    messages.sort((a, b) => {
      const timeA = safeToDate(a.timestamp).getTime()
      const timeB = safeToDate(b.timestamp).getTime()
      return timeA - timeB
    })
    
    // 限制消息数量
    const limitedMessages = messages.slice(-limitCount)
    
    return {
      success: true,
      messages: limitedMessages
    }
  } catch (error) {
    console.error('Error getting chat history:', error)
    return {
      success: false,
      messages: [],
      error: 'Failed to get chat history'
    }
  }
}

// 实时监听聊天消息
export const listenToMessages = (userId1, userId2, callback) => {
  const messagesRef = collection(db, 'messages')
  
  // 监听两个方向的消息
  const q1 = query(
    messagesRef,
    where('senderId', '==', userId1),
    where('receiverId', '==', userId2)
  )
  
  const q2 = query(
    messagesRef,
    where('senderId', '==', userId2),
    where('receiverId', '==', userId1)
  )
  
  let allMessages = []
  let listener1, listener2
  
  const processMessages = () => {
    // 按时间排序
    allMessages.sort((a, b) => {
      const timeA = safeToDate(a.timestamp).getTime()
      const timeB = safeToDate(b.timestamp).getTime()
      return timeA - timeB
    })
    
    callback({
      success: true,
      messages: allMessages
    })
  }
  
  listener1 = onSnapshot(q1, (snapshot) => {
    // 更新第一个方向的消息
    const messages1 = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      messages1.push({
        id: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        timestamp: data.timestamp,
        read: data.read
      })
    })
    
    // 移除旧的消息并添加新的
    allMessages = allMessages.filter(msg => 
      !(msg.senderId === userId1 && msg.receiverId === userId2)
    )
    allMessages.push(...messages1)
    
    processMessages()
  }, (error) => {
    console.error('Error listening to messages (direction 1):', error)
  })
  
  listener2 = onSnapshot(q2, (snapshot) => {
    // 更新第二个方向的消息
    const messages2 = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      messages2.push({
        id: doc.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        timestamp: data.timestamp,
        read: data.read
      })
    })
    
    // 移除旧的消息并添加新的
    allMessages = allMessages.filter(msg => 
      !(msg.senderId === userId2 && msg.receiverId === userId1)
    )
    allMessages.push(...messages2)
    
    processMessages()
  }, (error) => {
    console.error('Error listening to messages (direction 2):', error)
  })
  
  // 返回清理函数
  return () => {
    if (listener1) listener1()
    if (listener2) listener2()
  }
}

// 格式化时间戳
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return 'Unknown time'
  
  const now = new Date()
  const messageTime = safeToDate(timestamp)
  
  // 检查是否是今天
  const isToday = messageTime.toDateString() === now.toDateString()
  
  if (isToday) {
    return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return messageTime.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

// 创建聊天ID（用于标识两个用户之间的聊天）
export const createChatId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_')
}

// 获取所有与特定用户聊天的用户列表（用于显示聊天列表）
export const getChatList = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages')
    
    // 获取所有发送给该用户的消息
    const q1 = query(
      messagesRef,
      where('receiverId', '==', userId)
    )
    
    // 获取所有该用户发送的消息
    const q2 = query(
      messagesRef,
      where('senderId', '==', userId)
    )
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ])
    
    // 收集所有聊天对象ID
    const chatPartners = new Set()
    
    snapshot1.forEach((doc) => {
      const data = doc.data()
      chatPartners.add(data.senderId)
    })
    
    snapshot2.forEach((doc) => {
      const data = doc.data()
      chatPartners.add(data.receiverId)
    })
    
    // 获取每个聊天对象的最新消息
    const chatList = []
    for (const partnerId of chatPartners) {
      // 获取最新消息
      const partnerMessages = []
      
      snapshot1.forEach((doc) => {
        const data = doc.data()
        if (data.senderId === partnerId) {
          partnerMessages.push({
            id: doc.id,
            message: data.message,
            timestamp: data.timestamp,
            senderId: data.senderId,
            receiverId: data.receiverId
          })
        }
      })
      
      snapshot2.forEach((doc) => {
        const data = doc.data()
        if (data.receiverId === partnerId) {
          partnerMessages.push({
            id: doc.id,
            message: data.message,
            timestamp: data.timestamp,
            senderId: data.senderId,
            receiverId: data.receiverId
          })
        }
      })
      
      // 按时间排序，获取最新消息
      partnerMessages.sort((a, b) => {
        const timeA = safeToDate(a.timestamp).getTime()
        const timeB = safeToDate(b.timestamp).getTime()
        return timeB - timeA
      })
      
      const latestMessage = partnerMessages[0]
      
      chatList.push({
        userId: partnerId,
        latestMessage: latestMessage?.message || '',
        latestMessageTime: latestMessage?.timestamp || null,
        unreadCount: 0 // 可以后续添加未读消息计数
      })
    }
    
    // 按最新消息时间排序
    chatList.sort((a, b) => {
      const timeA = safeToDate(a.latestMessageTime).getTime()
      const timeB = safeToDate(b.latestMessageTime).getTime()
      return timeB - timeA
    })
    
    return {
      success: true,
      chatList: chatList
    }
  } catch (error) {
    console.error('Error getting chat list:', error)
    return {
      success: false,
      chatList: [],
      error: 'Failed to get chat list'
    }
  }
}

// 实时监听聊天列表（当有新消息时更新）
export const listenToChatList = (userId, callback) => {
  const messagesRef = collection(db, 'messages')
  
  // 监听所有相关消息
  const q1 = query(
    messagesRef,
    where('receiverId', '==', userId)
  )
  
  const q2 = query(
    messagesRef,
    where('senderId', '==', userId)
  )
  
  let unsubscribe1, unsubscribe2
  
  const processChatList = async () => {
    const result = await getChatList(userId)
    if (result.success) {
      callback(result)
    }
  }
  
  unsubscribe1 = onSnapshot(q1, () => {
    processChatList()
  }, (error) => {
    console.error('Error listening to chat list (receiver):', error)
  })
  
  unsubscribe2 = onSnapshot(q2, () => {
    processChatList()
  }, (error) => {
    console.error('Error listening to chat list (sender):', error)
  })
  
  // 初始加载
  processChatList()
  
  // 返回清理函数
  return () => {
    if (unsubscribe1) unsubscribe1()
    if (unsubscribe2) unsubscribe2()
  }
}
