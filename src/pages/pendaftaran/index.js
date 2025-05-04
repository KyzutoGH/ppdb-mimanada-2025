import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import FormStepper from '@/components/FormStepper'

export default function PendaftaranPage() {
  const router = useRouter()
  const [calonSiswaId, setCalonSiswaId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const storedId = localStorage.getItem('calonSiswaId')
    
    if (!isLoggedIn || !storedId) {
      router.push('/auth/login')
    } else {
      setCalonSiswaId(storedId)
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('calonSiswaId')
    localStorage.removeItem('nisn')
    fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <p>Memverifikasi sesi...</p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Logout
      </button>

      <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>Formulir Pendaftaran</h1>

      <FormStepper calonSiswaId={calonSiswaId} />
    </div>
  )
}