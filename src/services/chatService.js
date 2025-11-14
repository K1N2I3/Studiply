import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  writeBatch,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToDate } from '../utils/timestampUtils'

// 发送消息
export const sendMessage = async (senderId, receiverId, messageText, chatType = 'friend') => {
  try {
    const messagesRef = collection(db, 'messages')
    const messageData = {
      senderId,
      receiverId,
      message: messageText.trim(),
      timestamp: serverTimestamp(),
      read: false,
      chatType: chatType // 'friend' 或 'tutor'
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
export const getChatHistory = async (userId1, userId2, limitCount = 50, chatType = 'friend') => {
  try {
    const messagesRef = collection(db, 'messages')
    
    // 简化查询，分别获取两个方向的消息，并过滤 chatType
    const q1 = query(
      messagesRef,
      where('senderId', '==', userId1),
      where('receiverId', '==', userId2),
      where('chatType', '==', chatType)
    )
    
    const q2 = query(
      messagesRef,
      where('senderId', '==', userId2),
      where('receiverId', '==', userId1),
      where('chatType', '==', chatType)
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
export const listenToMessages = (userId1, userId2, callback, chatType = 'friend') => {
  const messagesRef = collection(db, 'messages')
  
  // 监听两个方向的消息，并过滤 chatType
  const q1 = query(
    messagesRef,
    where('senderId', '==', userId1),
    where('receiverId', '==', userId2),
    where('chatType', '==', chatType)
  )
  
  const q2 = query(
    messagesRef,
    where('senderId', '==', userId2),
    where('receiverId', '==', userId1),
    where('chatType', '==', chatType)
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
export const getChatList = async (userId, chatType = 'friend') => {
  try {
    const messagesRef = collection(db, 'messages')
    
    // 获取所有发送给该用户的消息（过滤 chatType）
    const q1 = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('chatType', '==', chatType)
    )
    
    // 获取所有该用户发送的消息（过滤 chatType）
    const q2 = query(
      messagesRef,
      where('senderId', '==', userId),
      where('chatType', '==', chatType)
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
export const listenToChatList = (userId, callback, chatType = 'friend') => {
  const messagesRef = collection(db, 'messages')
  
  // 监听所有相关消息（过滤 chatType）
  const q1 = query(
    messagesRef,
    where('receiverId', '==', userId),
    where('chatType', '==', chatType)
  )
  
  const q2 = query(
    messagesRef,
    where('senderId', '==', userId),
    where('chatType', '==', chatType)
  )
  
  let unsubscribe1, unsubscribe2
  
  const processChatList = async () => {
    const result = await getChatList(userId, chatType)
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

// 获取未读消息数量
export const getUnreadMessageCount = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages')
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('read', '==', false)
    )
    
    const snapshot = await getDocs(q)
    return {
      success: true,
      count: snapshot.size
    }
  } catch (error) {
    console.error('Error getting unread message count:', error)
    return {
      success: false,
      count: 0,
      error: 'Failed to get unread message count'
    }
  }
}

// 实时监听未读消息数量变化
export const subscribeUnreadMessageCount = (userId, callback) => {
  if (!userId) {
    console.warn('subscribeUnreadMessageCount: userId is required')
    return () => {}
  }
  
  try {
    const messagesRef = collection(db, 'messages')
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('read', '==', false)
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.size
      callback(count)
    }, (error) => {
      console.error('Error listening to unread message count:', error)
      callback(0)
    })
    
    return unsubscribe
  } catch (error) {
    console.error('Error setting up unread message count listener:', error)
    return () => {}
  }
}

// 标记所有未读消息为已读
export const markAllMessagesAsRead = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages')
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('read', '==', false)
    )
    
    const snapshot = await getDocs(q)
    const updatePromises = []
    
    snapshot.forEach((docSnapshot) => {
      const messageRef = doc(db, 'messages', docSnapshot.id)
      updatePromises.push(updateDoc(messageRef, { read: true }))
    })
    
    await Promise.all(updatePromises)
    
    return {
      success: true,
      count: snapshot.size
    }
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return {
      success: false,
      error: 'Failed to mark messages as read'
    }
  }
}

// 获取来自 Friends 的未读消息数量
export const getUnreadFriendMessagesCount = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages')
    // 直接使用 chatType 字段过滤
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('read', '==', false),
      where('chatType', '==', 'friend')
    )
    
    const snapshot = await getDocs(q)
    
    return {
      success: true,
      count: snapshot.size
    }
  } catch (error) {
    console.error('Error getting unread friend messages count:', error)
    return {
      success: false,
      count: 0,
      error: 'Failed to get unread friend messages count'
    }
  }
}

// 获取来自 Tutors 的未读消息数量
export const getUnreadTutorMessagesCount = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages')
    // 查询：receiverId == userId (student收到), chatType == 'tutor', read == false
    // 这确保只统计 tutor 发送给 student 的消息，而不是 student 发送给 tutor 的消息
    const q = query(
      messagesRef,
      where('receiverId', '==', userId), // student 是接收者
      where('read', '==', false),
      where('chatType', '==', 'tutor')
    )
    
    const snapshot = await getDocs(q)
    
    // 额外验证：确保 senderId 对应的用户确实是 tutor
    let validCount = 0
    const verifyPromises = snapshot.docs.map(async (docSnapshot) => {
      const messageData = docSnapshot.data()
      try {
        const senderDoc = await getDoc(doc(db, 'users', messageData.senderId))
        if (senderDoc.exists()) {
          const senderData = senderDoc.data()
          // 确保发送者是 tutor
          if (senderData.isTutor === true) {
            validCount++
          }
        }
      } catch (error) {
        console.error('Error verifying sender:', error)
      }
    })
    
    await Promise.all(verifyPromises)
    
    return {
      success: true,
      count: validCount
    }
  } catch (error) {
    console.error('Error getting unread tutor messages count:', error)
    return {
      success: false,
      count: 0,
      error: 'Failed to get unread tutor messages count'
    }
  }
}

