'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SuccessPhone() {
  const [successPhone, setSuccessPhone] = useState('0910243212');

  useEffect(() => {
    const updatedPhone = sessionStorage.getItem('updatedPhone');
    if (updatedPhone) {
      setSuccessPhone(updatedPhone);
    }
  }, []);

  return (
    <div className="app-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '-10vh' }}>
        <div style={{ position: 'relative', width: '287px', height: '287px', marginBottom: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/images/Gemini_Generated_Image_c0e76ec0e76ec0e7.png" alt="Success Illustration" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#2b3346', marginBottom: '15px', textAlign: 'center' }}>
          เปลี่ยนเบอร์โทรศัพท์สำเร็จ
        </h1>
        
        <p style={{ fontSize: '15px', color: '#888', textAlign: 'center', lineHeight: '1.6', padding: '0 10px' }}>
          หมายเลข <span id="successPhone">{successPhone}</span> จะถูกใช้ในการ<br/>เข้าสู่ระบบและยืนยันตัวตนด้วย OTP ในครั้งต่อๆ ไป
        </p>
      </div>

      <div style={{ paddingBottom: '40px' }}>
        <Link href="/personal_info" style={{ textDecoration: 'none', display: 'block' }}>
          <button className="primary-btn" style={{ 
            width: '100%', 
            padding: '16px', 
            backgroundColor: '#8a2b8e', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '30px', 
            fontSize: '16px', 
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            ตกลง
          </button>
        </Link>
      </div>
      
    </div>
  );
}
