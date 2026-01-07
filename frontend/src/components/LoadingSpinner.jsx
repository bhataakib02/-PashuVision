/**
 * Reusable Loading Spinner Component
 * Displays loading state consistently across all pages
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <div>{message}</div>
    </div>
  );
}

