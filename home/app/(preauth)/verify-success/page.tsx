'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function VerifySuccessPage() {
  const router = useRouter()

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 24px' 
    }}>
      {/* Header */}
      <div style={{ paddingTop: 20 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
          สถานะการยืนยันตัวตน
        </p>
      </div>

      {/* Center Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        marginTop: -60 // ดันขึ้นเล็กน้อยเพื่อให้สมดุลตาม UI
      }}>
        <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 24 }}>
          <Image
            src="/images/(preauth)/verify_success.svg"
            alt="Verify Success"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 800, 
          color: '#111', 
          marginBottom: 12 
        }}>
          ยืนยันตัวตนสำเร็จ
        </h2>
        <p style={{ 
          fontSize: 16, 
          color: '#666', 
          lineHeight: 1.5,
          maxWidth: '80%' 
        }}>
          ระบบกำลังพาคุณไปดำเนินการขั้นต่อไป
        </p>
      </div>

      {/* Footer Button */}
      <div style={{ width: '100%', paddingBottom: 40 }}>
        <button 
          onClick={() => router.push('/address-current')}
          style={{
            width: '100%',
            backgroundColor: '#A00080', // สีม่วงตาม Reference
            color: '#fff',
            border: 'none',
            borderRadius: '100px', // ปรับให้มนแบบ Capsule
            padding: '16px 0',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(160, 0, 128, 0.2)'
          }}
        >
          ถัดไป
        </button>
      </div>
    </div>
  )
}