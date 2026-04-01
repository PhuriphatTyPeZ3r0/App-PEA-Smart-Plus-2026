'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PinEnterPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [pressed, setPressed] = useState<string | null>(null)
  const maxPin = 6

  useEffect(() => {
    if (pin.length === maxPin) {
      setTimeout(() => router.push('/pin-confirm'), 300)
    }
  }, [pin, router])

  const handleKey = (val: string) => {
    setPressed(val)
    setTimeout(() => setPressed(null), 150)
    if (val === 'del') {
      setPin(p => p.slice(0, -1))
    } else if (pin.length < maxPin) {
      setPin(p => p + val)
    }
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','del']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
      <div className="sb lt" style={{ width: '100%', flexShrink: 0 }}>
        <span /><div className="sb-r" />
      </div>

      <div style={{ width: '100%', padding: '4px 6px 0', flexShrink: 0 }}>
        <div className="bk" onClick={() => router.back()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
      </div>

      {/* Logo */}
      <div style={{ margin: '20px 0 6px', textAlign: 'center', flexShrink: 0 }}>
        <img
          src="/images/(preauth)/pea-logo.png"
          alt="PEA Logo"
          style={{ width: 80, height: 40, objectFit: 'contain', display: 'block', margin: '0 auto' }}
        />
      </div>

      <p style={{ fontSize: 16, fontWeight: 600, color: '#333', flexShrink: 0, margin: '12px 0 0' }}>
        ใส่รหัส PIN 6 หลัก
      </p>

      {/* Dots */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 16, margin: '16px 0' }}>
        {Array.from({ length: maxPin }).map((_, i) => (
          <div key={i}
            style={{
              width: 16, height: 16, borderRadius: '50%',
              border: '2px solid',
              borderColor: i < pin.length ? '#8B1A6B' : '#CCC',
              background: i < pin.length ? '#8B1A6B' : '#fff',
              transition: 'all .15s'
            }}
          />
        ))}
      </div>

      {/* Keypad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px 4px', width: '100%', padding: '0 18px', flexShrink: 0 }}>
        {keys.map((k, i) => (
          <button key={i} onClick={() => k && handleKey(k)}
            style={{
              height: 72, borderRadius: 14, border: 'none',
              background: pressed === k && k ? 'rgba(139,26,107,0.12)' : 'transparent',
              fontSize: k === 'del' ? 22 : 28, fontWeight: 500,
              cursor: k ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#111', fontFamily: "'Sarabun', sans-serif",
              transition: 'background .1s',
              WebkitTapHighlightColor: 'transparent',
            }}>
            {k === 'del' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            ) : k}
          </button>
        ))}
      </div>

      <p style={{ color: '#8B1A6B', fontSize: 14, fontWeight: 700, marginTop: 18, cursor: 'pointer', flexShrink: 0 }}>
        ลืมรหัส PIN?
      </p>
    </div>
  )
}
