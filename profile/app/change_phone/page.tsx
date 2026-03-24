'use client';

import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';

export default function ChangePhone() {
  const router = useRouter();
  const [currentPhone] = useState('0910243212');
  const [newPhone, setNewPhone] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phoneInput = (e.target as HTMLFormElement).elements.namedItem('newPhone') as HTMLInputElement;
    const phone = phoneInput?.value?.trim() || '';
    if (phone) {
      sessionStorage.setItem('newPhone', phone);
      router.push('/otp_confirm');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPhone(e.target.value);
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '0' }}>
      <div className="form-container" style={{ padding: '20px 24px' }}>
        <Link href="/edit_basic_info" style={{ display: 'inline-block', marginBottom: '35px', color: '#111', textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 'bold' }}>chevron_left</span>
        </Link>
        <h1 className="form-title" style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 15px' }}>
          เปลี่ยนเบอร์โทรศัพท์มือถือ
        </h1>
        <p className="form-desc" style={{ fontSize: '15px', color: '#333', marginBottom: '2px', fontWeight: '500' }}>
          กรุณากรอกเบอร์โทรศัพท์มือถือใหม่ของคุณ
        </p>
        <p className="form-note" style={{ fontSize: '12px', color: '#666', marginBottom: '35px' }}>
          *ระบบรองรับเบอร์โทรศัพท์มือถือที่ลงทะเบียนในประเทศไทยเท่านั้น
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '25px', position: 'relative' }}>
            <div className="input-label" style={{ position: 'absolute', fontSize: '11px', color: '#666', top: '10px', left: '16px', zIndex: 1 }}>
              เบอร์โทรศัพท์มือถือ ปัจจุบัน
            </div>
            <input 
              type="text" 
              className="custom-input disabled-input" 
              value={currentPhone} 
              readOnly 
              style={{ width: '100%', padding: '28px 15px 10px', backgroundColor: '#f6f6f9', border: '1px solid #e8e8e8', borderRadius: '12px', fontSize: '16px', color: '#888', outline: 'none', fontWeight: '400' }} 
            />
          </div>

          <div className="input-group" style={{ marginBottom: '45px', position: 'relative' }}>
            <input 
              type="text" 
              name="newPhone"
              className="custom-input" 
              placeholder="เบอร์โทรศัพท์มือถือ ใหม่" 
              value={newPhone}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '18px 16px', backgroundColor: '#fff', border: '1px solid #d1d1d1', borderRadius: '12px', fontSize: '16px', color: '#333', outline: 'none' }} 
            />
          </div>

          <button type="submit" className="primary-btn" style={{ width: '100%', padding: '16px', backgroundColor: '#84328f', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            ยืนยัน
          </button>
        </form>
      </div>
    </div>
  );
}
