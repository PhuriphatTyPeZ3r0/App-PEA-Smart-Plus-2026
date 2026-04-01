'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
// แนะนำให้ติดตั้ง lucide-react เพื่อใช้ไอคอนที่สวยงาม: npm install lucide-react
import { QrCode, Home, History, FileText, Mail, Settings, ChevronLeft, MapPin } from 'lucide-react'

export default function ThaidHomePage() {
  const router = useRouter()

  // ฟังก์ชัน Automated Redirect ไปหน้า Consent
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/thaid/consent')
    }, 3000)

    // Cleanup function เพื่อล้าง timer เมื่อ component ถูกถอดออก
    return () => clearTimeout(timer)
  }, [router])

  // ข้อมูล Mockup สำหรับ Timeline
  const timelineEvents = [
    {
      date: '9 มิถุนายน พ.ศ. 2565',
      icon: <MapPin className="w-5 h-5 text-[#4285F4]" />,
      iconBg: '#E8F0FE',
      title: 'ผลการฉีดวัคซีน จากกระทรวงสาธารณสุข',
      description: 'เข็มที่ 2 ชนิดวัคซีน AstraZeneca วันที่ 5 พ.ค. 2564 เข็มที่ 3 ชนิดวัค...',
    },
    {
      date: '10 มีนาคม พ.ศ. 2565',
      icon: <MapPin className="w-5 h-5 text-[#4285F4]" />,
      iconBg: '#F9C90A', // สีเหลืองทอง
      title: 'การให้บริการระยะที่ 1',
      description: 'สามารถทดสอบใช้งาน PORTAL สำหรับคนไทย ได้ตั้งแต่วันนี้ https://...',
    },
    {
      date: '6 กรกฎาคม พ.ศ. 2564',
      icon: <MapPin className="w-5 h-5 text-[#4285F4]" />,
      iconBg: '#F9C90A',
      title: 'ผลการฉีดวัคซีน test',
      description: 'กระทรวงไทย ร่วมกับ กระทรวงสาธารณสุข แจ้งผลการฉีดวัคซีน เข็มที่ 1 ด้วย...',
    },
  ]

  // ข้อมูลสำหรับ Tab Bar
  const tabs = [
    { icon: <Home size={22} />, label: 'หน้าหลัก', active: true },
    { icon: <History size={22} />, label: 'ประวัติ' },
    { icon: <FileText size={22} />, label: 'เอกสาร' },
    { icon: <Mail size={22} />, label: 'ข้อความ' },
    { icon: <Settings size={22} />, label: 'ตั้งค่า' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8F9FA', fontFamily: 'sans-serif' }}>
      
      {/* 1. Header (บลูบาร์ด้านบน) */}
      <div style={{ background: '#1e3080', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fff', fontSize: 18, fontWeight: 600, cursor: 'pointer' }} onClick={() => router.back()}>
          <ChevronLeft size={24} strokeWidth={2.5} />
          หน้าหลัก
        </div>
        <QrCode style={{ color: '#fff', cursor: 'pointer' }} size={26} />
      </div>

      {/* 2. Main Content Area (เลื่อนได้) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>
        
        {/* 2.1 ID Card (บัตรประชาชน) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #E6F0FF 0%, #C8E0FF 100%)', 
          border: '1.5px solid #A0C8F5', 
          borderRadius: 16, 
          padding: '16px', 
          display: 'flex', 
          gap: 12,
          boxShadow: '0 4px 12px rgba(30,48,128,0.08)',
          marginBottom: 24
        }}>
          {/* ส่วนเนื้อหาซ้าย */}
          <div style={{ flex: 1 }}>
            {/* Header บัตร */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              {/* เปลี่ยนจาก SVG เป็นไฟล์ emblem.jpg */}
              <img 
                src="/images/(preauth)/emblem.png" 
                alt="Official Emblem"
                style={{ 
                  width: 22, 
                  height: 22, 
                  objectFit: 'contain',
                  flexShrink: 0 
                }}
              />
              <span style={{ fontSize: 10, color: '#1e3080', fontWeight: 800, letterSpacing: 0.3 }}>
                บัตรประจำตัวประชาชน <span style={{fontWeight: 400}}>Thai National ID Card</span>
              </span>
            </div>
            {/* เลขบัตร */}
            <div style={{ fontSize: 14, color: '#222', letterSpacing: 1.8, marginBottom: 6, fontWeight: 500 }}>1 1002 12345 78 9</div>
            {/* ชื่อ TH/EN */}
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>
              คุณ ศิญาพร สวยดี<br />
              Name: Ms. Siyaporn<br />
              Last Name: Suaydee
            </div>
            {/* วันเกิด */}
            <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>เกิดวันที่ 20 ก.พ. 2540<br/><span style={{fontSize: 9, color: '#888'}}>Date of Birth</span></div>
            {/* ที่อยู่ */}
            <div style={{ fontSize: 9, color: '#666', marginTop: 8, lineHeight: 1.3 }}>
              ที่อยู่ กรมการปกครอง ถนนอัษฎางค์ แขวงวังบูรพาภิรมย์<br />
              เขตพระนคร กรุงเทพฯ 10200
            </div>
            {/* วันออก/หมดอายุ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#777', marginTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 4 }}>
              <span>19 เม.ย. 2566<br/>วันออกบัตร</span>
              <span style={{textAlign: 'right'}}>22 มี.ค. 2566<br/>วันบัตรหมดอายุ</span>
            </div>
          </div>
          {/* รูปโปรไฟล์ขวา */}
          <div style={{ width: 64, height: 80, background: '#D1D5DB', borderRadius: 8, overflow: 'hidden', flexShrink: 0, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
            <img 
              src="https://www.w3schools.com/howto/img_avatar.png" // รูป Mockup หรือ placeholder
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* 2.2 Timeline Events (รายการกิจกรรม) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {timelineEvents.map((event, index) => (
            <div key={index} style={{ position: 'relative', paddingLeft: 12 }}>
              {/* เส้นขีดสีน้ำเงินด้านซ้าย */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#1e3080', borderRadius: 2 }} />
              
              {/* วันที่ */}
              <p style={{ fontSize: 14, color: '#1e3080', fontWeight: 700, marginBottom: 10 }}>{event.date}</p>
              
              {/* การ์ดเนื้อหา */}
              <div style={{ 
                background: '#fff', 
                borderRadius: 12, 
                padding: '14px', 
                display: 'flex', 
                gap: 12, 
                alignItems: 'flex-start',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                border: '1px solid #EEE'
              }}>
                {/* ไอคอนทรงกลม */}
                <div style={{ 
                  width: 42, 
                  height: 42, 
                  background: event.iconBg, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {event.icon}
                </div>
                {/* ข้อความ */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', lineHeight: 1.4 }}>{event.title}</p>
                  <p style={{ fontSize: 11, color: '#777', marginTop: 3, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Tab Bar (เมนูแนวนอนด้านล่าง) */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0,
        right: 0,
        background: '#fff', 
        borderTop: '1px solid #EEE', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        padding: '10px 0 24px', // เพิ่ม padding ด้านล่างสำหรับ iOS Home Bar
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
        zIndex: 10
      }}>
        {tabs.map((tab, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 4, 
            cursor: 'pointer',
            color: tab.active ? '#1e3080' : '#8E8E93' // สีเทามาตรฐาน iOS
          }}>
            <span style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28
            }}>
              {tab.icon}
            </span>
            <span style={{ 
              fontSize: 11, 
              fontWeight: tab.active ? 700 : 500,
              letterSpacing: -0.1
            }}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}