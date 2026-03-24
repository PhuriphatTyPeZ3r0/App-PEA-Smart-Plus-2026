import Link from 'next/link';

export default function SuccessEmail() {
  return (
    <div className="app-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '-10vh' }}>
        <div style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '160px', height: '160px', backgroundColor: '#e5f9f0', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '25px' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#47c48f', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 16px rgba(71,196,143,0.3)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '70px', color: '#fff', fontWeight: 'bold' }}>check</span>
            </div>
          </div>
        </div>
        
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#000000', marginBottom: '15px', textAlign: 'center' }}>
          เพิ่มอีเมลสำเร็จ
        </h1>
        
        <p style={{ fontSize: '15px', color: '#555', textAlign: 'center', lineHeight: '1.6', padding: '0 10px' }}>
          เราได้อัปเดตอีเมลใหม่ของคุณเรียบร้อยแล้ว
        </p>
      </div>

      <div style={{ paddingBottom: '40px' }}>
        <Link href="/personal_info" style={{ textDecoration: 'none', display: 'block' }}>
          <button className="primary-btn" style={{ 
            width: '100%', 
            padding: '16px', 
            backgroundColor: '#a30c92', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '12px', 
            fontSize: '18px', 
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
