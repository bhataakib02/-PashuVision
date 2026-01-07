import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import OTPLogin from './pages/OTPLogin.jsx'
import ARTrainingMode from './pages/ARTrainingMode.jsx'
import HelpSection from './pages/HelpSection.jsx'
import ExplainableAIHeatmap from './pages/ExplainableAIHeatmap.jsx'
import NFCScanning from './pages/NFCScanning.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Records from './pages/Records.jsx'
import RecordNew from './pages/RecordNew.jsx'
import Profile from './pages/Profile.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Scan from './pages/Scan.jsx'
import Notifications from './pages/Notifications.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminBreeds from './pages/AdminBreeds.jsx'
import AdminBreedImages from './pages/AdminBreedImages.jsx'

// Error component for 404 and other errors
function ErrorPage({ error, resetErrorBoundary }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h1 style={{ fontSize: '4rem', margin: '0 0 20px 0' }}>🚫</h1>
        <h2 style={{ fontSize: '2rem', margin: '0 0 20px 0', fontFamily: 'Times New Roman, serif' }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: '1.1rem', margin: '0 0 30px 0', opacity: 0.9 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: '#4CAF50',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🏠 Go to Dashboard
          </button>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: '#2196F3',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ← Go Back
          </button>
        </div>
        {error && (
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', fontSize: '14px', opacity: 0.8 }}>
              Technical Details
            </summary>
            <pre style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px',
              marginTop: '10px',
              overflow: 'auto'
            }}>
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <Login /> },
  { path: '/otp-login', element: <OTPLogin /> },
  { path: '/ar-training', element: <ARTrainingMode /> },
  { path: '/help', element: <HelpSection /> },
  { path: '/ai-heatmap', element: <ExplainableAIHeatmap /> },
  { path: '/nfc-scan', element: <NFCScanning /> },
  { path: '/register', element: <Register /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/records', element: <Records /> },
  { path: '/records/new', element: <RecordNew /> },
  { path: '/profile', element: <Profile /> },
  { path: '/forgot', element: <ForgotPassword /> },
  { path: '/reset', element: <ResetPassword /> },
  { path: '/scan', element: <Scan /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/admin/users', element: <AdminUsers /> },
  { path: '/admin/breeds', element: <AdminBreeds /> },
  { path: '/admin/breed-images', element: <AdminBreedImages /> },
  { path: '*', element: <ErrorPage /> }, // Catch-all route for 404
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
