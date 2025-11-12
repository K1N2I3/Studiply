// EmailJS Configuration
// Replace these with your actual EmailJS credentials

export const emailjsConfig = {
  // Get these from https://dashboard.emailjs.com/admin/account
  publicKey: 'q3eK04PCYjcxxpUzh', // Replace with your EmailJS Public Key
  
  // Get these from https://dashboard.emailjs.com/admin/integration
  serviceId: 'service_wx8tfa8', // Replace with your EmailJS Service ID
  templateId: 'template_2vft7pq', // Replace with your EmailJS Template ID (for verification emails)
  
  // Event reminder template ID - Template for sending calendar event reminders
  eventReminderTemplateId: 'template_5fhs9v8', // Event Reminder Template ID
  
  // Template parameters - these will be dynamically set when sending
  // The actual values will be passed from the Register component
}

// For testing purposes - you can use these temporary values
export const testEmailjsConfig = {
  publicKey: 'test_public_key',
  serviceId: 'test_service',
  templateId: 'test_template'
}
