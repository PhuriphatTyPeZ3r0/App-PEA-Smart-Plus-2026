"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PowerFailureReportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [isExampleSheetOpen, setIsExampleSheetOpen] = useState(false);
  const [isOutageTypeSheetOpen, setIsOutageTypeSheetOpen] = useState(false);
  const [isCallSheetOpen, setIsCallSheetOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null); // null = not selected, 'custom' = manual, or object for CA
  const [isSuccess, setIsSuccess] = useState(false);
  
  // API Integration States
  const [outageTypes, setOutageTypes] = useState<any[]>([]);
  const [selectedOutageType, setSelectedOutageType] = useState<string>("");
  const [memoText, setMemoText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]); 

  // History API States
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);

  // Detail API States
  const [selectedHistoryDetail, setSelectedHistoryDetail] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // CustomerContract (Location) API States
  const [locationList, setLocationList] = useState<any[]>([]);
  const [locationPage, setLocationPage] = useState(1);
  const [locationTotalItems, setLocationTotalItems] = useState<number | null>(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [hasMoreLocations, setHasMoreLocations] = useState(true);
  const PAGE_SIZE = 20;

  // 1. Fetch Outage Types
  useEffect(() => {
    async function fetchOutageTypes() {
      try {
        const res = await fetch('/API/Outage/OutageType', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
          },
          body: JSON.stringify({ lang: 'TH' })
        });
        if(res.ok) {
           const data = await res.json();
           if (data && data.outageTypeList) {
             setOutageTypes(data.outageTypeList);
           }
        }
      } catch (err) {
        console.error("Failed to fetch outage types API:", err);
      }
    }
    fetchOutageTypes();
  }, []);

  // 2. Fetch History (Refreshable)
  useEffect(() => {
    if (activeTab === 'history' && !hasFetchedHistory) {
      fetchHistory();
    }
  }, [activeTab, hasFetchedHistory]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const payload = { pFIdIndex: null, lang: 'TH' };
      const res = await fetch('/API/Outage/History', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
        },
        body: JSON.stringify(payload)
      });
      if(res.ok) {
        const data = await res.json();
        if (data && data.success !== false) {
           const list = data.historyList || Math.max(0, Object.keys(data).length - 3) > 0 ? Object.values(data).find(v => Array.isArray(v)) : null;
           if (list) setHistoryList(list as any[]);
           else if (Array.isArray(data)) setHistoryList(data);
           else if (Array.isArray(data.data)) setHistoryList(data.data);
        }
      }
      setHasFetchedHistory(true);
    } catch (err) {
      console.error('Fetch History Error:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 3. Fetch Details
  const handleHistoryItemClick = async (item: any) => {
    const pfId = item.pfId || item.PfId || item.id || item.PFTId;
    if (!pfId) return;
    
    setIsDetailModalOpen(true);
    setIsDetailLoading(true);
    try {
      const res = await fetch('/API/Outage/Detail', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
        },
        body: JSON.stringify({ pFId: parseInt(pfId), lang: 'TH' })
      });
      if(res.ok) {
        const data = await res.json();
        setSelectedHistoryDetail(data.result || data.data || data);
      } else {
        setSelectedHistoryDetail(item);
      }
    } catch (err) {
      console.error('Fetch Outage Detail Error:', err);
      setSelectedHistoryDetail(item);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 4. Fetch Locations
  const fetchLocations = async (page: number, append: boolean = false) => {
    if (isLoadingLocations) return;
    setIsLoadingLocations(true);
    try {
      const identityId = localStorage.getItem('userAccIdenNumber') || 'pf6hXAf7OgaV2yihyuhOrnkJctgHiZGQWR3GzoY=';
      const res = await fetch('/API/ElectricUsed/CustomerContract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
        },
        body: JSON.stringify({
          identityId,
          pageNumber: page,
          pageSize: PAGE_SIZE,
          sortColumn: 'CAOrder',
          sortDirection: 'ASC'
        })
      });
      if(res.ok) {
        const data = await res.json();
        const items: any[] = data?.item || data?.result?.electricUsedList || data?.result || [];
        const total: number = data?.totalItem ?? data?.result?.totalItem ?? items.length;

        setLocationTotalItems(total);
        const updated = append ? [...locationList, ...items] : items;
        setLocationList(updated);

        if (!append && total === 1 && items.length === 1) {
          setSelectedLocation(items[0]);
        }
        setHasMoreLocations(items.length >= PAGE_SIZE);
      }
    } catch (err) {
      console.error('Fetch CustomerContract Error:', err);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleOpenLocationSheet = () => {
    setIsLocationSheetOpen(true);
    if (locationList.length === 0) {
      setLocationPage(1);
      fetchLocations(1, false);
    }
  };

  const handleLocationScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom && hasMoreLocations && !isLoadingLocations) {
      const nextPage = locationPage + 1;
      setLocationPage(nextPage);
      fetchLocations(nextPage, true);
    }
  };

  // 5. File Upload (Corrected to /API/Outage/Upload + Error handling)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (selectedFiles.length + files.length > 5) {
      alert("สามารถเลือกได้ไม่เกิน 5 ไฟล์");
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5 MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        
        const fileEntry: any = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data
        };

        try {
          const res = await fetch('/API/Outage/Upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
            },
            body: JSON.stringify({
              fileNo: selectedFiles.length + 1,
              filename: file.name,
              fileType: file.type,
              fileData: base64Data
            })
          });

          if (!res.ok) {
            console.error(`Upload failed with status: ${res.status}`);
            throw new Error(`Server returned status ${res.status}`);
          }
          
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON");
          }

          const data = await res.json();
          const result = data.result || data;
          if (result && (result.fileId || result.s3key)) {
            fileEntry.fileId = result.fileId;
            fileEntry.s3key = result.s3key;
          }
        } catch (err) {
          console.error(`Quick upload error for ${file.name}:`, err);
          alert(`ไม่สามารถอัปโหลดไฟล์ ${file.name} ได้ โปรดลองอีกครั้ง`);
          return; // Skip adding to state if API fails
        }

        setSelectedFiles(prev => [...prev, fileEntry]);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = "";
  };

  // 6. Delete File (Corrected to /API/Outage/DeleteFile)
  const removeFile = async (index: number) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove?.s3key) {
      try {
        await fetch('/API/Outage/DeleteFile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
          },
          body: JSON.stringify({ s3key: fileToRemove.s3key })
        });
      } catch (err) {
        console.error('DeleteFile API Error:', err);
      }
    }
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 7. Submit Report (Real Database Integration)
  const handleSubmit = async () => {
    if (!selectedLocation) {
       alert("กรุณาเลือกสถานที่เกิดเหตุ");
       return;
    }

    setIsSubmitting(true);
    try {
      const attachmentList = selectedFiles
        .filter(f => f.fileId && f.s3key)
        .map((f, i) => ({
          fileNo: i + 1,
          fileId: f.fileId,
          fileName: f.name,
          s3key: f.s3key,
          fileType: f.type
        }));

      // NOTE: เปลี่ยน contactName/SurName/PhoneNo ให้ดึงจาก Profile ในระบบจริง
      const payload = {
        pFTId: selectedOutageType ? parseInt(selectedOutageType) : 1,
        isManualLocation: selectedLocation === 'custom',
        userMeterId: selectedLocation?.userMeterId ? parseInt(selectedLocation.userMeterId) : 0, 
        ca: selectedLocation?.ca || selectedLocation?.CA || '',
        peaNo: selectedLocation?.peaNo || selectedLocation?.PeaNo || '',
        contactName: 'ผู้ใช้', 
        contactSurName: 'ทดสอบ',
        contactPhoneNo: '0800000000',
        memo: memoText,
        fileAttachmentList: attachmentList,
        lang: 'TH'
      };

      const res = await fetch('/API/Outage/SendReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Submit Error! Status: ${res.status}, Body:`, errorText);
        throw new Error(`Server returned status ${res.status}`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
         throw new Error("Response is not JSON");
      }

      const data = await res.json();
      console.log('SendReport API Response:', data);

      if (data && data.success !== false) {
        setIsSuccess(true);
        setHasFetchedHistory(false); // Force reload history when user goes to history tab
      } else {
        alert(data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err: any) {
      console.error('Submit API Error:', err);
      // เปลี่ยนจาก alert เป็นการแสดงหน้า System error
      router.push('/system-error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen relative bg-[#f9f9fc] flex flex-col overflow-hidden font-kanit">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".pdf,.tiff,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx"
      />
      
      <div className="bg-white flex flex-col shadow-sm z-20 sticky top-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/profile" className="p-2 -ml-2 text-[#333] hover:bg-gray-50 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
          </Link>
          <div className="text-[20px] font-medium text-[#111]">แจ้งไฟฟ้าขัดข้อง</div>
          <div className="w-10"></div>
        </div>
        
        <div className="flex px-5 border-b border-[#E4E7EC]">
          <div 
            className={`flex-1 py-4 flex justify-center items-center border-b-[3px] cursor-pointer transition-colors ${activeTab === 'create' ? 'border-[#A80689] text-[#A80689]' : 'border-transparent text-[#667085] hover:text-[#333]'}`}
            onClick={() => setActiveTab('create')}
          >
            <div className="text-[17px] font-medium">สร้างรายการ</div>
          </div>
          <div 
            className={`flex-1 py-4 flex justify-center items-center border-b-[3px] cursor-pointer transition-colors ${activeTab === 'history' ? 'border-[#A80689] text-[#A80689]' : 'border-transparent text-[#667085] hover:text-[#333]'}`}
            onClick={() => setActiveTab('history')}
          >
            <div className="text-[17px] font-medium">รายการแจ้งเหตุ</div>
          </div>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="flex-1 px-5 py-6 bg-white overflow-y-auto pb-[120px]">
          <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-[#101828] text-[22px] font-medium leading-8">พื้นที่เกิดเหตุ</h2>
                <p className="text-[#475467] text-[15px] leading-6">เลือกสถานที่เกิดเหตุจากรายการสถานที่ใช้ไฟฟ้าของคุณ หรือระบุสถานที่เกิดเหตุเอง</p>
              </div>
              
              <div className="flex flex-col gap-6">
                <div 
                  onClick={handleOpenLocationSheet}
                  className={`h-14 px-4 rounded-2xl border transition-all ${selectedLocation ? 'bg-white border-[#D0D5DD]' : 'bg-[#F9FAFB] border-[#D0D5DD]'} flex items-center justify-between cursor-pointer hover:border-[#A80689]`}
                >
                  {!selectedLocation || selectedLocation === 'custom' ? (
                    <span className="text-[#667085] text-base">เลือกสถานที่ใช้ไฟฟ้า</span>
                  ) : (
                    <div className="flex flex-col w-full relative -mt-0.5">
                      <span className="absolute -top-[16px] left-0 bg-white px-1 text-[11px] text-[#A80689] font-medium tracking-wide">สถานที่ใช้ไฟฟ้า</span>
                      <span className="text-[#101828] text-base font-medium truncate">{selectedLocation.customerName || selectedLocation.ca}</span>
                      <span className="text-[#667085] text-xs">CA: {selectedLocation.ca}</span>
                    </div>
                  )}
                  <span className="material-symbols-outlined text-[#667085]">expand_more</span>
                </div>

                {selectedLocation && selectedLocation !== 'custom' && (
                  <div className="h-14 px-4 rounded-2xl border border-[#D0D5DD] bg-white flex items-center relative opacity-100 transition-opacity">
                    <span className="absolute -top-[9px] left-3 bg-white px-1 text-[11px] text-[#667085] tracking-wide">รหัสเครื่องวัด (PEA No.)</span>
                    <span className="text-[#101828] text-base">{selectedLocation.peaNo}</span>
                  </div>
                )}
              </div>

              <div 
                className="flex items-center gap-3 w-max cursor-pointer pt-1"
                onClick={() => setSelectedLocation(selectedLocation === 'custom' ? null : 'custom')}
              >
                <div className={`w-6 h-6 rounded flex justify-center items-center transition-colors ${selectedLocation === 'custom' ? 'bg-[#A80689]' : 'border-[1.5px] border-[#D0D5DD] bg-white'}`}>
                  {selectedLocation === 'custom' && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
                </div>
                <span className={`text-[15px] ${selectedLocation === 'custom' ? 'text-[#A80689] font-medium' : 'text-[#344054]'}`}>ระบุสถานที่เกิดเหตุเอง</span>
              </div>

              <div 
                className="self-stretch h-8 rounded-[500px] inline-flex justify-center items-center cursor-pointer mt-1"
                onClick={() => setIsExampleSheetOpen(true)}
              >
                <div className="flex-1 self-stretch px-4 flex justify-center items-center gap-2.5">
                  <div className="flex-1 text-center justify-start text-[#A80689] text-sm font-bold font-['Kanit'] leading-4">ตัวอย่างการดูข้อมูลสถานที่ใช้ไฟฟ้าในใบแจ้งค่าไฟฟ้า </div>
                </div>
              </div>

              <div 
                className="self-stretch px-6 py-4 bg-gradient-to-br from-fuchsia-400/10 to-pink-500/10 rounded-[99px] shadow-[inset_0px_0px_16px_0px_rgba(255,255,255,0.50)] outline outline-1 outline-offset-[-1px] outline-fuchsia-400 inline-flex justify-start items-center gap-6 cursor-pointer"
                onClick={() => setIsCallSheetOpen(true)}
              >
                <div className="flex-1 flex justify-start items-center gap-4">
                  <div className="w-11 h-11 relative rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-gradient-to-b from-pink-100 via-fuchsia-400 to-fuchsia-700">
                     <span className="material-symbols-outlined text-white text-[24px]">support_agent</span>
                  </div>
                  <div className="w-60 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-[#101828] text-base font-semibold font-['Kanit'] leading-6">หากไม่ทราบข้อมูลสถานที่ใช้ไฟฟ้า</div>
                    <div className="self-stretch justify-start text-[#A80689] text-xs font-medium font-['Kanit'] leading-4">แจ้งผ่าน 1129 PEA Contact Center</div>
                  </div>
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-[#101828]">
                  <span className="material-symbols-outlined">chevron_right</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-2">
              <div className="flex flex-col gap-2">
                <h2 className="text-[#101828] text-[22px] font-medium leading-8">แจ้งเหตุไฟฟ้าขัดข้อง</h2>
                <p className="text-[#475467] text-[15px] leading-6">โปรดระบุรายละเอียดของปัญหาที่พบ เพื่อให้เราตรวจสอบ ได้อย่างครบถ้วน</p>
              </div>

              <div 
                className="self-stretch h-14 flex flex-col justify-start items-start cursor-pointer transition-opacity active:opacity-70"
                onClick={() => setIsOutageTypeSheetOpen(true)}
              >
                <div className="self-stretch h-14 px-3.5 relative bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#D0D5DD] inline-flex justify-start items-center">
                  <span className="absolute -top-[9px] left-3 bg-white px-1 text-[11px] text-[#667085] tracking-wide">ประเภทไฟฟ้าขัดข้อง</span>
                  <div className={`flex-1 justify-start text-base font-normal font-['Aktiv_Grotesk_Thai'] leading-6 line-clamp-1 ${selectedOutageType ? 'text-[#101828]' : 'text-[#667085]'}`}>
                     {selectedOutageType ? (outageTypes.find((t: any) => (t.pftId || t.PFTId || t.id)?.toString() === selectedOutageType)?.outageTypeName || outageTypes.find((t: any) => (t.pftId || t.PFTId || t.id)?.toString() === selectedOutageType)?.OutageTypeName || 'ไฟฟ้าขัดข้อง') : 'เลือกประเภทไฟฟ้าขัดข้อง'}
                  </div>
                  <div className="w-5 h-5 flex justify-center items-center">
                    <span className="material-symbols-outlined text-[#667085]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="relative border border-[#D0D5DD] rounded-2xl px-4 py-3 min-h-[120px] bg-white focus-within:border-[#A80689] transition-colors">
                  <span className="absolute -top-[9px] left-3 bg-white px-1 text-[11px] text-[#667085] tracking-wide">รายละเอียดเหตุการณ์</span>
                  <textarea 
                    className="w-full h-full bg-transparent outline-none resize-none text-[15px] text-[#101828] placeholder-[#98A1B2] mt-1"
                    placeholder="อธิบายรายละเอียดเหตุการณ์"
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex items-center gap-1.5 pl-2 text-xs text-[#637381]">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  <span>0 - 1500 ตัวอักษร</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[#101828] text-[15px] font-medium">รูปภาพ / เอกสารแนบอื่น ๆ (ถ้ามี)</span>
                  <span className="text-[#667085] text-[12px] leading-[18px]">
                    .pdf .tiff .jpeg .jpg .png .mp4 .doc .docx .xls .xlxs ขนาดไฟล์สูงสุด 5 MB เอกสารต้องมีความชัดเจนและอ่านได้ สามารถเลือกได้ไม่เกิน 5 ไฟล์
                  </span>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-[#F2F4F7] mt-1 pt-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="pl-3 pr-2 py-1.5 bg-[#FFF5FD] border border-[#FED8F6] rounded-full flex items-center gap-2 max-w-full">
                        <span className="text-[#A80689] text-[13px] font-medium truncate max-w-[150px]">{file.name}</span>
                        <div 
                          onClick={() => removeFile(index)}
                          className="w-5 h-5 rounded-full hover:bg-fuchsia-100 cursor-pointer text-[#A80689] flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={selectedFiles.length >= 5}
                  className={`px-4 py-2 bg-white border border-[#D0D5DD] rounded-full flex items-center justify-center gap-1.5 w-max shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors mt-2 ${selectedFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-[#344054] text-[14px] font-medium">เพิ่มไฟล์</span>
                  <span className="material-symbols-outlined text-[#344054] text-[18px]">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-[#f9f9fc] flex flex-col items-center w-full">
          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center p-12 w-full h-full my-auto mt-20">
              <div className="w-8 h-8 border-4 border-[#A80689] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#667085] mt-4 font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          ) : historyList && historyList.length > 0 ? (
            <div className="flex w-full flex-col overflow-y-auto pb-[120px]">
              {historyList.map((item: any, index: number) => (
                <div 
                  key={index} 
                  className="self-stretch px-5 py-4 bg-white border-b border-[#E4E7EC] inline-flex justify-start items-center gap-2 animate-slide-in-bottom cursor-pointer hover:bg-gray-50 transition-colors" 
                  style={{animationDelay: `${index * 50}ms`, animationFillMode: 'both'}}
                  onClick={() => handleHistoryItemClick(item)}
                >
                  <div className="flex-1 flex justify-start items-start gap-4">
                    <div className="w-9 h-9 relative bg-[#FEE4E2] rounded-full shrink-0 flex items-center justify-center border border-[#FEE4E2]">
                      <span className="material-symbols-outlined text-[#D92C20] text-[18px]">electric_bolt</span>
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch inline-flex justify-between items-start gap-2">
                        <div className="justify-start text-[#101828] text-xs font-medium font-['Kanit'] leading-4">{item.title || item.Title || "ไฟฟ้าขัดข้อง"}</div>
                        <div className="justify-start text-[#667085] text-[10px] font-normal font-['Kanit'] leading-4 text-right shrink-0">{item.createDate || item.CreateDate}</div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-1">
                        <div className="self-stretch justify-start text-[#101828] text-sm font-semibold font-['Kanit'] leading-4 line-clamp-2">{item.content || item.Content || "แจ้งปัญหาไฟฟ้าขัดข้อง"}</div>
                        <div className="self-stretch justify-start mt-1">
                          <span className="text-[#667085] text-xs font-normal font-['Kanit'] leading-4">หมายเลขผู้ใช้ไฟฟ้า </span>
                          <span className="text-[#667085] text-xs font-normal font-mono leading-4">{item.ca || item.Ca || "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-6 h-6 flex justify-center items-center shrink-0 text-[#667085]">
                     <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 w-full h-full my-auto mt-20">
              <span className="material-symbols-outlined text-[64px] text-[#D0D5DD] mb-4">history</span>
              <h3 className="text-[#475467] text-lg font-medium">ไม่มีรายการแจ้งเหตุ</h3>
              <p className="text-[#667085] text-sm mt-1 text-center">ประวัติการแจ้งเหตุไฟฟ้าขัดข้องของคุณจะแสดงที่นี่</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#F2F4F7] px-5 py-4 pb-safe-bottom z-10 flex justify-center shadow-[0_-8px_24px_rgba(145,158,171,0.08)]">
          <div className="w-full max-w-md">
            <button 
              onClick={handleSubmit}
              disabled={!selectedLocation || isSubmitting}
              className={`w-full py-4 rounded-full text-[17px] font-medium flex justify-center items-center transition-all ${selectedLocation ? 'bg-[#A80689] text-white shadow-md active:scale-[0.98]' : 'bg-[#F2F4F7] text-[#98A1B2] border border-[#E4E7EC]'}`}
            >
              {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยัน'}
            </button>
          </div>
        </div>
      )}

      {/* --- ALL BOTTOM SHEETS REMAIN IDENTICAL TO YOUR PREVIOUS CODE --- */}
      {isLocationSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-[#101828]/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsLocationSheetOpen(false)}></div>
          <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col relative z-10 animate-slide-in-bottom shadow-[0_-8px_40px_rgba(0,0,0,0.12)]">
            <div className="px-5 py-5 flex items-center justify-between">
              <div className="w-9 h-9"></div>
              <h3 className="text-[#101828] text-[18px] font-semibold">เลือกสถานที่ใช้ไฟฟ้า</h3>
              <button onClick={() => setIsLocationSheetOpen(false)} className="w-9 h-9 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined text-[20px] text-[#475467]">close</span>
              </button>
            </div>
            
            <div className="flex flex-col max-h-[65vh] overflow-y-auto pb-safe-bottom" onScroll={handleLocationScroll}>
              {locationList.length === 0 && isLoadingLocations ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-7 h-7 border-4 border-[#A80689] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#667085] text-sm">กำลังโหลดรายการ...</p>
                </div>
              ) : locationList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <span className="material-symbols-outlined text-[48px] text-[#D0D5DD]">location_off</span>
                  <p className="text-[#667085] text-sm">ไม่พบข้อมูลสถานที่ใช้ไฟฟ้า</p>
                </div>
              ) : (
                locationList.map((loc: any, idx: number) => {
                  const ca = loc.ca || loc.CA || loc.caNumber || '';
                  const name = loc.customerName || loc.caName || loc.name || loc.electricName || ca;
                  const address = loc.customerAddress || loc.address?.fullAddress || '';
                  const peaNo = loc.peaNo || loc.PeaNo || loc.meterNo || '';
                  return (
                    <div key={idx} className="flex flex-col">
                      <div 
                        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-fuchsia-50/50 transition-colors active:bg-fuchsia-50" 
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationSheetOpen(false);
                        }}
                      >
                        <div className="flex flex-col gap-1 flex-1 min-w-0 pr-3">
                          <span className="text-[#101828] text-base font-semibold truncate">{name}</span>
                          <span className="text-[#475467] text-[13px]">หมายเลขผู้ใช้ไฟ (CA) <span className="font-mono text-[13px] tracking-wide bg-gray-50 px-1 py-0.5 rounded">{ca}</span></span>
                          {address ? <span className="text-[#667085] text-[12px] leading-4 line-clamp-2">{address}</span> : null}
                          {peaNo ? <span className="text-[#667085] text-[12px]">PEA No. {peaNo}</span> : null}
                        </div>
                        {(selectedLocation?.ca === ca || selectedLocation?.CA === ca) ? (
                          <div className="w-5 h-5 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#A80689] text-[22px] font-bold">check</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-[#D0D5DD] shrink-0"></div>
                        )}
                      </div>
                      {idx < locationList.length - 1 && <div className="mx-6 border-b border-[#F2F4F7]"></div>}
                    </div>
                  );
                })
              )}
              {locationList.length > 0 && isLoadingLocations && (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-4 border-[#A80689] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {!hasMoreLocations && locationList.length > 0 && (
                <div className="text-center text-[#667085] text-xs py-3">แสดงทุกรายการแล้ว</div>
              )}
            </div>
          </div>
        </div>
      )}

      {isOutageTypeSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end font-kanit">
          <div className="absolute inset-0 bg-[#101828]/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsOutageTypeSheetOpen(false)}></div>
          <div className="w-full max-w-md mx-auto bg-white rounded-t-2xl flex flex-col relative z-10 animate-slide-in-bottom shadow-xl">
            <div className="w-full px-5 pt-6 pb-2 border-b border-[#E4E7EC] flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur z-20 rounded-t-2xl">
               <h3 className="text-[#101828] text-lg font-semibold">เลือกประเภทไฟฟ้าขัดข้อง</h3>
               <button onClick={() => setIsOutageTypeSheetOpen(false)} className="w-8 h-8 flex justify-center items-center bg-gray-100 rounded-full text-[#475467]">
                 <span className="material-symbols-outlined text-[18px]">close</span>
               </button>
            </div>
            <div className="flex flex-col w-full px-5 py-2 max-h-[60vh] overflow-y-auto pb-safe-bottom">
              {(outageTypes.length > 0 ? outageTypes : [
                {id: 1, name: 'กิ่งไม้ใบไม้หรือเศษวัสดุใกล้สายไฟ/พาดสายไฟ'},
                {id: 2, name: 'คน/สัตว์ ส่งผลกระทบต่อระบบไฟฟ้า'},
                {id: 3, name: 'เครื่องจักร/ยานพาหนะ ที่ทำให้อุปกรณ์ไฟฟ้าชำรุด'},
                {id: 4, name: 'ไฟกระพริบ'},
                {id: 5, name: 'ไฟเกิน'},
                {id: 6, name: 'ไฟดับ'},
                {id: 7, name: 'ไฟดับเนื่องจากถูกตัดไฟ'}
              ]).map((type: any, index: number) => {
                const val = (type.pftId || type.PFTId || type.id || index + 1).toString();
                const text = type.outageTypeName || type.OutageTypeName || type.name;
                return (
                  <div 
                    key={index} 
                    className="self-stretch h-14 flex flex-col justify-center items-start cursor-pointer active:bg-gray-50 transition-colors"
                    onClick={() => {
                      setSelectedOutageType(val);
                      setIsOutageTypeSheetOpen(false);
                    }}
                  >
                    <div className="self-stretch inline-flex justify-between items-center py-3 border-b border-[#DFE3E8]">
                      <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
                        <div className={`self-stretch justify-start text-base font-normal font-['Kanit'] leading-6 ${selectedOutageType === val ? 'text-[#A80689] font-medium' : 'text-[#101828]'}`}>{text}</div>
                      </div>
                      {selectedOutageType === val && <span className="material-symbols-outlined text-[#A80689] text-[20px]">check</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isExampleSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end font-kanit">
          <div className="absolute inset-0 bg-[#101828]/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsExampleSheetOpen(false)}></div>
          <div className="w-full max-w-md mx-auto px-5 pt-10 pb-14 bg-white rounded-t-2xl flex flex-col items-center gap-10 relative z-10 animate-slide-in-bottom">
            <div className="self-stretch flex flex-col justify-start items-center gap-4">
              <div className="self-stretch flex flex-col justify-center items-center gap-4">
                <div className="self-stretch flex flex-col justify-start items-center gap-2">
                  <div className="w-80 text-center justify-start text-[#101828] text-xl font-bold font-['Kanit'] leading-7">ตัวอย่างการดูข้อมูลสถานที่ใช้ไฟฟ้า ในใบแจ้งค่าไฟฟ้า</div>
                </div>
              </div>
              <img className="w-full aspect-video object-cover rounded-lg border border-[#E4E7EC]" src="https://placehold.co/382x262/A80689/FFF?text=Bill+Format" alt="Example Bill Info" />
            </div>
            <div className="self-stretch flex flex-col justify-center items-start gap-5 w-full">
              <div 
                className="self-stretch px-5 py-4 bg-[#A80689] rounded-full shadow-sm inline-flex justify-center items-center gap-2.5 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setIsExampleSheetOpen(false)}
              >
                <div className="justify-start text-white text-xl font-medium font-['Kanit'] leading-7">เข้าใจแล้ว</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCallSheetOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end items-center font-['SF_Pro'] pb-8 px-2">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCallSheetOpen(false)}></div>
          <div className="w-full max-w-md relative rounded-2xl flex flex-col justify-start items-center overflow-hidden mb-2 shadow-sm animate-slide-in-bottom">
            <div className="w-full absolute inset-0 bg-[#f4f4f4] bg-opacity-[0.8] backdrop-blur-[20px]"></div>
            <a href="tel:1129" className="self-stretch h-14 relative border-b border-[#c6c6c8] flex items-center justify-center active:bg-black/10 transition-colors z-10 cursor-pointer">
              <div className="text-center justify-center text-[#007AFF] text-[20px] font-normal leading-5">Call 1129</div>
            </a>
          </div>
          <div 
            className="w-full max-w-md h-14 relative rounded-2xl flex flex-col justify-center items-center overflow-hidden shadow-sm animate-slide-in-bottom z-10 cursor-pointer active:bg-black/10 transition-colors bg-white font-semibold mb-2"
            onClick={() => setIsCallSheetOpen(false)}
          >
            <div className="text-center justify-center text-[#007AFF] text-[20px] leading-5">Cancel</div>
          </div>
        </div>
      )}

      {isDetailModalOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#F9FAFB] font-kanit">
          <div className="bg-white flex px-4 py-3 items-center justify-between shadow-sm sticky top-0 z-20">
            <div 
              className="p-2 -ml-2 text-[#475467] hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              onClick={() => {
                setIsDetailModalOpen(false);
                setSelectedHistoryDetail(null);
              }}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </div>
            <div className="text-[18px] font-medium text-[#101828]">รายละเอียดการแจ้งเหตุ</div>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6 animate-fade-in">
            {isDetailLoading ? (
              <div className="flex flex-col items-center justify-center p-12 w-full h-full my-auto">
                <div className="w-8 h-8 border-4 border-[#A80689] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#667085] mt-4 font-medium">กำลังโหลดรายละเอียด...</p>
              </div>
            ) : selectedHistoryDetail ? (
              <div className="flex flex-col gap-6">
                {(() => {
                  const detail = selectedHistoryDetail.detail || selectedHistoryDetail;
                  const statusList = selectedHistoryDetail.reportStatusList || [];
                  const fileList = selectedHistoryDetail.fileList || [];
                  const isSolved = detail.isSolved;
                  
                  return (
                    <>
                      <div className="flex flex-col gap-5 items-center bg-white p-6 rounded-2xl shadow-sm border border-[#E4E7EC]">
                         <div className="w-16 h-16 bg-[#FEE4E2] rounded-full flex items-center justify-center border-4 border-[#FEF3F2]">
                           <span className="material-symbols-outlined text-[#D92C20] text-[32px]">electric_bolt</span>
                         </div>
                         <div className="text-center flex flex-col gap-1">
                           <h2 className="text-[#101828] text-xl font-semibold leading-7">{detail.title || detail.Title || "ไฟฟ้าขัดข้อง"}</h2>
                           <p className="text-[#667085] text-sm">{detail.createDate || detail.CreateDate || "ไม่ระบุวันที่"}</p>
                         </div>
                         <div className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${isSolved ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                            <span className={`w-2 h-2 rounded-full ${isSolved ? 'bg-green-500' : 'bg-yellow-500'}`}></span> 
                            {isSolved ? "ดำเนินการเสร็จสิ้น" : "กำลังดำเนินการ"}
                         </div>
                      </div>

                      <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-[#E4E7EC] overflow-hidden">
                         <div className="px-5 py-4 border-b border-[#E4E7EC] bg-gray-50/50">
                           <h3 className="text-[#101828] font-semibold text-lg">ข้อมูลการแจ้งเหตุ</h3>
                         </div>
                         <div className="flex flex-col p-5 gap-5">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[#667085] text-sm">หมายเลขผู้ใช้ไฟฟ้า (CA)</span>
                              <span className="text-[#101828] text-base font-medium">{detail.ca || detail.Ca || "-"}</span>
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[#667085] text-sm">รหัสเครื่องวัด (PEA No.)</span>
                              <span className="text-[#101828] text-base">{detail.peaNo || detail.PeaNo || "-"}</span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="text-[#667085] text-sm">รายละเอียดปัญหา</span>
                              <span className="text-[#101828] text-base">{detail.memo || detail.content || detail.Content || "ไม่ระบุรายละเอียด"}</span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="text-[#667085] text-sm">ข้อมูลการติดต่อ</span>
                              <span className="text-[#101828] text-base">{detail.contactInfo || detail.ContactInfo || detail.contactPhoneNo || detail.phone || "-"}</span>
                            </div>

                            {fileList.length > 0 && (
                              <div className="flex flex-col gap-2 pt-2 border-t border-[#F2F4F7]">
                                <span className="text-[#667085] text-sm">ไฟล์แนบ</span>
                                <div className="flex flex-wrap gap-2">
                                  {fileList.map((f: any, i: number) => (
                                    <div key={i} className="px-3 py-1.5 bg-[#F9FAFB] border border-[#E4E7EC] rounded-full text-[13px] text-[#475467] flex items-center gap-1.5 truncate max-w-full">
                                      <span className="material-symbols-outlined text-[16px]">attach_file</span>
                                      <span className="truncate">{f.fileName}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                         </div>
                      </div>

                      {statusList.length > 0 && (
                        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-[#E4E7EC] overflow-hidden mb-6">
                           <div className="px-5 py-4 border-b border-[#E4E7EC] bg-gray-50/50">
                             <h3 className="text-[#101828] font-semibold text-lg">สถานะการดำเนินการ</h3>
                           </div>
                           <div className="flex flex-col p-5 gap-0 relative">
                              <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-[#E4E7EC]"></div>
                              {statusList.map((status: any, idx: number) => (
                                <div key={idx} className="flex gap-4 relative z-10 mb-6 last:mb-0">
                                  <div className="w-6 h-6 rounded-full bg-white border-[3px] border-[#A80689] mt-0.5 shrink-0 flex items-center justify-center">
                                    {idx === statusList.length - 1 && <div className="w-2 h-2 rounded-full bg-[#A80689]"></div>}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[#101828] font-semibold">{status.title || "-"}</span>
                                    <span className="text-[#475467] text-sm">{status.content || "-"}</span>
                                    <span className="text-[#667085] text-xs mt-1">{status.createDate}</span>
                                  </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 w-full h-full text-[#667085]">
                <span className="material-symbols-outlined text-[48px] text-[#D0D5DD] mb-2">error</span>
                <p>ไม่พบข้อมูล</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-end font-kanit">
          <div
            className="absolute inset-0 bg-[#101828]/50 backdrop-blur-[2px]"
            onClick={() => setIsSuccess(false)}
          />
          <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col items-center px-6 pt-8 pb-12 relative z-10 animate-slide-in-bottom shadow-[0_-8px_40px_rgba(0,0,0,0.15)]">
            <div className="w-20 h-20 rounded-full bg-[#F0FDF4] border-4 border-[#DCFCE7] flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[#16A34A] text-[40px]">check_circle</span>
            </div>
            <h2 className="text-[#101828] text-[22px] font-semibold text-center leading-8 mb-2">
              แจ้งเหตุสำเร็จ
            </h2>
            <p className="text-[#475467] text-[15px] text-center leading-6 mb-8">
              ระบบได้รับข้อมูลการแจ้งเหตุไฟฟ้าขัดข้องของคุณแล้ว<br />
              เจ้าหน้าที่จะดำเนินการตรวจสอบโดยเร็ว
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setActiveTab('history');
                setSelectedLocation(null);
                setSelectedOutageType('');
                setMemoText('');
                setSelectedFiles([]);
              }}
              className="w-full py-4 rounded-full bg-[#A80689] text-white text-[17px] font-semibold mb-3 shadow-md active:scale-[0.98] transition-all"
            >
              ดูประวัติการแจ้งเหตุ
            </button>
            <button
              onClick={() => {
                setIsSuccess(false);
                setSelectedLocation(null);
                setSelectedOutageType('');
                setMemoText('');
                setSelectedFiles([]);
              }}
              className="w-full py-4 rounded-full bg-[#F2F4F7] text-[#344054] text-[17px] font-medium active:bg-gray-200 transition-all"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}