'use client'
import { useRouter } from 'next/navigation'

export default function PinSetupPage() {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Status bar */}
      <div className="sb lt" style={{ flexShrink: 0 }}>
        <span />
        <div className="sb-r" />
      </div>

      {/* Illustration */}
      <div style={{ flexShrink: 0, height: 340, background: 'linear-gradient(180deg,#F5D8EE 0%,#fff 70%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Bubble icons */}
        <div style={{ position: 'absolute', top: 28, left: 22, width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#3DD6B5,#22B89E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 4px 16px rgba(0,0,0,.15)', zIndex: 5 }}>🔐</div>
        <div style={{ position: 'absolute', top: 28, right: 22, width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#4D90FE,#2C6FE8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 4px 16px rgba(0,0,0,.15)', zIndex: 5 }}>👆</div>
        <div style={{ position: 'absolute', bottom: 60, left: 20, width: 58, height: 58, borderRadius: '50%', background: 'linear-gradient(135deg,#C430A0,#8B1A6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 4px 16px rgba(0,0,0,.15)', zIndex: 5 }}>🆔</div>

        {/* Person illustration */}
        <div style={{ position: 'relative', zIndex: 2, width: 170, height: 210, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          {/* Head */}
          <div style={{ position: 'absolute', width: 68, height: 68, borderRadius: '50%', background: '#FDDCC8', bottom: 104, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
            <div style={{ position: 'absolute', top: -8, left: -6, width: 80, height: 46, borderRadius: '50% 50% 0 0', background: '#1a1a1a', zIndex: 4 }} />
          </div>
          {/* Body */}
          <div style={{ width: 160, height: 165, background: 'linear-gradient(180deg,#F8B0D8,#C4308A)', borderRadius: '50% 50% 40% 40% / 30% 30% 60% 60%', zIndex: 2, position: 'relative' }}>
            {/* Arm */}
            <div style={{ position: 'absolute', right: -18, bottom: 36, width: 58, height: 76, background: 'linear-gradient(160deg,#FDDCC8,#F4B899)', borderRadius: '10px 28px 28px 10px', zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 10 }}>
              <span style={{ fontSize: 22, opacity: .5 }}>☞</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 24px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 23, fontWeight: 800, color: '#111', marginBottom: 10 }}>เหลืออีกขั้นตอนเดียว ! กรุณาตั้งรหัส PIN และไบโอเมตริกซ์</h2>
        <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6 }}>
          เข้าถึงบัญชีได้ง่ายและปลอดภัยยิ่งขึ้นเมื่อเปิดใช้งานการเข้า<br />สู่ระบบด้วย PIN หรือไบโอเมตริกซ์
        </p>
      </div>

      <div style={{ padding: '14px 20px 32px', flexShrink: 0 }}>
        <button
          onClick={() => router.push('/pin-enter')}
          style={{
            width: '100%', height: 56,
            background: 'linear-gradient(135deg,#C4307A,#8B1A6B)',
            color: '#fff',
            border: 'none', borderRadius: 28,
            fontFamily: "'Sarabun', sans-serif",
            fontSize: 18, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(139,26,107,.35)',
            letterSpacing: '.3px',
            transition: 'all 0.2s',
          }}
        >
          เริ่มต้นตั้งค่ารหัส PIN
        </button>
      </div>
    </div>
  )
}
