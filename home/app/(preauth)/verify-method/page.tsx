'use client'
import { useRouter } from 'next/navigation'

export default function VerifyMethodPage() {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style jsx>{`
  .bp {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #8B1A6B;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(139,26,107,.25);
  }

  .bd {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #1a1a3a;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`}</style>
      {/* Status bar */}
      <div className="sb lt" style={{ flexShrink: 0 }}>
        <span></span>
        <div className="sb-r"></div>
      </div>

      {/* Hero section with gradient */}
      <div style={{
        background: 'linear-gradient(155deg,#F8D5EB 0%,#FDE8F4 45%,#fff 75%)',
        flexShrink: 0,
        padding: '20px 20px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Back button */}
        <div
          className="bk"
          style={{ margin: '0 0 14px' }}
          onClick={() => router.back()}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B1A6B" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>

        {/* Decorative radial */}
        <div style={{
          position: 'absolute', right: -10, top: 0,
          width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(196,48,122,.12),transparent 70%)',
        }} />

        {/* ID Card mockup */}
        <div style={{
          background: 'linear-gradient(135deg,#E8B4D8,#D490C0)',
          borderRadius: 18, padding: '20px 18px',
          width: 210, margin: '0 auto',
          boxShadow: '0 8px 28px rgba(139,26,107,.22)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg,#FDDCC8,#F4B8A0)',
              fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg,#FDDCC8,#F4B8A0)',
              fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img
                src="/images/(preauth)/profile.png"
                alt="profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 7, background: 'rgba(255,255,255,.5)', borderRadius: 4, marginBottom: 5 }} />
              <div style={{ height: 5, background: 'rgba(255,255,255,.3)', borderRadius: 4, width: '65%' }} />
            </div>
            <div style={{ background: '#1a1a3a', borderRadius: 8, padding: '4px 7px' }}>
              <span style={{ color: '#F0C030', fontSize: 10, fontWeight: 800 }}>Thai</span>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>ID</span>
            </div>
          </div>
          <div style={{ height: 7, background: 'rgba(255,255,255,.4)', borderRadius: 4, marginBottom: 4 }} />
          <div style={{ height: 7, background: 'rgba(255,255,255,.25)', borderRadius: 4, width: '55%' }} />
        </div>

        {/* Check badge */}
        <div style={{
          position: 'relative', width: 24, height: 24,
          background: '#34C759', borderRadius: '50%',
          border: '3px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 14, fontWeight: 700,
          margin: '-12px auto 8px',
          boxShadow: '0 3px 10px rgba(52,199,89,.4)',
        }}>✓</div>

        <p style={{
          textAlign: 'center', fontSize: 19, fontWeight: 800,
          color: '#222', marginTop: 8,
        }}>
          ยกระดับความปลอดภัย<br />และความสะดวกในการใช้บริการ
        </p>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 6 }}>
          กรุณาเลือกวิธีการยืนยันตัวตน
        </p>
      </div>

      {/* Buttons */}
      <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button className="bp" onClick={() => router.push('/form')}>
          ระบุข้อมูลบัตรประชาชนด้วยตัวเอง
        </button>
        <button className="bd" onClick={() => router.push('/thaid/loading')}>
          <span style={{
            background: '#fff', borderRadius: 7, padding: '3px 7px',
            fontSize: 10, fontWeight: 800, color: '#1a1a3a',
          }}>
            <span style={{ color: '#F0C030' }}>Thai</span>ID
          </span>
          {' '}ยืนยันตัวตนด้วยแอป ThaID
        </button>
      </div>
    </div>
  )
}