// 实时监听来自 Friends 的未读消息数量变化
export const subscribeUnreadFriendMessagesCount = (userId, callback) => {
  if (!userId) {
    console.warn('subscribeUnreadFriendMessagesCount: userId is required')
    return () => {}
  }
  
  try {
    const messagesRef = collection(db, 'messages')
    // 直接使用 chatType 字段过滤
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('read', '==', false),
      where('chatType', '==', 'friend')
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.size
      callback(count)
    }, (error) => {
      console.error('Error listening to unread friend messages count:', error)
      callback(0)
    })
    
    return unsubscribe
  } catch (error) {
    console.error('Error setting up unread friend messages count listener:', error)
    return () => {}
  }
}

// 实时监听来自 Tutors 的未读消息数量变化
export const subscribeUnreadTutorMessagesCount = (userId, callback) => {
  if (!userId) {
    console.warn('subscribeUnreadTutorMessagesCount: userId is required')
    return () => {}
  }
  
  try {
    const messagesRef = collection(db, 'messages')
    // 查询：receiverId == userId (student收到), chatType == 'tutor', read == false
    // 这确保只统计 tutor 发送给 student 的消息
    const q = query(
      messagesRef,
      where('receiverId', '==', userId), // student 是接收者
      where('read', '==', false),
      where('chatType', '==', 'tutor')
    )
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      // 验证每个消息的发送者确实是 tutor
      let validCount = 0
      const verifyPromises = snapshot.docs.map(async (docSnapshot) => {
        const messageData = docSnapshot.data()
        try {
          const senderDoc = await getDoc(doc(db, 'users', messageData.senderId))
          if (senderDoc.exists()) {
            const senderData = senderDoc.data()
            // 确保发送者是 tutor
            if (senderData.isTutor === true) {
              validCount++
            }
          }
        } catch (error) {
          console.error('Error verifying sender:', error)
        }
      })
      
      await Promise.all(verifyPromises)
      callback(validCount)
    }, (error) => {
      console.error('Error listening to unread tutor messages count:', error)
      callback(0)
    })
    
    return unsubscribe
  } catch (error) {
    console.error('Error setting up unread tutor messages count listener:', error)
    return () => {}
  }
}

// 获取有未读消息的 tutor 列表
export const getUnreadTutorsList = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages')
    // 查询：receiverId == userId (student收到), chatType == 'tutor', read == false
    // 这确保只统计 tutor 发送给 student 的消息
    const q = query(
      messagesRef,
      where('receiverId', '==', userId), // student 是接收者
      where('read', '==', false),
      where('chatType', '==', 'tutor')
    )
    
    const snapshot = await getDocs(q)
    const tutorIds = new Set()
    
    // 验证每个发送者确实是 tutor
    const verifyPromises = snapshot.docs.map(async (docSnapshot) => {
      const messageData = docSnapshot.data()
      try {
        const senderDoc = await getDoc(doc(db, 'users', messageData.senderId))
        if (senderDoc.exists()) {
          const senderData = senderDoc.data()
          // 确保发送者是 tutor
          if (senderData.isTutor === true) {
            tutorIds.add(messageData.senderId)
          }
        }
      } catch (error) {
        console.error('Error verifying sender:', error)
      }
    })
    
    await Promise.all(verifyPromises)
    
    return {
      success: true,
      tutorIds: Array.from(tutorIds)
    }
  } catch (error) {
    console.error('Error getting unread tutors list:', error)
    return {
      success: false,
      tutorIds: [],
      error: 'Failed to get unread tutors list'
    }
  }
}

// 获取与特定朋友的未读消息数量
export const getUnreadMessagesFromFriend = async (userId, friendId) => {
  try {
    const messagesRef = collection(db, 'messages')
    const q = query(
      messagesRef,
      where('receiverId', '==', userId),
      where('senderId', '==', friendId),
      where('read', '==', false),
      where('chatType', '==', 'friend')
    )
    
    const snapshot = await getDocs(q)
    
    return {
      success: true,
      count: snapshot.size
    }
  } catch (error) {
    console.error('Error getting unread messages from friend:', error)
    return {
      success: false,
      count: 0,
      error: 'Failed to get unread messages from friend'
    }
  }
}

// 删除所有聊天记录（仅管理员使用）
export const deleteAllMessages = async () => {
  try {
    const messagesRef = collection(db, 'messages')
    const snapshot = await getDocs(messagesRef)
    
    if (snapshot.empty) {
      return {
        success: true,
        count: 0,
        message: 'No messages to delete'
      }
    }
    
    // 使用 batch 删除，每次最多 500 个
    const batches = []
    let batch = writeBatch(db)
    let count = 0
    
    snapshot.docs.forEach((docSnapshot, index) => {
      batch.delete(docSnapshot.ref)
      count++
      
      // Firestore batch 限制是 500 个操作
      if (count % 500 === 0) {
        batches.push(batch.commit())
        batch = writeBatch(db)
      }
    })
    
    // 提交最后一个 batch
    if (count % 500 !== 0) {
      batches.push(batch.commit())
    }
    
    await Promise.all(batches)
    
    return {
      success: true,
      count: count,
      message: `Successfully deleted ${count} messages`
    }
  } catch (error) {
    console.error('Error deleting all messages:', error)
    return {
      success: false,
      error: 'Failed to delete all messages'
    }
  }
}
