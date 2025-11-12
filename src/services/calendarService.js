import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

const getUserEventsCollection = (userId) => {
  if (!userId) throw new Error('User ID is required to access calendar events')
  return collection(db, 'users', userId, 'calendarEvents')
}

export const fetchCalendarEvents = async (userId) => {
  try {
    const snapshot = await getDocs(getUserEventsCollection(userId))
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        title: data.title || '',
        time: data.time || '',
        type: data.type || 'study',
        description: data.description || '',
        subject: data.subject || '',
        reminderDays: data.reminderDays ?? 1,
        date: data.date,
      }
    })
  } catch (error) {
    console.error('Failed to fetch calendar events:', error)
    throw error
  }
}

export const createCalendarEvent = async (userId, eventData) => {
  try {
    const eventsCollection = getUserEventsCollection(userId)
    const eventRef = doc(eventsCollection)
    const payload = {
      title: eventData.title,
      time: eventData.time,
      type: eventData.type,
      description: eventData.description,
      subject: eventData.subject,
      reminderDays: eventData.reminderDays,
      date: eventData.date,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(eventRef, payload)

    return {
      id: eventRef.id,
      ...eventData,
    }
  } catch (error) {
    console.error('Failed to create calendar event:', error)
    throw error
  }
}

export const deleteCalendarEvent = async (userId, eventId) => {
  try {
    const eventRef = doc(db, 'users', userId, 'calendarEvents', eventId)
    await deleteDoc(eventRef)
  } catch (error) {
    console.error('Failed to delete calendar event:', error)
    throw error
  }
}

