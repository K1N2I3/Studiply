import { collection, addDoc, serverTimestamp, query, where, onSnapshot, updateDoc, doc, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToMillis } from '../utils/timestampUtils'

// 创建一条通知
export const createNotification = async (userId, type, title, message, extra = {}) => {
  try {
    const col = collection(db, 'notifications')
    await addDoc(col, {
      userId,
      type, // 'info' | 'success' | 'warning' | 'error'
      title,
      message,
      read: false,
      createdAt: serverTimestamp(),
      ...extra
    })
    return { success: true }
  } catch (e) {
    console.error('createNotification error:', e)
    return { success: false, error: e.message }
  }
}

// 订阅未读数量变化
export const subscribeUnreadCount = (userId, callback) => {
  const col = collection(db, 'notifications')
  const q = query(col, where('userId', '==', userId), where('read', '==', false))
  return onSnapshot(q, (snap) => {
    callback(snap.size)
  })
}

// 订阅最近的通知列表
export const subscribeNotifications = (userId, callback, max = 20) => {
  const col = collection(db, 'notifications')
  
  // 直接使用客户端过滤，避免索引问题
  const q = query(col, where('userId', '==', userId))
  
  const unsubscribe = onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    
    // 客户端排序和限制
    items.sort((a, b) => {
      const ta = safeToMillis(a.createdAt)
      const tb = safeToMillis(b.createdAt)
      return tb - ta
    })
    
    callback(items.slice(0, max))
  }, (error) => {
    console.error('subscribeNotifications error:', error)
    callback([])
  })

  return () => {
    if (unsubscribe) unsubscribe()
  }
}

// 将当前用户的未读全部标记为已读
export const markAllNotificationsRead = async (userId) => {
  try {
    const col = collection(db, 'notifications')
    const q = query(col, where('userId', '==', userId), where('read', '==', false))
    const snap = await getDocs(q)
    const ops = []
    snap.forEach((d) => ops.push(updateDoc(doc(db, 'notifications', d.id), { read: true })))
    await Promise.all(ops)
    return { success: true }
  } catch (e) {
    console.error('markAllNotificationsRead error:', e)
    return { success: false, error: e.message }
  }
}


