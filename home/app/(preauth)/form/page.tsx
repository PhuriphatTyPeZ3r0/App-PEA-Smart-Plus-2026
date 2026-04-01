'use client'
import { useRouter } from 'next/navigation'
import type React from 'react'

const IF: React.CSSProperties = {
  width: '100%',
  height: 52,
  background: '#F5F5FA',
  border: '1.5px solid #E0E0EE',
  borderRadius: 16,
  padding: '0 44px 0 16px',
  fontFamily: "'Sarabun', sans-serif",
  fontSize: 16,
  color: '#333',
  outline: 'none',
  boxSizing: 'border-box',
  display: 'block',
}

const LABEL: React.CSSProperties = {
  fontSize: 12,
  color: '#8B1A6B',
  fontWeight: 600,
  position: 'absolute',
  top: -7,
  left: 14,
  background: '#fff',
  padding: '0 4px',
  zIndex: 1,
}

export default function FormPage() {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Sarabun', sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(155deg,#F8D5EB 0%,#FDE8F4 45%,#fff 75%)',
        padding: '16px 22px 28px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div
          onClick={() => router.back()}
          style={{
            width: 42, height: 42, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', borderRadius: '50%', margin: '0 0 12px',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B1A6B" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>

        {/* Card illustration — must be absolute */}
        <svg
          viewBox="0 0 130 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', right: 0, top: 0, width: 130 }}
        >
          <rect x="25" y="22" width="72" height="50" rx="10" fill="#D480B8" opacity=".8" />
          <rect x="15" y="16" width="72" height="50" rx="10" fill="#E8A8D0" opacity=".9" />
          <circle cx="35" cy="36" r="11" fill="#FDDCC8" />
          <rect x="52" y="28" width="28" height="5" rx="2.5" fill="white" opacity=".6" />
          <rect x="52" y="36" width="20" height="4" rx="2" fill="white" opacity=".4" />
          <rect x="52" y="43" width="16" height="4" rx="2" fill="white" opacity=".35" />
          <circle cx="90" cy="22" r="13" fill="#EDB830" />
          <text x="85" y="27" fontSize="14" fontFamily="Arial" fontWeight="900" fill="white">+</text>
        </svg>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#222', marginBottom: 6, marginTop: 0 }}>
          ข้อมูลส่วนตัวของคุณ
        </h2>
        <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
          กรุณากรอกข้อมูลตามบัตรประชาชนเพื่อยืนยันตัวตน
        </p>
      </div>

      {/* Form fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 16px' }}>

        {/* ID number */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <input style={IF} defaultValue="1-1002-12345-78-9" readOnly />
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#AAA', fontSize: 18 }}>
            ⊡
          </div>
        </div>

        {/* คำนำหน้าชื่อ */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={LABEL}>คำนำหน้าชื่อ</div>
          <input style={IF} defaultValue="นางสาว" readOnly />
        </div>

        {/* ชื่อ */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={LABEL}>ชื่อ</div>
          <input style={IF} defaultValue="ศิญาพร" />
        </div>

        {/* นามสกุล */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={LABEL}>นามสกุล</div>
          <input style={IF} defaultValue="สวยดี" />
        </div>

        {/* วัน เดือน ปีเกิด */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={LABEL}>วัน เดือน ปีเกิด</div>
          <input style={IF} defaultValue="15 มีนาคม 2538" readOnly />
        </div>
      </div>

      {/* Button */}
      <div style={{ padding: '14px 20px 32px', flexShrink: 0 }}>
        <button
          onClick={() => router.push('/address-id')}
          style={{
            width: '100%', height: 56,
            background: 'linear-gradient(135deg,#C4307A,#8B1A6B)',
            color: '#fff', border: 'none', borderRadius: 28,
            fontFamily: "'Sarabun', sans-serif",
            fontSize: 18, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(139,26,107,.35)',
            letterSpacing: '.3px',
          }}
        >
          ถัดไป
        </button>
      </div>
    </div>
  )
}
