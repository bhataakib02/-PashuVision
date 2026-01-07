/**
 * Reusable Error Banner Component
 * Displays errors consistently across all pages
 */
export default function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div style={{ 
      position: 'fixed',
      top: '60px', // Below fixed header
      left: 0,
      right: 0,
      zIndex: 999,
      padding: '12px 20px',
      backgroundColor: '#f44336', 
      borderBottom: '2px solid #c62828',
      color: '#ffffff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      animation: 'slideDown 0.3s ease-out'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <span style={{ fontSize: '20px' }}>❌</span>
          <strong style={{ fontSize: '15px', fontWeight: '600' }}>Error:</strong>
          <span style={{ fontSize: '14px' }}>{error}</span>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            style={{ 
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            ✕
          </button>
        )}
      </div>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

