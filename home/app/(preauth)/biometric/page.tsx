'use client'
import { useRouter } from 'next/navigation'

export default function BiometricPage() {
  const router = useRouter()

  const goWelcome = () => router.push('/welcome')

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 32px 48px', background: '#fff',
    }}>

      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
        src="/images/(preauth)/biometric.svg"
        alt="Biometric"
        style={{ width: '100%', maxWidth: 320, objectFit: 'contain' }}
        />
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{
          fontSize: 22, fontWeight: 800, color: '#111',
          margin: '0 0 10px', fontFamily: "'Sarabun', sans-serif",
        }}>
          ยินยอมให้เข้าถึงไบโอเมตริกซ์
        </h2>
        <p style={{
          fontSize: 14, color: '#666', margin: 0,
          fontFamily: "'Sarabun', sans-serif", lineHeight: 1.6,
        }}>
          เข้าสู่ระบบได้เร็วขึ้นและปลอดภัยยิ่งขึ้น
        </p>
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={goWelcome}
          style={{
            width: '100%', height: 56, borderRadius: 28, border: 'none',
            background: 'linear-gradient(135deg,#C4307A,#8B1A6B)',
            color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Sarabun', sans-serif",
            boxShadow: '0 6px 20px rgba(139,26,107,.3)',
          }}
        >
          ตั้งค่าไบโอเมตริกซ์
        </button>
        <button
          onClick={goWelcome}
          style={{
            width: '100%', height: 56, borderRadius: 28,
            border: '2px solid #C4307A', background: 'transparent',
            color: '#C4307A', fontSize: 17, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Sarabun', sans-serif",
          }}
        >
          ทำภายหลัง
        </button>
      </div>
    </div>
  )
}