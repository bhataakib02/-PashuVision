const nodemailer = require('nodemailer');
const twilio = require('twilio');

class NotificationService {
  constructor() {
    this.emailTransporter = this.setupEmail();
    this.smsClient = this.setupSMS();
    this.notifications = [];
    this.scheduleReminders();
  }

  setupEmail() {
    // Mock email transporter - replace with real SMTP settings
    if (process.env.NODE_ENV === 'development') {
      return {
        sendMail: async (options) => {
          console.log('📧 Mock email sent:', options);
          return { messageId: 'mock-' + Date.now() };
        }
      };
    }
    
    return nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  setupSMS() {
    // Mock SMS client - replace with real Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC' + 'mock-sid';
    const authToken = process.env.TWILIO_AUTH_TOKEN || 'mock-token';
    
    // In development, return a mock client
    if (process.env.NODE_ENV === 'development' || accountSid === 'AC' + 'mock-sid') {
      return {
        messages: {
          create: async (options) => {
            console.log('📱 Mock SMS sent:', options);
            return { sid: 'mock-' + Date.now() };
          }
        }
      };
    }
    
    return twilio(accountSid, authToken);
  }

  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@bpa-breed.com',
        to,
        subject,
        html,
        text
      };

      // In development, just log the email
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email would be sent:', { to, subject, text });
        return { success: true, messageId: 'mock-' + Date.now() };
      }

      const result = await this.emailTransporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendSMS(to, message) {
    try {
      // In development, just log the SMS
      if (process.env.NODE_ENV === 'development') {
        console.log('📱 SMS would be sent:', { to, message });
        return { success: true, sid: 'mock-' + Date.now() };
      }

      const result = await this.smsClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE || '+1234567890',
        to
      });

      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPushNotification(userId, title, body, data = {}) {
    try {
      // Mock push notification - integrate with FCM/APNS
      console.log('🔔 Push notification:', { userId, title, body, data });
      
      // Store notification for user to fetch
      this.notifications.push({
        id: Date.now().toString(),
        userId,
        title,
        body,
        data,
        timestamp: new Date().toISOString(),
        read: false
      });

      return { success: true, notificationId: Date.now().toString() };
    } catch (error) {
      console.error('Push notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendVaccinationReminder(animal, ownerContact) {
    const subject = `Vaccination Reminder - ${animal.predictedBreed}`;
    const html = `
      <h2>Vaccination Reminder</h2>
      <p>Dear ${animal.ownerName},</p>
      <p>This is a reminder that your ${animal.predictedBreed} (ID: ${animal.id}) is due for vaccination.</p>
      <p><strong>Animal Details:</strong></p>
      <ul>
        <li>Breed: ${animal.predictedBreed}</li>
        <li>Age: ${animal.ageMonths} months</li>
        <li>Location: ${animal.location}</li>
      </ul>
      <p>Please contact your veterinarian to schedule the vaccination.</p>
      <p>Best regards,<br>BPA Breed Recognition System</p>
    `;

    const smsMessage = `Vaccination reminder: Your ${animal.predictedBreed} (${animal.id}) needs vaccination. Contact your vet.`;

    // Send email
    if (ownerContact.email) {
      await this.sendEmail(ownerContact.email, subject, html, smsMessage);
    }

    // Send SMS
    if (ownerContact.phone) {
      await this.sendSMS(ownerContact.phone, smsMessage);
    }

    // Send push notification
    await this.sendPushNotification(
      ownerContact.userId,
      'Vaccination Reminder',
      `Your ${animal.predictedBreed} needs vaccination`,
      { animalId: animal.id, type: 'vaccination' }
    );
  }

  async sendHealthAlert(animal, disease, ownerContact) {
    const subject = `Health Alert - ${animal.predictedBreed}`;
    const html = `
      <h2>Health Alert</h2>
      <p>Dear ${animal.ownerName},</p>
      <p>Our AI system has detected potential health issues in your ${animal.predictedBreed} (ID: ${animal.id}).</p>
      <p><strong>Detected Issues:</strong></p>
      <ul>
        ${disease.diseases.map(d => `<li>${d.type}: ${d.severity} severity (${Math.round(d.confidence * 100)}% confidence)</li>`).join('')}
      </ul>
      <p><strong>Recommendations:</strong></p>
      <ul>
        ${disease.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
      <p>Please consult with your veterinarian as soon as possible.</p>
      <p>Best regards,<br>BPA Breed Recognition System</p>
    `;

    const smsMessage = `Health alert: ${disease.diseases.length} issues detected in your ${animal.predictedBreed}. Please consult your vet.`;

    // Send email
    if (ownerContact.email) {
      await this.sendEmail(ownerContact.email, subject, html, smsMessage);
    }

    // Send SMS
    if (ownerContact.phone) {
      await this.sendSMS(ownerContact.phone, smsMessage);
    }

    // Send push notification
    await this.sendPushNotification(
      ownerContact.userId,
      'Health Alert',
      `Health issues detected in your ${animal.predictedBreed}`,
      { animalId: animal.id, type: 'health_alert', diseases: disease.diseases.length }
    );
  }

  async sendApprovalNotification(animal, ownerContact) {
    const subject = `Animal Record Approved - ${animal.predictedBreed}`;
    const html = `
      <h2>Record Approved</h2>
      <p>Dear ${animal.ownerName},</p>
      <p>Great news! Your animal record for ${animal.predictedBreed} (ID: ${animal.id}) has been approved.</p>
      <p><strong>Animal Details:</strong></p>
      <ul>
        <li>Breed: ${animal.predictedBreed}</li>
        <li>Age: ${animal.ageMonths} months</li>
        <li>Location: ${animal.location}</li>
        <li>Status: Approved</li>
      </ul>
      <p>Your animal is now registered in the BPA system.</p>
      <p>Best regards,<br>BPA Breed Recognition System</p>
    `;

    const smsMessage = `Approved: Your ${animal.predictedBreed} (${animal.id}) is now registered in BPA system.`;

    // Send email
    if (ownerContact.email) {
      await this.sendEmail(ownerContact.email, subject, html, smsMessage);
    }

    // Send SMS
    if (ownerContact.phone) {
      await this.sendSMS(ownerContact.phone, smsMessage);
    }

    // Send push notification
    await this.sendPushNotification(
      ownerContact.userId,
      'Record Approved',
      `Your ${animal.predictedBreed} is now registered`,
      { animalId: animal.id, type: 'approval' }
    );
  }

  scheduleReminders() {
    // Check for vaccination reminders daily at 9 AM
    const cron = require('node-cron');
    
    cron.schedule('0 9 * * *', () => {
      this.checkVaccinationReminders();
    });

    // Check for health alerts every 6 hours
    cron.schedule('0 */6 * * *', () => {
      this.checkHealthAlerts();
    });
  }

  async checkVaccinationReminders() {
    // This would check the database for animals due for vaccination
    console.log('Checking vaccination reminders...');
  }

  async checkHealthAlerts() {
    // This would check for animals with health issues
    console.log('Checking health alerts...');
  }

  getNotifications(userId, limit = 50) {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
    }
  }
}

module.exports = NotificationService;
