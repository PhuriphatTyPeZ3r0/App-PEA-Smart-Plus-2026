'use client'
import { useRouter } from 'next/navigation'

export default function ThaidConsentPage() {
  const router = useRouter()
  const dataItems = [
    'เลขประจำตัวประชาชน',
    'คำนำหน้าชื่อ ภาษาไทย',
    'ชื่อจริง ภาษาไทย',
    'นามสกุล ภาษาไทย',
    'ที่อยู่ตามหน้าบัตรประจำตัวประชาชน',
    'วัน/เดือน/ปีเกิด',
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fff' }}>
      <style jsx>{`
        .bp {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: #1e3080; /* สีน้ำเงินเข้มตาม Header */
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .bp:active {
          background: #15225d;
        }

        .bo {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: 1.5px solid #E8E8F0; /* กรอบเส้นขอบบางๆ */
          background: #fff;
          color: #1e3080;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .bo:active {
          background: #F8F8FC;
        }
      `}</style>

      {/* Header */}
      <div style={{ background: '#1e3080', padding: '16px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ color: '#fff', fontSize: 24, cursor: 'pointer', lineHeight: 1 }} onClick={() => router.back()}>‹</span>
        <span style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>ยืนยันตัวตน</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#1e3080', textAlign: 'center', marginBottom: 8 }}>ยืนยันตัวตนเข้าสู่ระบบ</p>
        <p style={{ fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 28 }}>แอปพลิเคชัน PEA Smart Plus ขอยืนยันตัวตนเข้าสู่ระบบ</p>

        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>ขอใช้ข้อมูลดังต่อไปนี้</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dataItems.map((item, i) => (
              <div key={i} style={{ fontSize: 14, color: '#444', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: '#1e3080', fontSize: 20 }}>•</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div style={{ padding: '20px 24px 40px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
        <button className="bp" onClick={() => router.push('/thaid/confirm-pin')}>
          ยินยอม
        </button>
        <button className="bo" onClick={() => router.back()}>
          ไม่ยินยอม
        </button>
      </div>
    </div>
  )
}