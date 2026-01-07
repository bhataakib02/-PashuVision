import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return setError('Login required')
    
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setNotifications)
      .catch(e => setError(e.message || 'Failed to load notifications'))
  }, [])

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token')
    try {
      await fetch(`/api/notifications/${id}/read`, { 
        method: 'POST', 
        headers: { Authorization: `Bearer ${token}` } 
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (e) {
      console.error('Failed to mark as read:', e)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff6b6b'
      case 'medium': return '#ffa500'
      case 'low': return '#11a36a'
      default: return 'var(--color-muted)'
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <h1>Notifications & Reminders</h1>
          {error && <div style={{ color: 'salmon' }}>{error}</div>}
          
          {notifications.length === 0 ? (
            <div style={{ color: 'var(--color-muted)', textAlign: 'center', padding: 20 }}>
              No notifications yet. Reminders are generated automatically based on animal records.
            </div>
          ) : (
            <div className="stack">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className="card" 
                  style={{ 
                    opacity: notification.read ? 0.7 : 1,
                    borderLeft: `4px solid ${getPriorityColor(notification.priority)}`
                  }}
                >
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="stack" style={{ flex: 1 }}>
                      <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                        <span style={{ 
                          background: getPriorityColor(notification.priority), 
                          color: 'white', 
                          padding: '2px 8px', 
                          borderRadius: 4, 
                          fontSize: 12 
                        }}>
                          {notification.priority}
                        </span>
                        <span style={{ color: 'var(--color-muted)', fontSize: 14 }}>
                          {notification.type}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600 }}>{notification.message}</div>
                      <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
                        Owner: {notification.ownerName} • Animal: {notification.animalId}
                      </div>
                      {notification.dueDate && (
                        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
                          Due: {new Date(notification.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <button 
                        className="btn secondary" 
                        onClick={() => markAsRead(notification.id)}
                        style={{ fontSize: 12 }}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
