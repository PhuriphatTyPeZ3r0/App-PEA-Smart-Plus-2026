'use client'
import { useRouter } from 'next/navigation'

export default function NationalityPage() {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Status bar */}
      <div className="sb lt" style={{ flexShrink: 0 }}>
        <span></span>
        <div className="sb-r"></div>
      </div>

      {/* Back button */}
      <div
        className="bk"
        style={{ cursor: 'pointer', padding: '10px 20px' }}
        onClick={() => router.back()}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 22px 80px', flex: 1, overflowY: 'auto' }}>

        {/* Icon (Shield) + Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg,#F5C0E0,#ECA0D0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 22,
          }}>
            {/* เปลี่ยนจาก SVG เป็น shield.png */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg,#C4308A,#8B1A6B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src="/images/(preauth)/shield.png" 
                alt="Shield Icon"
                style={{ width: '60%', height: '60%', objectFit: 'contain' }}
              />
            </div>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 10 }}>
            ยืนยันตัวตนผู้ใช้งานใหม่
          </h1>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6 }}>
            เพื่อยกระดับความปลอดภัยในการทำธุรกรรม<br />
            และลดขั้นตอนในการเข้าใช้บริการต่าง ๆ
          </p>
        </div>

        {/* Thai option */}
        <div
          onClick={() => router.push('/verify-method')}
          style={{
            background: '#fff',
            border: '1.5px solid #E8E8F0',
            borderRadius: 16,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,.05)',
            marginBottom: 14,
            transition: 'all .18s',
          }}
        >
          {/* เปลี่ยนจาก Emoji เป็น thai.svg */}
          <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src="/images/(preauth)/thai.svg" 
              alt="Thai Flag"
              style={{ width: '100%', height: 'auto', borderRadius: 4 }}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>สัญชาติไทย</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
              ใช้ข้อมูลตามบัตรประจำตัวประชาชนไทย
            </div>
          </div>
          <span style={{ color: '#bbb', fontSize: 20 }}>›</span>
        </div>

        {/* Foreigner option */}
        <div
          onClick={() => alert('Foreigner flow')}
          style={{
            background: '#fff',
            border: '1.5px solid #E8E8F0',
            borderRadius: 16,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,.05)',
            marginBottom: 14,
            transition: 'all .18s',
          }}
        >
          <div style={{ fontSize: 36, width: 44, textAlign: 'center' }}>🌍</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>Foreigner</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
              Use International Passport
            </div>
          </div>
          <span style={{ color: '#bbb', fontSize: 20 }}>›</span>
        </div>

      </div>
    </div>
  )
}