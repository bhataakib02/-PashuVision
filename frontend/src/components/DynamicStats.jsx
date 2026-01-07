import { useState, useEffect } from 'react'

export default function DynamicStats() {
  const [stats, setStats] = useState({
    animalsRegistered: 10247,
    aiAccuracy: 94.7,
    activeUsers: 523,
    breedTypes: 47
  })

  useEffect(() => {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setStats(prevStats => ({
        animalsRegistered: prevStats.animalsRegistered + Math.floor(Math.random() * 5) + 1,
        aiAccuracy: Math.min(99.9, prevStats.aiAccuracy + (Math.random() - 0.5) * 0.2),
        activeUsers: prevStats.activeUsers + Math.floor(Math.random() * 3),
        breedTypes: prevStats.breedTypes + (Math.random() > 0.9 ? 1 : 0)
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--spacing-lg)',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-md)',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-5px)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'var(--color-primary-green)',
          fontFamily: 'Times New Roman, serif',
          marginBottom: 'var(--spacing-sm)'
        }}>
          {stats.animalsRegistered.toLocaleString()}+
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          fontFamily: 'Times New Roman, serif'
        }}>
          Animals Registered
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--color-success)',
          marginTop: 'var(--spacing-xs)',
          fontWeight: '500'
        }}>
          ↗️ Live Updates
        </div>
      </div>
      
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-md)',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-5px)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'var(--color-primary-blue)',
          fontFamily: 'Times New Roman, serif',
          marginBottom: 'var(--spacing-sm)'
        }}>
          {stats.aiAccuracy.toFixed(1)}%
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          fontFamily: 'Times New Roman, serif'
        }}>
          AI Accuracy Rate
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--color-success)',
          marginTop: 'var(--spacing-xs)',
          fontWeight: '500'
        }}>
          ↗️ Live Updates
        </div>
      </div>
      
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-md)',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-5px)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'var(--color-golden-yellow)',
          fontFamily: 'Times New Roman, serif',
          marginBottom: 'var(--spacing-sm)'
        }}>
          {stats.activeUsers.toLocaleString()}+
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          fontFamily: 'Times New Roman, serif'
        }}>
          Active Users
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--color-success)',
          marginTop: 'var(--spacing-xs)',
          fontWeight: '500'
        }}>
          ↗️ Live Updates
        </div>
      </div>
      
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-md)',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-5px)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'var(--color-brown)',
          fontFamily: 'Times New Roman, serif',
          marginBottom: 'var(--spacing-sm)'
        }}>
          {stats.breedTypes}+
        </div>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          fontFamily: 'Times New Roman, serif'
        }}>
          Breed Types
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--color-success)',
          marginTop: 'var(--spacing-xs)',
          fontWeight: '500'
        }}>
          ↗️ Live Updates
        </div>
      </div>
    </div>
  )
}


