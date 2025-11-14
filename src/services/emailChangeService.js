import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

// Generate unique token for email change
const generateToken = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`
}

// Request email change - store token in Firestore and send email
export const requestEmailChange = async (userId, newEmail, oldEmail) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return {
        success: false,
        error: 'Invalid email format'
      }
    }

    // Check if new email is already in use
    const usersRef = collection(db, 'users')
    const emailQuery = query(usersRef, where('email', '==', newEmail.toLowerCase().trim()))
    const emailSnapshot = await getDocs(emailQuery)
    
    if (!emailSnapshot.empty) {
      const existingUser = emailSnapshot.docs[0].data()
      // Allow if it's the same user
      if (existingUser.id !== userId) {
        return {
          success: false,
          error: 'This email is already in use by another account'
        }
      }
    }

    // Generate token
    const token = generateToken()
    const expirationTime = Date.now() + 60 * 60 * 1000 // 1 hour from now

    // Store email change request in Firestore
    const emailChangeRequestsRef = collection(db, 'emailChangeRequests')
    const requestDocRef = doc(emailChangeRequestsRef, token)
    
    await setDoc(requestDocRef, {
      userId,
      oldEmail: oldEmail.toLowerCase().trim(),
      newEmail: newEmail.toLowerCase().trim(),
      token,
      expiresAt: expirationTime,
      createdAt: Date.now()
    })

    // Send verification email via backend API
    const response = await fetch(`${API_BASE_URL}/send-email-change-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        newEmail: newEmail.toLowerCase().trim(),
        oldEmail: oldEmail.toLowerCase().trim(),
        token
      })
    })

    const result = await response.json()

    if (!result.success) {
      // Delete the request if email sending failed
      await deleteDoc(requestDocRef)
      return {
        success: false,
        error: result.error || 'Failed to send verification email'
      }
    }

    return {
      success: true,
      message: 'Verification email sent. Please check your new email inbox.'
    }
  } catch (error) {
    console.error('Error requesting email change:', error)
    return {
      success: false,
      error: 'Failed to request email change. Please try again.'
    }
  }
}

// Verify email change token and update email
export const verifyEmailChange = async (token) => {
  try {
    // Find email change request by token
    const emailChangeRequestsRef = collection(db, 'emailChangeRequests')
    const requestDocRef = doc(emailChangeRequestsRef, token)
    
    // Get the request document
    const requestDoc = await getDoc(requestDocRef)

    if (!requestDoc.exists()) {
      return {
        success: false,
        error: 'Invalid or expired verification link'
      }
    }

    const requestData = requestDoc.data()

    // Check if token has expired
    if (Date.now() > requestData.expiresAt) {
      // Delete expired request
      await deleteDoc(requestDocRef)
      return {
        success: false,
        error: 'Verification link has expired. Please request a new one.'
      }
    }

    // Check if new email is already in use by another account
    const usersRef = collection(db, 'users')
    const emailQuery = query(usersRef, where('email', '==', requestData.newEmail))
    const emailSnapshot = await getDocs(emailQuery)
    
    if (!emailSnapshot.empty) {
      const existingUser = emailSnapshot.docs[0].data()
      if (existingUser.id !== requestData.userId) {
        await deleteDoc(requestDocRef)
        return {
          success: false,
          error: 'This email is already in use by another account'
        }
      }
    }

    // Update user email in Firestore
    const userDocRef = doc(db, 'users', requestData.userId)
    await updateDoc(userDocRef, {
      email: requestData.newEmail
    })

    // Delete the email change request
    await deleteDoc(requestDocRef)

    return {
      success: true,
      message: 'Email changed successfully',
      newEmail: requestData.newEmail,
      userId: requestData.userId
    }
  } catch (error) {
    console.error('Error verifying email change:', error)
    return {
      success: false,
      error: 'Failed to verify email change. Please try again.'
    }
  }
}

