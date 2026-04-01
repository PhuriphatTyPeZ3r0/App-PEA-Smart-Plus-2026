'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ThaidLoadingPage() {
  const router = useRouter()
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowQR(true), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background: '#E8EDF5', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Browser bar */}
      <div style={{ background: '#F0F4FA', padding: '10px 12px 8px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: '7px 12px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
          <span style={{ fontSize: 12, color: '#555' }}>🔒 imauth.bora.dopa.go.th</span>
        </div>
        <span style={{ fontSize: 18, color: '#555' }}>↻</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ width: '100%', background: 'linear-gradient(135deg,#1a2d8a,#0D1B6E)', borderRadius: 20, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
          <p style={{ fontSize: 22, fontWeight: 300, fontFamily: 'serif', marginBottom: 3 }}>เข้าสู่ระบบ</p>
          <p style={{ fontSize: 13, opacity: .8, marginBottom: 14 }}>ด้วย ThaID</p>

          {!showQR ? (
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid rgba(255,255,255,.2)', borderTopColor: '#fff', animation: 'spin 1s linear infinite' }} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, opacity: .85, marginBottom: 10 }}>แอปพลิเคชัน PEA Smart Plus</p>
              <div style={{ background: '#fff', borderRadius: 12, padding: 10, width: 140, margin: '0 auto' }}>
                <svg viewBox="0 0 100 100" width="120" height="120" style={{ display: 'block' }}>
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="30" height="30" fill="#111" rx="3" />
                  <rect x="8" y="8" width="24" height="24" fill="white" rx="2" />
                  <rect x="11" y="11" width="18" height="18" fill="#111" rx="1" />
                  <rect x="65" y="5" width="30" height="30" fill="#111" rx="3" />
                  <rect x="68" y="8" width="24" height="24" fill="white" rx="2" />
                  <rect x="71" y="11" width="18" height="18" fill="#111" rx="1" />
                  <rect x="5" y="65" width="30" height="30" fill="#111" rx="3" />
                  <rect x="8" y="68" width="24" height="24" fill="white" rx="2" />
                  <rect x="11" y="71" width="18" height="18" fill="#111" rx="1" />
                  <rect x="42" y="5" width="5" height="5" fill="#111" rx="1" />
                  <rect x="50" y="5" width="5" height="5" fill="#111" rx="1" />
                  <rect x="58" y="5" width="5" height="5" fill="#111" rx="1" />
                  <rect x="42" y="50" width="5" height="5" fill="#111" rx="1" />
                  <rect x="50" y="50" width="5" height="5" fill="#111" rx="1" />
                  <rect x="5" y="42" width="5" height="5" fill="#111" rx="1" />
                  <rect x="42" y="42" width="5" height="5" fill="#111" rx="1" />
                </svg>
              </div>
              <p style={{ fontSize: 11, opacity: .7, marginTop: 10 }}>สแกน QR Code ด้วยแอป ThaID</p>
              <button onClick={() => router.push('/thaid/splash')}
                style={{ marginTop: 14, background: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.4)', borderRadius: 20, padding: '8px 22px', fontFamily: "'Sarabun',sans-serif", fontSize: 13, cursor: 'pointer' }}>
                เปิดแอป ThaID →
              </button>
            </div>
          )}

          <p style={{ fontSize: 12, opacity: .85, lineHeight: 1.6, textAlign: 'center', marginTop: 20 }}>คิวอาร์โค้ดนี้เป็นสิ่งยืนยันตนทางดิจิทัล ออกให้โดย<br />กรมการปกครอง กระทรวงมหาดไทย</p>
          <p style={{ fontSize: 10, opacity: .5, marginTop: 6 }}>v.1.2.1</p>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ background: '#F0F4FA', padding: '10px 24px 28px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 22, opacity: .3 }}>‹</span>
        <span style={{ fontSize: 22, opacity: .3 }}>›</span>
        <span style={{ fontSize: 22 }}>⬆</span>
        <span style={{ fontSize: 22 }}>📖</span>
        <span style={{ fontSize: 22 }}>⧉</span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
