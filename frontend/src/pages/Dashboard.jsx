import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { useEffect, useState } from 'react'
import ErrorBanner from '../components/ErrorBanner.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    approved: 0, 
    rejected: 0, 
    breeds: {},
    todayRegistered: 0,
    totalUsers: 0,
    recentAnimals: []
  })
  const [location, setLocation] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Login required')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Fetch animals data
      const animalsRes = await fetch('/api/animals', { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      
      const animalsData = await animalsRes.json().catch(() => [])
      
      let animals = []
      if (animalsRes.ok) {
        animals = animalsData
      } else {
        // Fallback to empty array if API fails
        animals = []
      }

      // Calculate statistics
      const total = animals.length
      const pending = animals.filter(a => a.status === 'pending').length
      const approved = animals.filter(a => a.status === 'approved').length
      const rejected = animals.filter(a => a.status === 'rejected').length
      const todayRegistered = animals.filter(a => {
        const created = new Date(a.createdAt || a.capturedAt)
        const today = new Date()
        return created.toDateString() === today.toDateString()
      }).length

      // Breed distribution
      const breeds = {}
      animals.forEach(animal => {
        const breed = animal.predictedBreed || animal.breed || 'Unknown'
        breeds[breed] = (breeds[breed] || 0) + 1
      })

      // Recent animals (last 5)
      const recentAnimals = animals
        .sort((a, b) => new Date(b.createdAt || b.capturedAt) - new Date(a.createdAt || a.capturedAt))
        .slice(0, 5)

      // If admin, fetch user stats
      let totalUsers = 0
      if (user?.role === 'admin') {
        try {
          const usersRes = await fetch('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        })
          if (usersRes.ok) {
            const usersData = await usersRes.json()
            totalUsers = usersData.users?.length || usersData.length || 0
          }
        } catch (err) {
          console.error('Failed to fetch users:', err)
        }
      }

      setStats({
        total,
        pending,
        approved,
        rejected,
        breeds,
        todayRegistered,
        totalUsers,
        recentAnimals
      })
      setLastUpdated(new Date())
    } catch (err) {
      const errorMsg = err.message || 'Failed to load dashboard data'
      setError(errorMsg)
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000)

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          })
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }

    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const renderUserDashboard = () => (
    <div className="card" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(0,0,0,0.05)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e9ecef'
      }}>
              <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p style={{ color: '#6c757d', margin: '8px 0 0 0', fontSize: '1.1rem' }}>
            Here's your overview today
                </p>
              </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
            padding: '8px 16px',
            borderRadius: '12px',
            background: isOnline ? '#d4edda' : '#f8d7da',
            color: isOnline ? '#155724' : '#721c24',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
                }}>
            {isOnline ? '🟢' : '🔴'} {isOnline ? 'Online' : 'Offline'}
                </div>
          <button
            onClick={fetchDashboardData}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            🔄 Refresh
          </button>
              </div>
            </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <Link
          to="/records/new"
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)'
          }}
        >
          <div style={{ fontSize: '32px' }}>📷</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>New Record</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Capture animal</div>
              </Link>

        <Link
          to="/records"
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(245, 87, 108, 0.3)',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 8px 24px rgba(245, 87, 108, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 16px rgba(245, 87, 108, 0.3)'
          }}
        >
          <div style={{ fontSize: '32px' }}>📋</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>My Records</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>View all</div>
              </Link>

        <Link
          to="/scan"
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(79, 172, 254, 0.3)',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 8px 24px rgba(79, 172, 254, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 16px rgba(79, 172, 254, 0.3)'
          }}
        >
          <div style={{ fontSize: '32px' }}>📱</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Scan QR</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Quick access</div>
              </Link>
            </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Animals</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
            {loading ? '...' : stats.total}
                </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>All records</div>
              </div>

        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          boxShadow: '0 4px 16px rgba(245, 87, 108, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Today's Records</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
            {loading ? '...' : stats.todayRegistered}
                </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Registered today</div>
              </div>

        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          boxShadow: '0 4px 16px rgba(79, 172, 254, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Approved</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
            {loading ? '...' : stats.approved}
                </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Verified records</div>
              </div>

        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          boxShadow: '0 4px 16px rgba(67, 233, 123, 0.3)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Pending</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
            {loading ? '...' : stats.pending}
                </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Awaiting review</div>
              </div>
            </div>

      {/* Recent Animals */}
      {stats.recentAnimals.length > 0 && (
                <div style={{ 
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            📋 Recent Records
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentAnimals.map((animal, index) => (
              <div
                key={animal.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: index % 2 === 0 ? '#f8f9fa' : 'white',
                  border: '1px solid #e9ecef',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e9ecef'
                  e.target.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = index % 2 === 0 ? '#f8f9fa' : 'white'
                  e.target.style.transform = 'translateX(0)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {animal.ownerName || 'Unknown Owner'}
                    </div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>
                    {animal.predictedBreed || 'Unknown Breed'} • {animal.location || 'No location'}
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: animal.status === 'approved' ? '#d4edda' : 
                              animal.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                  color: animal.status === 'approved' ? '#155724' : 
                        animal.status === 'rejected' ? '#721c24' : '#856404',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {animal.status?.toUpperCase() || 'PENDING'}
                </div>
              </div>
            ))}
          </div>
            </div>
      )}
          </div>
        )

  const renderAdminDashboard = () => (
    <div className="card" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(0,0,0,0.05)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e9ecef'
      }}>
              <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: 0,
            background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
                  👑 Admin Dashboard
                </h1>
          <p style={{ color: '#6c757d', margin: '8px 0 0 0', fontSize: '1.1rem' }}>
            System overview and management
                </p>
              </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px 16px',
            borderRadius: '12px',
            background: isOnline ? '#d4edda' : '#f8d7da',
            color: isOnline ? '#155724' : '#721c24',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isOnline ? '🟢' : '🔴'} {isOnline ? 'Online' : 'Offline'}
          </div>
                <button 
                  onClick={fetchDashboardData}
                  style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
              transition: 'transform 0.2s'
                  }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

      {/* Admin Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <Link
          to="/admin/users"
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
            color: 'white',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(156, 39, 176, 0.3)',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 8px 24px rgba(156, 39, 176, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 16px rgba(156, 39, 176, 0.3)'
          }}
        >
          <div style={{ fontSize: '36px' }}>👥</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Manage Users</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>User management</div>
              </Link>

        <Link
          to="/admin/breeds"
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
            color: 'white',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(255, 87, 34, 0.3)',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 8px 24px rgba(255, 87, 34, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 16px rgba(255, 87, 34, 0.3)'
          }}
        >
          <div style={{ fontSize: '36px' }}>🐄</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Breed Database</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Manage breeds</div>
              </Link>

        <Link
          to="/records"
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
            color: 'white',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)'
            e.target.style.boxShadow = '0 8px 24px rgba(33, 150, 243, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 16px rgba(33, 150, 243, 0.3)'
          }}
        >
          <div style={{ fontSize: '36px' }}>📋</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>All Records</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>View all animals</div>
              </Link>
            </div>

      {/* Admin Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '24px',
          borderRadius: '16px',
                background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                color: 'white',
          boxShadow: '0 4px 16px rgba(156, 39, 176, 0.3)'
              }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Users</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {loading ? '...' : stats.totalUsers}
                </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Registered users</div>
              </div>
              
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
              }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Animals</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {loading ? '...' : stats.total}
                </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>All records</div>
              </div>
              
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
          boxShadow: '0 4px 16px rgba(79, 172, 254, 0.3)'
              }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Approved</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {loading ? '...' : stats.approved}
                </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Verified records</div>
              </div>
              
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
          boxShadow: '0 4px 16px rgba(245, 87, 108, 0.3)'
              }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Pending</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' }}>
            {loading ? '...' : stats.pending}
                </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Awaiting review</div>
              </div>
            </div>

            {/* Breed Distribution */}
      {Object.keys(stats.breeds).length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            🐄 Breed Distribution
              </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            {Object.entries(stats.breeds)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([breed, count]) => (
                <div
                  key={breed}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    border: '1px solid #dee2e6',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{breed}</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                    {count}
                  </div>
                </div>
              ))}
              </div>
            </div>
      )}

      {/* Recent Animals */}
      {stats.recentAnimals.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
            📋 Recent Records
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentAnimals.map((animal, index) => (
              <div
                key={animal.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: index % 2 === 0 ? '#f8f9fa' : 'white',
                  border: '1px solid #e9ecef',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e9ecef'
                  e.target.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = index % 2 === 0 ? '#f8f9fa' : 'white'
                  e.target.style.transform = 'translateX(0)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {animal.ownerName || 'Unknown Owner'}
                </div>
                  <div style={{ fontSize: '14px', color: '#6c757d' }}>
                    {animal.predictedBreed || 'Unknown Breed'} • {animal.location || 'No location'}
              </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: animal.status === 'approved' ? '#d4edda' : 
                              animal.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                  color: animal.status === 'approved' ? '#155724' : 
                        animal.status === 'rejected' ? '#721c24' : '#856404',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {animal.status?.toUpperCase() || 'PENDING'}
                </div>
              </div>
            ))}
                      </div>
                </div>
              )}
          </div>
        )

  return (
    <Layout>
      <div className="container" style={{ paddingTop: '80px' }}>
        <ErrorBanner error={error} onDismiss={() => setError('')} />
        
        {loading && <LoadingSpinner message="Loading dashboard..." />}
        
        {!loading && (
          <>
            {user?.role === 'admin' ? renderAdminDashboard() : renderUserDashboard()}
            
            {/* Location Display */}
            {location && (
              <div className="card" style={{
                marginTop: '24px',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📍</span>
                  <h3 style={{ margin: 0 }}>Current Location</h3>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                  <span style={{ marginLeft: '12px' }}>
                    Accuracy: ±{Math.round(location.accuracy)}m
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
