import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export default function Header() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [user, setUser] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser(payload)
      } catch {
        localStorage.removeItem('token')
      }
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const getRoleBasedLinks = () => {
    if (!user) return []
    
    const baseLinks = [
      { to: '/dashboard', label: t('nav.dashboard'), icon: '📊' },
      { to: '/records', label: t('nav.records'), icon: '📋' },
      { to: '/records/new', label: 'New Record', icon: '➕' },
      { to: '/scan', label: 'Scan QR', icon: '📱' }
    ]

    const commonLinks = [
      { to: '/notifications', label: 'Notifications', icon: '🔔' },
      { to: '/profile', label: 'Profile', icon: '👤' },
      { to: '/help', label: 'Help', icon: '❓' }
    ]

    // Only user and admin roles
    if (user.role === 'admin') {
      return [
        ...baseLinks,
        { to: '/admin/users', label: 'Users', icon: '👥' },
        { to: '/admin/breeds', label: 'Breeds', icon: '🐄' },
        { to: '/admin/breed-images', label: 'Breed Images', icon: '🖼️' },
        ...commonLinks
      ]
    }
    
    // Regular user
    return [...baseLinks, ...commonLinks]
  }

  return (
    <header style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--glass-border)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'Times New Roman, serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-xs)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, var(--color-primary-green), var(--color-primary-blue))',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman, serif'
          }}>
            B
          </div>
          <div>
            <div className="brand-logo" style={{ 
              fontSize: '1.2rem', 
              margin: 0,
              fontFamily: 'Times New Roman, serif',
              fontWeight: 'bold'
            }}>
                            PashuVision
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-sm)',
          fontFamily: 'Times New Roman, serif',
          flex: 1,
          justifyContent: 'flex-start'
        }} className="desktop-nav">
          {/* Language Selector */}
          <select 
            value={i18n.language} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ 
              background: 'var(--color-bg-primary)', 
              color: 'var(--color-text-primary)', 
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: '500',
              fontFamily: 'Times New Roman, serif',
              minWidth: '80px'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ur">اردو</option>
          </select>

          {/* Role-based Navigation */}
          {getRoleBasedLinks().map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'Times New Roman, serif',
                transition: 'all 0.3s ease',
                border: '2px solid transparent',
                backgroundColor: 'transparent',
                whiteSpace: 'nowrap',
                minHeight: '36px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--color-bg-secondary)'
                e.target.style.borderColor = 'var(--color-primary-green)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.borderColor = 'transparent'
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* User Section */}
          {!user ? (
            <Link 
              to="/login" 
              className="btn"
              style={{ textDecoration: 'none' }}
            >
              {t('nav.login')}
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                background: user.role === 'admin' ? '#9C27B0' : '#2196F3',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {user.role}
              </div>
              <span style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {user.name}
              </span>
              <button 
                className="btn secondary" 
                onClick={logout}
                style={{ 
                  fontSize: '12px', 
                  padding: '6px 10px',
                  minHeight: '32px',
                  fontFamily: 'Times New Roman, serif'
                }}
              >
                {t('nav.logout')}
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="mobile-menu-btn"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px',
            fontFamily: 'Times New Roman, serif',
            fontWeight: 'bold',
            color: 'var(--color-text-primary)'
          }}
        >
          Menu
        </button>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="mobile-nav-menu" style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          borderTop: '1px solid var(--glass-border)',
          padding: 'var(--spacing-sm)'
        }}>
          <div className="stack" style={{ gap: 'var(--spacing-xs)' }}>
            {/* Language Selector */}
            <select 
              value={i18n.language} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="select"
              style={{ 
                fontFamily: 'Times New Roman, serif',
                fontSize: '14px',
                padding: '8px',
                width: '100%'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ur">اردو</option>
            </select>

            {/* Mobile Links */}
            {getRoleBasedLinks().map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="btn outline"
                style={{ 
                  textDecoration: 'none', 
                  justifyContent: 'flex-start', 
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '14px',
                  padding: '10px 12px',
                  width: '100%'
                }}
                onClick={() => setShowMobileMenu(false)}
              >
                <span style={{ fontSize: '12px', fontWeight: 'bold', marginRight: '8px' }}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Mobile User Section */}
            {user && (
              <div style={{ 
                padding: 'var(--spacing-sm)', 
                background: 'var(--color-bg-secondary)', 
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--spacing-sm)'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                  {user.name}
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  background: user.role === 'admin' ? '#9C27B0' : '#2196F3',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  {user.role}
                </div>
                <button 
                  className="btn error" 
                  onClick={logout}
                  style={{ width: '100%' }}
                >
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}


