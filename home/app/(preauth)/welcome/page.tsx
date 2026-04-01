'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  // auto redirect ไป home หลัง 2.5 วิ
  useEffect(() => {
    const t = setTimeout(() => router.replace('/'), 2500)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 32px', background: '#fff',
    }}>

      {/* Success badge notification */}
      <div style={{
        position: 'absolute', top: 20, left: 16, right: 16,
        background: '#4CAF50', borderRadius: 12,
        padding: '12px 16px', display: 'flex',
        alignItems: 'center', gap: 10,
        boxShadow: '0 4px 16px rgba(76,175,80,.3)',
        animation: 'slideDown .4s ease',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: "'Sarabun', sans-serif", flex: 1 }}>
          เปิดใช้งานไบโอเมตริกซ์สำเร็จ
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </div>

      {/* Shield illustration */}
    <img
        src="/images/(preauth)/verification.svg"
        alt="Welcome"
        style={{ width: '100%', maxWidth: 240, objectFit: 'contain' }}
    />

      {/* Text */}
      <h2 style={{
        fontSize: 24, fontWeight: 800, color: '#111',
        margin: '24px 0 10px', textAlign: 'center',
        fontFamily: "'Sarabun', sans-serif",
      }}>
        ยินดีต้อนรับสู่ PEA Smart Plus!
      </h2>
      <p style={{
        fontSize: 15, color: '#666', textAlign: 'center',
        fontFamily: "'Sarabun', sans-serif", lineHeight: 1.7, margin: 0,
      }}>
        บัญชีผู้ใช้ของคุณได้รับการตั้งค่าอย่างปลอดภัย
        <br />และพร้อมใช้งานแล้ว
      </p>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  )
}