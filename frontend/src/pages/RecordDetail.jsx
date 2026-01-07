import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'

export default function RecordDetail() {
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (!id) { setError('No id provided'); return }
    fetch(`/api/animals/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => { if (!r.ok) throw new Error((await r.json()).error || 'Failed'); return r.json() })
      .then(setItem)
      .catch(e => setError(e.message || 'Error'))
  }, [])

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <h1>Record Detail</h1>
          {error && <div style={{ color: 'salmon' }}>{error}</div>}
          {!item ? (
            <div>Loading…</div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {(item.imageUrls || []).map((src, i) => (
                  <img key={i} src={src} alt={`img${i}`} style={{ width: '100%', borderRadius: 8 }} />
                ))}
              </div>
              <div className="stack">
                <div><strong>ID:</strong> {item.id}</div>
                <div><strong>Breed:</strong> {item.predictedBreed || '—'}</div>
                <div><strong>Owner:</strong> {item.ownerName || '—'}</div>
                <div><strong>Location:</strong> {item.location || '—'}</div>
                <div><strong>Status:</strong> {item.status || 'pending'}</div>
                {item.gps && <div><strong>GPS:</strong> {item.gps.lat}, {item.gps.lng}</div>}
                {item.capturedAt && <div><strong>Captured:</strong> {new Date(item.capturedAt).toLocaleString()}</div>}
                <div><strong>Notes:</strong> {item.notes || '—'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


