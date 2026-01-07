const cron = require('node-cron');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class NotificationService {
  constructor() {
    this.notifications = [];
    this.scheduleReminders();
  }

  scheduleReminders() {
    // Check for vaccination reminders daily at 9 AM
    cron.schedule('0 9 * * *', () => {
      this.checkVaccinationReminders();
    });

    // Check for general health reminders weekly
    cron.schedule('0 10 * * 1', () => {
      this.checkHealthReminders();
    });
  }

  async checkVaccinationReminders() {
    try {
      const animals = this.getAnimals();
      const reminders = [];

      animals.forEach(animal => {
        if (!animal.ageMonths || animal.status !== 'approved') return;

        const age = animal.ageMonths;
        const breed = (animal.predictedBreed || '').toLowerCase();

        // Vaccination schedule based on age and breed
        if (age >= 3 && age <= 12) {
          reminders.push({
            animalId: animal.id,
            ownerName: animal.ownerName,
            type: 'vaccination',
            message: `${animal.predictedBreed || 'Animal'} needs primary vaccination series`,
            priority: 'high',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          });
        }

        if (age > 12 && age % 12 === 0) {
          reminders.push({
            animalId: animal.id,
            ownerName: animal.ownerName,
            type: 'vaccination',
            message: `${animal.predictedBreed || 'Animal'} needs annual vaccination`,
            priority: 'medium',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          });
        }

        // Pregnancy care for female animals
        if (animal.gender === 'female' && age >= 24) {
          reminders.push({
            animalId: animal.id,
            ownerName: animal.ownerName,
            type: 'health',
            message: `${animal.predictedBreed || 'Animal'} eligible for pregnancy care program`,
            priority: 'low',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
          });
        }
      });

      this.saveNotifications(reminders);
      console.log(`Generated ${reminders.length} vaccination reminders`);
    } catch (error) {
      console.error('Error checking vaccination reminders:', error);
    }
  }

  async checkHealthReminders() {
    try {
      const animals = this.getAnimals();
      const reminders = [];

      animals.forEach(animal => {
        if (animal.status !== 'approved') return;

        // General health check reminders
        reminders.push({
          animalId: animal.id,
          ownerName: animal.ownerName,
          type: 'health_check',
          message: `Schedule health check for ${animal.predictedBreed || 'animal'}`,
          priority: 'low',
          dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        });
      });

      this.saveNotifications(reminders);
      console.log(`Generated ${reminders.length} health reminders`);
    } catch (error) {
      console.error('Error checking health reminders:', error);
    }
  }

  getAnimals() {
    const animalsFile = path.join(__dirname, '..', 'data', 'animals.json');
    try {
      if (!fs.existsSync(animalsFile)) return [];
      return JSON.parse(fs.readFileSync(animalsFile, 'utf8'));
    } catch {
      return [];
    }
  }

  saveNotifications(newNotifications) {
    const notificationsFile = path.join(__dirname, '..', 'data', 'notifications.json');
    try {
      let existing = [];
      if (fs.existsSync(notificationsFile)) {
        existing = JSON.parse(fs.readFileSync(notificationsFile, 'utf8'));
      }
      
      const allNotifications = [...existing, ...newNotifications];
      fs.writeFileSync(notificationsFile, JSON.stringify(allNotifications, null, 2));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  getNotifications(userId, limit = 50) {
    const notificationsFile = path.join(__dirname, '..', 'data', 'notifications.json');
    try {
      if (!fs.existsSync(notificationsFile)) return [];
      const all = JSON.parse(fs.readFileSync(notificationsFile, 'utf8'));
      
      // Filter by user's animals (simplified - in real app, link to user's animals)
      return all.slice(0, limit);
    } catch {
      return [];
    }
  }

  markAsRead(notificationId) {
    const notificationsFile = path.join(__dirname, '..', 'data', 'notifications.json');
    try {
      if (!fs.existsSync(notificationsFile)) return;
      const notifications = JSON.parse(fs.readFileSync(notificationsFile, 'utf8'));
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n
      );
      fs.writeFileSync(notificationsFile, JSON.stringify(updated, null, 2));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
}

module.exports = NotificationService;
