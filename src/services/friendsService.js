import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToDate } from '../utils/timestampUtils'

// 发送朋友请求
export const sendFriendRequest = async (fromUserId, toUserEmail) => {
  try {
    if (!fromUserId) {
      console.error('sendFriendRequest: fromUserId is required')
      return {
        success: false,
        error: 'User ID is required'
      }
    }
    
    if (!toUserEmail) {
      console.error('sendFriendRequest: toUserEmail is required')
      return {
        success: false,
        error: 'Email is required'
      }
    }
    
    // 首先查找目标用户
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', toUserEmail.toLowerCase().trim()))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return {
        success: false,
        error: 'User not found with this email address'
      }
    }
    
    const targetUserDoc = querySnapshot.docs[0]
    const targetUserId = targetUserDoc.id
    const targetUserData = targetUserDoc.data()
    
    // 检查是否是自己
    if (targetUserId === fromUserId) {
      return {
        success: false,
        error: 'You cannot send a friend request to yourself'
      }
    }
    
    // 检查是否已经是朋友
    if (targetUserData.friends && targetUserData.friends.includes(fromUserId)) {
      return {
        success: false,
        error: 'You are already friends with this user'
      }
    }
    
    // 检查是否已经发送过请求
    const requestsRef = collection(db, 'friendRequests')
    const existingRequestQuery = query(
      requestsRef,
      where('fromUserId', '==', fromUserId),
      where('toUserId', '==', targetUserId)
    )
    const existingRequests = await getDocs(existingRequestQuery)
    
    // 检查是否有pending状态的请求
    const hasPendingRequest = existingRequests.docs.some(doc => doc.data().status === 'pending')
    if (hasPendingRequest) {
      return {
        success: false,
        error: 'Friend request already sent'
      }
    }
    
    // 创建朋友请求
    const requestData = {
      fromUserId,
      toUserId: targetUserId,
      toUserEmail: toUserEmail.toLowerCase().trim(),
      status: 'pending', // pending, accepted, declined
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(requestsRef, requestData)
    
    return {
      success: true,
      requestId: docRef.id,
      message: `Friend request sent to ${targetUserData.name}`
    }
  } catch (error) {
    console.error('Error sending friend request:', error)
    return {
      success: false,
      error: 'Failed to send friend request'
    }
  }
}

