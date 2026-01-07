import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [region, setRegion] = useState('')
  const [language, setLanguage] = useState('')
  const [photo, setPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error || 'Failed')
        return r.json()
      })
      .then(p => {
        setProfile(p)
        setName(p.name || '')
        setEmail(p.email || '')
        setPhone(p.phone || '')
        setRegion(p.region || '')
        setLanguage(p.language || '')
      })
      .catch(e => setError(e.message || 'Error'))
  }, [])

  const onSave = async () => {
    const token = localStorage.getItem('token')
    if (!token) return setError('Login required')
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('phone', phone)
      fd.append('region', region)
      fd.append('language', language)
      if (photo) fd.append('photo', photo)
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      let data = null
      try { data = await res.json() } catch {}
      if (!res.ok) throw new Error((data && data.error) || 'Save failed')
      setProfile(data)
      localStorage.setItem('user', JSON.stringify({ ...(JSON.parse(localStorage.getItem('user')||'{}')), name: data.name }))
      setSuccess('✅ Profile updated successfully!')
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError(e.message || 'Failed to update profile')
      setSuccess('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <h1>My Profile</h1>
          {error && <div style={{ color: 'salmon', padding: '12px', marginBottom: '12px', backgroundColor: '#ffe6e6', borderRadius: '6px', border: '1px solid #ff9999' }}>{error}</div>}
          {success && <div style={{ color: '#4CAF50', padding: '12px', marginBottom: '12px', backgroundColor: '#e8f5e9', borderRadius: '6px', border: '1px solid #81c784' }}>{success}</div>}
          <div className="grid" style={{ gridTemplateColumns: '220px 1fr' }}>
            <div className="stack">
              {profile?.photoUrl ? (
                <img src={profile.photoUrl} alt="avatar" style={{ width: 200, height: 200, borderRadius: 12, objectFit: 'cover', border: '2px solid #ddd' }} />
              ) : (
                <div style={{ width: 200, height: 200, borderRadius: 12, background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: '#999' }}>
                  👤
                </div>
              )}
              <label style={{ marginTop: '10px', fontSize: '14px', fontWeight: '500' }}>Profile Photo</label>
              <input className="file" type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />
              {photo && <small style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>Selected: {photo.name}</small>}
            </div>
            <div className="stack">
              <div className="stack">
                <label>Name *</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="stack">
                <label>Email *</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com" disabled />
                <small style={{ color: '#666', fontSize: '12px' }}>Email cannot be changed</small>
              </div>
              <div className="stack">
                <label>Phone</label>
                <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="stack">
                <label>Region</label>
                <input className="input" value={region} onChange={e => setRegion(e.target.value)} placeholder="Your region or location" />
              </div>
              <div className="stack">
                <label>Language</label>
                <input className="input" value={language} onChange={e => setLanguage(e.target.value)} placeholder="en" />
              </div>
              <div>
                <button className="btn" disabled={saving} onClick={onSave}>{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


