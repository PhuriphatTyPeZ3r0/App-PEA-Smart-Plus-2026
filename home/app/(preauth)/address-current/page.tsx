'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type React from 'react'

const IF: React.CSSProperties = {
  width: '100%',
  height: 52,
  background: '#F5F5FA',
  border: '1.5px solid #E0E0EE',
  borderRadius: 16,
  padding: '0 16px',
  fontFamily: "'Sarabun', sans-serif",
  fontSize: 16,
  color: '#333',
  outline: 'none',
  boxSizing: 'border-box',
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

export default function AddressCurrentPage() {
  const router = useRouter()
  const [sameAsId, setSameAsId] = useState(false)
  const [no, setNo] = useState('')
  const [road, setRoad] = useState('')
  const [districtFilled, setDistrictFilled] = useState(false)

  const isValid = sameAsId || (!!no && districtFilled)

  const toggleSame = () => {
    const next = !sameAsId
    setSameAsId(next)
    if (next) {
      setNo('77/1')
      setRoad('ดินแดง')
      setDistrictFilled(true)
    } else {
      setNo('')
      setRoad('')
      setDistrictFilled(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Sarabun', sans-serif" }}>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(155deg,#F8D5EB 0%,#FDE8F4 45%,#fff 75%)',
        padding: '16px 22px 28px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Back button */}
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

        {/* Illustration - absolute right */}
        <svg
          viewBox="0 0 130 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', right: 0, top: 0, width: 130 }}
        >
          <ellipse cx="75" cy="75" rx="50" ry="25" fill="#E89ACC" opacity=".4" />
          <rect x="22" y="28" width="68" height="48" rx="8" fill="#D490C0" opacity=".7" />
          <rect x="27" y="33" width="58" height="38" rx="6" fill="#F0C0E0" opacity=".8" />
          <circle cx="75" cy="20" r="13" fill="#C4308A" opacity=".9" />
          <line x1="75" y1="12" x2="75" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="20" x2="82" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#222', marginBottom: 6, marginTop: 0 }}>
          ที่อยู่ปัจจุบัน
        </h2>
        <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
          สำหรับใช้ในการติดต่อขอรับบริการและอื่น ๆ
        </p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 16px' }}>

        {/* Checkbox */}
        <div
          onClick={toggleSame}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', cursor: 'pointer', marginBottom: 14 }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 5, border: '2px solid',
            borderColor: sameAsId ? '#8B1A6B' : '#CCC',
            background: sameAsId ? '#8B1A6B' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {sameAsId && (
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 15, color: '#333' }}>ใช้ข้อมูลเดียวกับที่อยู่ตามบัตรประชาชน</span>
        </div>

        {/* เลขที่ + หมู่ */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            {no && <div style={LABEL}>เลขที่</div>}
            <input
              style={IF}
              placeholder="เลขที่"
              value={no}
              onChange={e => setNo(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative', flex: 1 }}>
            <input style={IF} placeholder="หมู่ (ถ้ามี)" />
          </div>
        </div>

        {/* หมู่บ้าน */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input style={IF} placeholder="หมู่บ้าน (ถ้ามี)" />
        </div>

        {/* ซอย */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input style={IF} placeholder="ซอย (ถ้ามี)" />
        </div>

        {/* ถนน */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          {road && <div style={LABEL}>ถนน (ถ้ามี)</div>}
          <input
            style={IF}
            placeholder="ถนน (ถ้ามี)"
            value={road}
            onChange={e => setRoad(e.target.value)}
          />
        </div>

        {/* ตำบล/อำเภอ/จังหวัด */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          {districtFilled && <div style={LABEL}>ตำบล/อำเภอ/จังหวัด/รหัสไปรษณีย์</div>}
          <div
            style={{
              ...IF,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            onClick={() => setDistrictFilled(true)}
          >
            {districtFilled
              ? <span style={{ color: '#333' }}>บ้านกล้วย/เมืองสุโขทัย/สุโขทัย</span>
              : <span style={{ color: '#AAA' }}>ตำบล/อำเภอ/จังหวัด/รหัสไปรษณีย์</span>
            }
            <span style={{ color: '#AAA', fontSize: 20 }}>›</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <div style={{ padding: '14px 20px 32px', flexShrink: 0 }}>
        <button
          disabled={!isValid}
          onClick={() => router.push('/pin-setup')}
          style={{
            width: '100%', height: 56,
            background: isValid
              ? 'linear-gradient(135deg,#C4307A,#8B1A6B)'
              : '#E0E0EE',
            color: isValid ? '#fff' : '#AAA',
            border: 'none', borderRadius: 28,
            fontFamily: "'Sarabun', sans-serif",
            fontSize: 18, fontWeight: 700, cursor: isValid ? 'pointer' : 'default',
            boxShadow: isValid ? '0 6px 20px rgba(139,26,107,.35)' : 'none',
            letterSpacing: '.3px',
            transition: 'all 0.2s',
          }}
        >
          บันทึกและดำเนินการต่อ
        </button>
      </div>
    </div>
  )
}
