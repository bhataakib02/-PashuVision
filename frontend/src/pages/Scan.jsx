import Header from '../components/Header.jsx'
import Layout from '../components/Layout.jsx'
import { useEffect, useRef, useState } from 'react'

export default function Scan() {
  const videoRef = useRef(null)
  const [manualId, setManualId] = useState('')
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scannedId, setScannedId] = useState('')
  const qrScannerRef = useRef(null)

  useEffect(() => {
    // Load QR Scanner library
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.umd.min.js'
    script.async = true
    script.onload = () => {
      if (window.QrScanner) {
        startScanning()
      } else {
        setError('QR Scanner library failed to load. Please use manual ID entry.')
      }
    }
    script.onerror = () => {
      setError('QR Scanner library failed to load. Please use manual ID entry.')
    }
    document.head.appendChild(script)

    return () => {
      stopScanning()
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      if (!window.QrScanner) {
        setError('QR Scanner not available. Please use manual ID entry.')
        return
      }

      const video = videoRef.current
      if (!video) return

      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera()
      if (!hasCamera) {
        setError('No camera found. Please use manual ID entry.')
        return
      }

      setError('')
      setScanning(true)

      qrScannerRef.current = new QrScanner(
        video,
        (result) => {
          const scannedValue = result.data || result
          const id = scannedValue.startsWith('animal:') ? scannedValue.slice(7) : scannedValue
          setScannedId(id)
          setScanning(false)
          stopScanning()
          
          // Navigate to record
          setTimeout(() => {
            window.location.href = `/records?id=${encodeURIComponent(id)}`
          }, 500)
        },
        {
          returnDetailedScanResult: true,
          preferredCamera: 'environment'
        }
      )

      await qrScannerRef.current.start()
    } catch (err) {
      console.error('Scan error:', err)
      setError(err.message || 'Camera access denied. Please use manual ID entry.')
      setScanning(false)
    }
  }

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop()
      qrScannerRef.current.destroy()
      qrScannerRef.current = null
    }
    setScanning(false)
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualId.trim()) {
      setError('Please enter an Animal ID')
      return
    }
    window.location.href = `/records?id=${encodeURIComponent(manualId.trim())}`
  }

  return (
    <Layout>
      <div className="container" style={{ paddingTop: '80px' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e9ecef'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '12px'
            }}>
              📱
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Scan QR Code
            </h1>
            <p style={{
              color: '#6c757d',
              margin: '8px 0 0 0',
              fontSize: '1rem'
            }}>
              Scan a QR code or enter Animal ID manually
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #ffcdd2',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {scannedId && (
            <div style={{
              background: '#e8f5e9',
              color: '#2e7d32',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #c8e6c9',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <span>✅</span>
              <span>Scanned ID: <strong>{scannedId}</strong></span>
            </div>
          )}

          {/* Video Scanner */}
          <div style={{
            position: 'relative',
            width: '100%',
            marginBottom: '24px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#000',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: 'auto',
                display: scanning ? 'block' : 'none'
              }}
              muted
              playsInline
            />
            {!scanning && (
              <div style={{
                color: '#fff',
                textAlign: 'center',
                padding: '40px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                <div style={{ fontSize: '16px', opacity: 0.8 }}>
                  Camera will start when scanning begins
                </div>
              </div>
            )}
            
            {/* Scanning Overlay */}
            {scanning && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                border: '3px solid #4CAF50',
                borderRadius: '12px',
                pointerEvents: 'none',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
              }} />
            )}
          </div>

          {/* Control Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            justifyContent: 'center'
          }}>
            {!scanning ? (
              <button
                onClick={startScanning}
                className="btn"
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)'
                }}
              >
                🎥 Start Scanning
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="btn"
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 16px rgba(244, 67, 54, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.3)'
                }}
              >
                ⏹️ Stop Scanning
              </button>
            )}
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            gap: '12px'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              background: '#e9ecef'
            }} />
            <span style={{
              color: '#6c757d',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              OR
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: '#e9ecef'
            }} />
          </div>

          {/* Manual ID Entry */}
          <form onSubmit={handleManualSubmit}>
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <input
                type="text"
                className="input"
                placeholder="Enter Animal ID manually"
                value={manualId}
                onChange={(e) => {
                  setManualId(e.target.value)
                  setError('')
                }}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e9ecef',
                  fontFamily: 'Times New Roman, serif',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea'
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="submit"
                className="btn"
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                🔍 Open Record
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div style={{
            background: '#f8f9fa',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            color: '#6c757d',
            lineHeight: '1.6'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
              💡 How to use:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Click "Start Scanning" to activate your camera</li>
              <li>Point your camera at a QR code</li>
              <li>Or enter the Animal ID manually in the field above</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}
