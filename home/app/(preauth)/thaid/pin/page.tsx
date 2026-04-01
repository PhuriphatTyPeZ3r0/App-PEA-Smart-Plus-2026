'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ThaidPinPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const maxPin = 8

  useEffect(() => {
    if (pin.length === maxPin) {
      setTimeout(() => router.push('/thaid/home'), 300)
    }
  }, [pin, router])

  const handleKey = (val: string) => {
    if (val === 'del') {
      setPin(p => p.slice(0, -1))
    } else if (pin.length < maxPin) {
      setPin(p => p + val)
    }
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','del']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ background: '#1e3080', height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ color: '#fff', fontSize: 24, cursor: 'pointer' }} onClick={() => router.back()}>‹</span>
      </div>

      <div style={{ flex: 1, background: '#fff', borderRadius: '24px 24px 0 0', padding: '28px 22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
        <div style={{ fontSize: 22, marginBottom: 6, letterSpacing: 3 }}>⁝⁝⁝</div>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 4 }}>ระบุรหัสผ่าน</p>

        {/* PIN dots */}
        <div style={{ display: 'flex', gap: 14, margin: '16px 0' }}>
          {Array.from({ length: maxPin }).map((_, i) => (
            <span key={i} style={{
              width: 13, height: 13, borderRadius: '50%',
              border: '2px solid #9CA3AF',
              display: 'inline-block',
              background: i < pin.length ? '#1e3080' : 'transparent',
              borderColor: i < pin.length ? '#1e3080' : '#9CA3AF',
              transition: 'all .15s'
            }} />
          ))}
        </div>

        <div style={{ width: '75%', height: 2, background: '#1e3080', marginBottom: 20 }} />

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px 14px', width: '100%' }}>
          {keys.map((k, i) => (
            <button key={i} onClick={() => k && handleKey(k)}
              style={{
                height: 60, borderRadius: 12, border: 'none',
                background: k ? '#F5F5F5' : 'transparent',
                fontSize: k === 'del' ? 20 : 24, fontWeight: 600,
                cursor: k ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#111'
              }}>
              {k === 'del' ? '⌫' : k}
            </button>
          ))}
        </div>

        <p style={{ color: '#1e3080', fontSize: 14, fontWeight: 600, marginTop: 14, cursor: 'pointer' }}>ลืมรหัสผ่าน</p>
      </div>
    </div>
  )
}
