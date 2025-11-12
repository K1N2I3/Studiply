import { db } from '../firebase/config'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

// 生成6位数字的会议代码
export const generateMeetingCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 创建会议
export const createMeeting = async (sessionData, creatorUser) => {
  try {
    const meetingCode = generateMeetingCode()
    const meetingData = {
      code: meetingCode,
      sessionId: sessionData.id,
      subject: sessionData.subject,
      creator: {
        id: creatorUser.id,
        name: creatorUser.name,
        role: creatorUser.role || 'tutor'
      },
      participants: [{
        id: creatorUser.id,
        name: creatorUser.name,
        role: creatorUser.role || 'tutor',
        joinedAt: new Date().toISOString()
      }],
      status: 'active', // active, ended
      createdAt: serverTimestamp(),
      startedAt: serverTimestamp(),
      channelName: `meeting-${meetingCode}`,
      // 会议元数据
      metadata: {
        sessionType: sessionData.type || 'tutoring',
        expectedParticipants: sessionData.student ? [sessionData.student.id] : [],
        maxParticipants: 10
      }
    }

    // 保存会议数据到 Firestore
    const meetingRef = doc(db, 'meetings', meetingCode)
    await setDoc(meetingRef, meetingData)

    console.log('✅ 会议创建成功:', meetingCode)
    
    return {
      success: true,
      meetingCode,
      meetingData
    }
  } catch (error) {
    console.error('❌ 创建会议失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 加入会议
export const joinMeeting = async (meetingCode, user) => {
  try {
    const meetingRef = doc(db, 'meetings', meetingCode)
    const meetingSnap = await getDoc(meetingRef)

    if (!meetingSnap.exists()) {
      return {
        success: false,
        error: 'Meeting does not exist or has ended'
      }
    }

    const meetingData = meetingSnap.data()

    // 检查会议状态
    if (meetingData.status === 'ended') {
      return {
        success: false,
        error: 'Meeting has ended'
      }
    }

    // 权限检查：确保用户有权限加入这个会议
    console.log('🔍 会议权限检查:', {
      meetingCode: meetingCode,
      userRole: user.role,
      userId: user.id,
      meetingCreator: meetingData.creator?.id,
      meetingParticipants: meetingData.participants?.map(p => ({ id: p.id, role: p.role }))
    })

    // 如果用户是学生，确保会议是由老师创建的
    if (user.role === 'student' && meetingData.creator?.role !== 'tutor') {
      console.log('⚠️ 权限检查失败：学生尝试加入非老师创建的会议')
      return {
        success: false,
        error: 'No permission to join this meeting'
      }
    }

    // 检查用户是否已经在会议中
    const existingParticipant = meetingData.participants?.find(p => p.id === user.id)
    if (existingParticipant) {
      return {
        success: true,
        meetingData,
        isExistingParticipant: true
      }
    }

    // 添加参与者
    const newParticipant = {
      id: user.id,
      name: user.name,
      role: user.role || 'student',
      joinedAt: new Date().toISOString()
    }

    const updatedParticipants = [
      ...(meetingData.participants || []),
      newParticipant
    ]

    await updateDoc(meetingRef, {
      participants: updatedParticipants,
      lastActivity: serverTimestamp()
    })

    console.log('✅ 用户加入会议成功:', user.name, meetingCode)

    return {
      success: true,
      meetingData: {
        ...meetingData,
        participants: updatedParticipants
      },
      isExistingParticipant: false
    }
  } catch (error) {
    console.error('❌ 加入会议失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 离开会议
export const leaveMeeting = async (meetingCode, userId) => {
  try {
    const meetingRef = doc(db, 'meetings', meetingCode)
    const meetingSnap = await getDoc(meetingRef)

    if (!meetingSnap.exists()) {
      return { success: true } // 会议不存在，认为已经离开
    }

    const meetingData = meetingSnap.data()
    const updatedParticipants = meetingData.participants?.filter(p => p.id !== userId) || []

    if (updatedParticipants.length === 0) {
      // 如果没有参与者了，结束会议
      await updateDoc(meetingRef, {
        status: 'ended',
        endedAt: serverTimestamp(),
        lastActivity: serverTimestamp()
      })
    } else {
      // 更新参与者列表
      await updateDoc(meetingRef, {
        participants: updatedParticipants,
        lastActivity: serverTimestamp()
      })
    }

    console.log('✅ 用户离开会议成功:', userId, meetingCode)

    return {
      success: true
    }
  } catch (error) {
    console.error('❌ 离开会议失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 获取会议信息
export const getMeetingInfo = async (meetingCode) => {
  try {
    const meetingRef = doc(db, 'meetings', meetingCode)
    const meetingSnap = await getDoc(meetingRef)

    if (!meetingSnap.exists()) {
      return {
        success: false,
        error: 'Meeting does not exist'
      }
    }

    const meetingData = meetingSnap.data()

    return {
      success: true,
      meetingData
    }
  } catch (error) {
    console.error('❌ 获取会议信息失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 结束会议
export const endMeeting = async (meetingCode, endedBy) => {
  try {
    const meetingRef = doc(db, 'meetings', meetingCode)
    
    await updateDoc(meetingRef, {
      status: 'ended',
      endedAt: serverTimestamp(),
      endedBy: endedBy,
      lastActivity: serverTimestamp()
    })

    console.log('✅ 会议结束成功:', meetingCode)

    return {
      success: true
    }
  } catch (error) {
    console.error('❌ 结束会议失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 验证会议代码格式
export const validateMeetingCode = (code) => {
  if (!code) return { valid: false, error: 'Meeting code cannot be empty' }
  if (code.length !== 6) return { valid: false, error: 'Meeting code must be 6 digits' }
  if (!/^\d{6}$/.test(code)) return { valid: false, error: 'Meeting code can only contain numbers' }
  return { valid: true }
}