// 获取朋友请求
export const getFriendRequests = async (userId) => {
  try {
    if (!userId) {
      console.error('getFriendRequests: userId is required')
      return {
        success: false,
        requests: [],
        error: 'User ID is required'
      }
    }
    
    const requestsRef = collection(db, 'friendRequests')
    // 简化查询，只按toUserId查询，然后在代码中过滤status
    const q = query(
      requestsRef,
      where('toUserId', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    const requests = []
    
    for (const docSnapshot of querySnapshot.docs) {
      const requestData = docSnapshot.data()
      
      // 只处理pending状态的请求
      if (requestData.status === 'pending') {
        // 获取发送者的用户信息
        const fromUserDoc = await getDoc(doc(db, 'users', requestData.fromUserId))
        if (fromUserDoc.exists()) {
          const fromUserData = fromUserDoc.data()
          requests.push({
            id: docSnapshot.id,
            ...requestData,
            fromUser: {
              id: requestData.fromUserId,
              name: fromUserData.name,
              email: fromUserData.email,
              school: fromUserData.school,
              grade: fromUserData.grade,
              avatar: fromUserData.avatar || null
            }
          })
        }
      }
    }
    
    // 按创建时间排序
    requests.sort((a, b) => {
      const timeA = safeToDate(a.createdAt).getTime()
      const timeB = safeToDate(b.createdAt).getTime()
      return timeB - timeA
    })
    
    return {
      success: true,
      requests
    }
  } catch (error) {
    console.error('Error getting friend requests:', error)
    return {
      success: false,
      requests: [],
      error: 'Failed to get friend requests'
    }
  }
}

// 接受朋友请求
export const acceptFriendRequest = async (requestId, fromUserId, toUserId) => {
  try {
    // 更新请求状态
    const requestRef = doc(db, 'friendRequests', requestId)
    await updateDoc(requestRef, {
      status: 'accepted',
      updatedAt: serverTimestamp()
    })
    
    // 添加朋友关系到两个用户
    const fromUserRef = doc(db, 'users', fromUserId)
    const toUserRef = doc(db, 'users', toUserId)
    
    await updateDoc(fromUserRef, {
      friends: arrayUnion(toUserId),
      updatedAt: serverTimestamp()
    })
    
    await updateDoc(toUserRef, {
      friends: arrayUnion(fromUserId),
      updatedAt: serverTimestamp()
    })
    
    return {
      success: true,
      message: 'Friend request accepted'
    }
  } catch (error) {
    console.error('Error accepting friend request:', error)
    return {
      success: false,
      error: 'Failed to accept friend request'
    }
  }
}

// 拒绝朋友请求
export const declineFriendRequest = async (requestId) => {
  try {
    const requestRef = doc(db, 'friendRequests', requestId)
    await updateDoc(requestRef, {
      status: 'declined',
      updatedAt: serverTimestamp()
    })
    
    return {
      success: true,
      message: 'Friend request declined'
    }
  } catch (error) {
    console.error('Error declining friend request:', error)
    return {
      success: false,
      error: 'Failed to decline friend request'
    }
  }
}

// 获取朋友列表
export const getFriendsList = async (userId) => {
  try {
    if (!userId) {
      console.error('getFriendsList: userId is required')
      return {
        success: false,
        friends: [],
        error: 'User ID is required'
      }
    }
    
    // 获取用户的朋友ID列表
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (!userDoc.exists()) {
      return {
        success: false,
        friends: [],
        error: 'User not found'
      }
    }
    
    const userData = userDoc.data()
    const friendIds = userData.friends || []
    
    if (friendIds.length === 0) {
      return {
        success: true,
        friends: []
      }
    }
    
    // 获取朋友详细信息
    const friends = []
    for (const friendId of friendIds) {
      const friendDoc = await getDoc(doc(db, 'users', friendId))
      if (friendDoc.exists()) {
        const friendData = friendDoc.data()
        friends.push({
          id: friendId,
          name: friendData.name,
          email: friendData.email,
          school: friendData.school,
          grade: friendData.grade,
          bio: friendData.bio,
          subjects: friendData.subjects || [],
          avatar: friendData.avatar || null,
          lastSeen: friendData.lastSeen || null,
          isOnline: friendData.isOnline || false
        })
      }
    }
    
    return {
      success: true,
      friends
    }
  } catch (error) {
    console.error('Error getting friends list:', error)
    return {
      success: false,
      friends: [],
      error: 'Failed to get friends list'
    }
  }
}

// 根据ID获取朋友信息
export const getFriendById = async (friendId) => {
  try {
    const friendDoc = await getDoc(doc(db, 'users', friendId))
    
    if (!friendDoc.exists()) {
      return {
        success: false,
        error: 'Friend not found'
      }
    }
    
    const friendData = friendDoc.data()
    return {
      success: true,
      friend: {
        id: friendId,
        name: friendData.name,
        email: friendData.email,
        school: friendData.school,
        grade: friendData.grade,
        bio: friendData.bio,
        subjects: friendData.subjects || [],
        avatar: friendData.avatar || null,
        lastSeen: friendData.lastSeen || null,
        isOnline: friendData.isOnline || false
      }
    }
  } catch (error) {
    console.error('Error getting friend by ID:', error)
    return {
      success: false,
      error: 'Failed to get friend information'
    }
  }
}

// 移除朋友
export const removeFriend = async (userId, friendId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const friendRef = doc(db, 'users', friendId)
    
    // 从两个用户的朋友列表中移除
    await updateDoc(userRef, {
      friends: arrayRemove(friendId),
      updatedAt: serverTimestamp()
    })
    
    await updateDoc(friendRef, {
      friends: arrayRemove(userId),
      updatedAt: serverTimestamp()
    })
    
    return {
      success: true,
      message: 'Friend removed successfully'
    }
  } catch (error) {
    console.error('Error removing friend:', error)
    return {
      success: false,
      error: 'Failed to remove friend'
    }
  }
}
