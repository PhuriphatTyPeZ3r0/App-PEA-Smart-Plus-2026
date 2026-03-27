"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
 
interface UploadResult {
  fileNo?: number;
  FileNo?: number;
  fileId?: string;
  FileId?: string;
  fileName?: string;
  FileName?: string;
  s3key?: string;
  S3Key?: string;
  fileType?: string;
  FileType?: string;
  filename?: string;
  name?: string;
  type?: string;
  fileKey?: string;
}

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
  const [selectedFiles, setSelectedFiles] = useState<UploadResult[]>([]); 
  const [manualCa, setManualCa] = useState<string>("");
  const [manualPeaNo, setManualPeaNo] = useState<string>("");

  // History API States
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);

  // Detail API States
  const [selectedHistoryDetail, setSelectedHistoryDetail] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'status'>('details');

  // CustomerContract (Location) API States
  const [locationList, setLocationList] = useState<any[]>([]);
  const [locationPage, setLocationPage] = useState(1);
  const [locationTotalItems, setLocationTotalItems] = useState<number | null>(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [hasMoreLocations, setHasMoreLocations] = useState(true);
  const PAGE_SIZE = 20;

  // New Contact & Location States
  const [contactInfo, setContactInfo] = useState<{name: string, surname: string, phone: string} | null>(null);
  const [detailedLocation, setDetailedLocation] = useState<any>(null);

  // 1. Fetch Outage Types
  useEffect(() => {
    async function fetchInitialData() {
      // Fetch Outage Types
      try {
        const res = await fetch('/API/Outage/OutageType', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
          },
          body: JSON.stringify({ Lang: 'TH' })
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
      
      // Fetch Contact Info
      fetchCustomerContract();
    }
    fetchInitialData();
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
      const payload = { PFIdIndex: null, Lang: 'TH' };
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
    const pfId = item.pfId || item.PFId || item.PfId || item.id || item.PFTId;
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
        body: JSON.stringify({ PFId: parseInt(pfId), Lang: 'TH' })
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

  // 3. Fetch Contact Info (New)
  const fetchCustomerContract = async () => {
    try {
      const identityId = localStorage.getItem('userAccIdenNumber') || 'pf6hXAf7OgaV2yihyuhOrnkJctgHiZGQWR3GzoY=';
      const res = await fetch(`/API/Outage/CustomerContract?identityId=${encodeURIComponent(identityId)}`, {
        method: 'GET',
        headers: {
          'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
        }
      });
      if (res.ok) {
        const data = await res.json();
        const result = data.result || data.item || data;
        if (result) {
          setContactInfo({
            name: result.firstName || result.FirstName || '',
            surname: result.lastName || result.LastName || '',
            phone: result.phoneNo || result.PhoneNo || ''
          });
        }
      }
    } catch (err) {
      console.error('Fetch Contact Info Error:', err);
    }
  };

  // 3.1 Fetch Location Detail (New)
  const fetchLocationDetail = async (ca: string) => {
    try {
      const res = await fetch('/API/Outage/GetLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
        },
        body: JSON.stringify({ Ca: ca })
      });
      if (res.ok) {
        const data = await res.json();
        const result = data.result || data.item || data;
        setDetailedLocation(result);
      }
    } catch (err) {
      console.error('Fetch Location Detail Error:', err);
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
          IdentityId: identityId,
          PageNumber: page,
          PageSize: PAGE_SIZE,
          SortColumn: 'CAOrder',
          SortDirection: 'ASC'
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
        
        try {
          const res = await fetch('/API/Outage/Upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
            },
            body: JSON.stringify({
              FileNo: selectedFiles.length + 1,
              FileName: file.name,
              FileType: file.type,
              FileData: base64Data
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
          const result: UploadResult = data.result || data;
          if (result) {
            setSelectedFiles(prev => [...prev, result]);
          }
        } catch (err) {
          console.error(`Quick upload error for ${file.name}:`, err);
          alert(`ไม่สามารถอัปโหลดไฟล์ ${file.name} ได้ โปรดลองอีกครั้ง`);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // 6. Delete File (Corrected to /API/Outage/DeleteFile)
  const removeFile = async (index: number) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove?.s3key || fileToRemove?.S3Key) {
      try {
        await fetch('/API/Outage/DeleteFile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.NEXT_PUBLIC_OUTAGE_AUTH_TOKEN as string
          },
          body: JSON.stringify({ S3Key: fileToRemove.s3key || fileToRemove.S3Key })
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

    if (selectedLocation === 'custom') {
      if (!manualCa.trim()) {
        alert("กรุณาระบุหมายเลขผู้ใช้ไฟฟ้า");
        return;
      }
      if (!manualPeaNo.trim()) {
        alert("กรุณาระบุรหัสเครื่องวัด");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const attachmentList = selectedFiles
        .filter(f => (f.fileId || f.FileId) && (f.s3key || f.S3Key))
        .map((f, i) => ({
          FileNo: i + 1,
          FileId: f.fileId || f.FileId,
          FileName: f.fileName || f.FileName || f.filename || f.name,
          S3Key: f.s3key || f.S3Key,
          FileType: f.fileType || f.FileType || f.type
        }));

      // NOTE: เปลี่ยน contactName/SurName/PhoneNo ให้ดึงจาก Profile ในระบบจริง
      const payload = {
        PFTId: selectedOutageType ? parseInt(selectedOutageType) : 1,
        IsManualLocation: selectedLocation === 'custom',
        UserMeterId: selectedLocation === 'custom' ? 0 : (selectedLocation?.userMeterId || selectedLocation?.UserMeterId ? parseInt(selectedLocation.userMeterId || selectedLocation.UserMeterId) : 0), 
        Ca: selectedLocation === 'custom' ? manualCa : (selectedLocation?.ca || selectedLocation?.CA || ''),
        PeaNo: selectedLocation === 'custom' ? manualPeaNo : (selectedLocation?.peaNo || selectedLocation?.PeaNo || ''),
        ContactName: contactInfo?.name || 'นางสาวรฐาวรรณ', 
        ContactSurName: contactInfo?.surname || 'เรืองหิรัญวนิช',
        ContactPhoneNo: contactInfo?.phone || '0909090909',
        Memo: memoText,
        FileAttachmentList: attachmentList,
        Lang: 'TH'
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
    <div className="w-full max-w-xl md:max-w-2xl mx-auto h-screen relative bg-[#f9f9fc] flex flex-col overflow-hidden font-kanit">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".pdf,.tiff,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx"
      />
      
      <div className="bg-white flex flex-col shadow-sm z-20 sticky top-0">
        <div className="px-2 py-5 flex items-center justify-between">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-50 flex items-center justify-center">
            <div className="w-5 h-5 relative overflow-hidden">
               <span className="material-symbols-outlined text-[#101828] text-[24px]">chevron_left</span>
            </div>
          </Link>
          <div className="flex-1 text-center pr-9">
            <h1 className="text-[#101828] text-xl font-medium font-kanit leading-7">แจ้งไฟฟ้าขัดข้อง</h1>
          </div>
        </div>
        
        <div className="flex px-5 border-b border-[#E4E7EC]">
          <div 
            className={`flex-1 py-4 flex justify-center items-center border-b-2 cursor-pointer transition-all ${activeTab === 'create' ? 'border-[#A80689]' : 'border-transparent'}`}
            onClick={() => setActiveTab('create')}
          >
            <div className={`text-lg font-medium font-kanit leading-6 ${activeTab === 'create' ? 'text-[#CF07AA]' : 'text-[#667085]'}`}>สร้างรายการ</div>
          </div>
          <div 
            className={`flex-1 py-4 flex justify-center items-center border-b-2 cursor-pointer transition-all ${activeTab === 'history' ? 'border-[#A80689]' : 'border-transparent'}`}
            onClick={() => setActiveTab('history')}
          >
            <div className={`text-lg font-medium font-kanit leading-6 ${activeTab === 'history' ? 'text-[#CF07AA]' : 'text-[#667085]'}`}>รายการแจ้งเหตุ</div>
          </div>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="flex-1 px-5 py-6 bg-white overflow-y-auto pb-[120px]">
          <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="justify-start text-[#101828] text-2xl font-medium font-kanit leading-8">พื้นที่เกิดเหตุ</div>
                <div className="self-stretch justify-start text-[#475467] text-base font-normal font-kanit leading-6">เลือกสถานที่เกิดเหตุจากรายการสถานที่ใช้ไฟฟ้าของคุณ หรือระบุสถานที่เกิดเหตุเอง</div>
              </div>
              
              <div className="flex flex-col gap-6">
                <div 
                  onClick={() => selectedLocation !== 'custom' && handleOpenLocationSheet()}
                  className={`h-14 px-4 rounded-2xl border transition-all flex items-center justify-between ${
                    selectedLocation === 'custom' 
                    ? "bg-[#F2F4F7] border-[#E4E7EC] cursor-not-allowed" 
                    : "bg-white border-[#D0D5DD] cursor-pointer hover:border-[#A80689]"
                  }`}
                >
                  {!selectedLocation || selectedLocation === 'custom' ? (
                    <span className="text-[#98A2B3] text-base font-kanit">เลือกสถานที่ใช้ไฟฟ้า</span>
                  ) : (
                    <div className="flex flex-col w-full relative">
                      <div className="absolute -top-[25px] left-0 bg-white px-1 flex justify-start items-center">
                        <span className="text-[#667085] text-[11px] font-normal font-kanit leading-4">เลือกสถานที่ใช้ไฟฟ้า</span>
                      </div>
                      <span className="text-[#101828] text-base font-medium truncate font-kanit pt-1 line-clamp-1">
                        {selectedLocation.customerName || selectedLocation.customer_name || selectedLocation.name || selectedLocation.Name || "สถานที่ใช้ไฟฟ้า"}
                      </span>
                      <span className="text-[#667085] text-xs font-kanit -mt-0.5">
                        หมายเลขผู้ใช้ไฟฟ้า: {selectedLocation.ca || selectedLocation.CA}
                      </span>
                    </div>
                  )}
                  <span className="material-symbols-outlined text-[#667085]">expand_more</span>
                </div>

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

              {selectedLocation === 'custom' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch h-14 px-3.5 relative bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#D0D5DD] focus-within:outline-[#A80689] inline-flex justify-start items-center transition-all">
                      <input
                        type="text"
                        value={manualCa}
                        onChange={(e) => setManualCa(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-[#101828] text-base font-kanit leading-6 pt-1"
                        placeholder="กรอกหมายเลขผู้ใช้ไฟฟ้า"
                      />
                      <div className="px-1 left-[14px] top-[-10px] absolute flex justify-start items-center bg-white">
                        <div className="justify-center text-[#667085] text-xs font-normal font-kanit leading-4">หมายเลขผู้ใช้ไฟฟ้า (CA/Ref No.1)</div>
                      </div>
                    </div>
                  </div>

                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch h-14 px-3.5 relative bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#D0D5DD] focus-within:outline-[#A80689] inline-flex justify-start items-center transition-all">
                      <input
                        type="text"
                        value={manualPeaNo}
                        onChange={(e) => setManualPeaNo(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-[#101828] text-base font-kanit leading-6 pt-1"
                        placeholder="กรอกรหัสเครื่องวัด"
                      />
                      <div className="px-1 left-[14px] top-[-10px] absolute flex justify-start items-center bg-white">
                        <div className="justify-center text-[#667085] text-xs font-normal font-kanit leading-4">รหัสเครื่องวัด (PEA No.)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div 
                className="self-stretch h-8 rounded-[500px] inline-flex justify-center items-center cursor-pointer mt-1"
                onClick={() => setIsExampleSheetOpen(true)}
              >
                <div className="flex-1 self-stretch px-4 flex justify-center items-center gap-2.5">
                  <div className="flex-1 text-center justify-start text-[#A80689] text-sm font-bold font-kanit leading-4">ตัวอย่างการดูข้อมูลสถานที่ใช้ไฟฟ้าในใบแจ้งค่าไฟฟ้า </div>
                </div>
              </div>

              <div 
                className="self-stretch px-6 py-4 bg-gradient-to-br from-fuchsia-400/10 to-pink-500/10 rounded-[99px] shadow-[inset_0px_1px_16px_rgba(255,255,255,0.5)] outline outline-1 outline-offset-[-1px] outline-fuchsia-400 flex justify-start items-center gap-6 cursor-pointer"
                onClick={() => setIsCallSheetOpen(true)}
              >
                <div className="flex-1 flex justify-start items-center gap-4">
                  <div className="w-11 h-11 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-fuchsia-400 to-fuchsia-700 rounded-lg transform rotate-45 opacity-20"></div>
                    <span className="material-symbols-outlined text-[#CF07AA] text-[28px] relative z-10">support_agent</span>
                  </div>
                  <div className="flex-1 min-w-0 inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-[#101828] text-base font-semibold font-kanit leading-6 truncate">หากไม่ทราบข้อมูลสถานที่ใช้ไฟฟ้า</div>
                    <div className="self-stretch justify-start text-[#A80689] text-xs font-medium font-kanit leading-4 truncate">แจ้งผ่าน 1129 PEA Contact Center</div>
                  </div>
                </div>
                <div className="w-6 h-6 flex items-center justify-center text-[#101828]">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="justify-start text-[#101828] text-2xl font-medium font-kanit leading-8">แจ้งเหตุไฟฟ้าขัดข้อง</div>
                <div className="self-stretch justify-start text-[#475467] text-base font-normal font-kanit leading-6">โปรดระบุรายละเอียดของปัญหาที่พบ เพื่อให้เราตรวจสอบ ได้อย่างครบถ้วน</div>
              </div>

              <div 
                className="self-stretch h-14 flex flex-col justify-start items-start cursor-pointer transition-opacity active:opacity-70"
                onClick={() => setIsOutageTypeSheetOpen(true)}
              >
                <div className="self-stretch h-14 px-3.5 relative bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#D0D5DD] inline-flex justify-start items-center">
                  <span className="absolute -top-[9px] left-3 bg-white px-1 text-[11px] text-[#667085] tracking-wide">ประเภทไฟฟ้าขัดข้อง</span>
                  <div className={`flex-1 justify-start text-base font-normal font-kanit leading-6 line-clamp-1 ${selectedOutageType ? 'text-[#101828]' : 'text-[#667085]'}`}>
                     {selectedOutageType ? (outageTypes.find((t: any) => (t.pftId || t.PFTId || t.id)?.toString() === selectedOutageType)?.outageTypeName || outageTypes.find((t: any) => (t.pftId || t.PFTId || t.id)?.toString() === selectedOutageType)?.OutageTypeName || 'ไฟฟ้าขัดข้อง') : 'เลือกประเภทไฟฟ้าขัดข้อง'}
                  </div>
                  <div className="w-5 h-5 flex justify-center items-center">
                    <span className="material-symbols-outlined text-[#667085]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 focus-within:ring-0">
                <div className="relative border border-[#D0D5DD] rounded-2xl px-3.5 py-4 min-h-[96px] bg-white focus-within:border-[#A80689] transition-all">
                  <div className="px-0.5 left-[14px] top-[-10px] absolute flex justify-start items-center bg-white">
                    <div className="justify-start text-[#667085] text-xs font-medium font-kanit leading-3">รายละเอียดเหตุการณ์</div>
                  </div>
                  <textarea 
                    className="w-full h-full bg-transparent outline-none resize-none text-base font-normal font-kanit text-[#101828] placeholder-[#98A2B3] mt-1"
                    placeholder="อธิบายรายละเอียดปัญหาที่พบ..."
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex items-center gap-1.5 pl-3 pt-1 text-xs text-[#667085]">
                  <span className="font-kanit leading-4">0 - 1500 ตัวอักษร</span>
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
                    {selectedFiles.map((file, index) => {
                      const fileKey = file.s3key || file.S3Key || file.fileKey;
                      const fileName = file.fileName || file.FileName || file.name;
                      const fileUrl = `/API/Outage/file?key=${encodeURIComponent(fileKey || '')}`;
                      const isImage = !!fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                      
                      return (
                        <div key={index} className="pl-1.5 pr-2 py-1 bg-[#FFF5FD] border border-[#FED8F6] rounded-full flex items-center gap-2 max-w-full h-10 animate-fade-in shadow-sm">
                          {isImage ? (
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#FED8F6] shrink-0">
                              <img 
                                src={fileUrl} 
                                className="w-full h-full object-cover" 
                                alt="thumbnail" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%23A80689" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/%3E%3C/svg%3E';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-fuchsia-50 flex items-center justify-center shrink-0">
                               <span className="material-symbols-outlined text-[16px] text-[#A80689]">description</span>
                            </div>
                          )}
                          <span className="text-[#A80689] text-[13px] font-medium truncate max-w-[120px]">{fileName}</span>
                          <div 
                            onClick={() => removeFile(index)}
                            className="w-5 h-5 rounded-full hover:bg-fuchsia-100 cursor-pointer text-[#A80689] flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </div>
                        </div>
                      );
                    })}
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
        <div className="flex-1 bg-[#f9f9fc] flex flex-col items-center w-full overflow-y-auto">
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
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
                      <div className="self-stretch inline-flex justify-between items-start gap-2">
                        <div className="justify-start text-[#101828] text-xs font-medium font-kanit leading-4">
                          {outageTypes.find(t => (t.pftId || t.PFTId || t.id)?.toString() === (item.pftId || item.PFTId || item.pftid)?.toString())?.outageTypeName || 
                           outageTypes.find(t => (t.pftId || t.PFTId || t.id)?.toString() === (item.pftId || item.PFTId || item.pftid)?.toString())?.OutageTypeName || 
                           item.title || item.Title || "ไฟฟ้าขัดข้อง"}
                        </div>
                        <div className="justify-start text-[#667085] text-[10px] font-normal font-kanit leading-4 text-right shrink-0">{item.createDate || item.CreateDate}</div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start gap-1">
                        <div className="self-stretch justify-start text-[#101828] text-sm font-semibold font-kanit leading-4 line-clamp-2">{item.content || item.Content || "แจ้งปัญหาไฟฟ้าขัดข้อง"}</div>
                        <div className="self-stretch justify-start mt-1">
                          <span className="text-[#667085] text-xs font-normal font-kanit leading-4">หมายเลขผู้ใช้ไฟฟ้า </span>
                          <span className="text-[#667085] text-xs font-normal font-kanit leading-4">{item.ca || item.Ca || "-"}</span>
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
          <div className="w-full max-w-xl md:max-w-2xl">
            <button 
              onClick={handleSubmit}
              disabled={!selectedLocation || isSubmitting}
              className={`w-full py-4 rounded-full text-xl font-medium font-kanit leading-7 flex justify-center items-center gap-3 transition-all ${
                (!selectedLocation || isSubmitting)
                ? "bg-[#F2F4F7] text-[#98A1B2] cursor-not-allowed" 
                : "bg-[#A80689] text-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(16,24,40,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 active:scale-[0.98]"
              }`}
            >
              {isSubmitting && <div className="w-5 h-5 border-2 border-[#98A1B2] border-t-transparent rounded-full animate-spin"></div>}
              {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยัน'}
            </button>
          </div>
        </div>
      )}

      {/* --- ALL BOTTOM SHEETS REMAIN IDENTICAL TO YOUR PREVIOUS CODE --- */}
      {isLocationSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-[#101828]/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsLocationSheetOpen(false)}></div>
          <div className="w-full max-w-xl md:max-w-2xl mx-auto bg-white rounded-t-3xl flex flex-col relative z-10 animate-slide-in-bottom shadow-[0_-8px_40px_rgba(0,0,0,0.12)]">
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
                          if (ca) fetchLocationDetail(ca);
                        }}
                      >
                        <div className="flex flex-col gap-1 flex-1 min-w-0 pr-3">
                          <span className="text-[#101828] text-base font-semibold truncate">{name}</span>
                          <span className="text-[#475467] text-[13px]">หมายเลขผู้ใช้ไฟ (CA) <span className="font-kanit text-[13px] tracking-wide bg-gray-50 px-1 py-0.5 rounded">{ca}</span></span>
                          {address ? <span className="text-[#667085] text-[12px] leading-4 line-clamp-2">{address}</span> : null}
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
          <div className="w-full max-w-xl md:max-w-2xl mx-auto bg-white rounded-t-2xl flex flex-col relative z-10 animate-slide-in-bottom shadow-xl">
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
                        <div className={`self-stretch justify-start text-base font-normal font-kanit leading-6 ${selectedOutageType === val ? 'text-[#A80689] font-medium' : 'text-[#101828]'}`}>{text}</div>
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
          <div className="w-full max-w-xl md:max-w-2xl mx-auto px-5 pt-10 pb-14 bg-white rounded-t-2xl flex flex-col items-center gap-10 relative z-10 animate-slide-in-bottom">
            <div className="self-stretch flex flex-col justify-start items-center gap-4">
              <div className="self-stretch flex flex-col justify-center items-center gap-4">
                <div className="self-stretch flex flex-col justify-start items-center gap-2">
                  <div className="w-80 text-center justify-start text-[#101828] text-xl font-bold font-kanit leading-7">ตัวอย่างการดูข้อมูลสถานที่ใช้ไฟฟ้า ในใบแจ้งค่าไฟฟ้า</div>
                </div>
              </div>
              <img className="w-full aspect-video object-cover rounded-lg border border-[#E4E7EC]" src="/images/ref/ref.png" alt="Example Bill Info" />
            </div>
            <div className="self-stretch flex flex-col justify-center items-start gap-5 w-full">
              <div 
                className="self-stretch px-5 py-4 bg-[#A80689] rounded-full shadow-sm inline-flex justify-center items-center gap-2.5 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => setIsExampleSheetOpen(false)}
              >
                <div className="justify-start text-white text-xl font-medium font-kanit leading-7">เข้าใจแล้ว</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCallSheetOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end items-center font-kanit pb-8 px-2">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCallSheetOpen(false)}></div>
          <div className="w-full max-w-xl md:max-w-2xl relative rounded-2xl flex flex-col justify-start items-center overflow-hidden mb-2 shadow-sm animate-slide-in-bottom">
            <div className="w-full absolute inset-0 bg-[#f4f4f4] bg-opacity-[0.8] backdrop-blur-[20px]"></div>
            <a href="tel:1129" className="self-stretch h-14 relative border-b border-[#c6c6c8] flex items-center justify-center active:bg-black/10 transition-colors z-10 cursor-pointer">
              <div className="text-center justify-center text-[#007AFF] text-[20px] font-normal leading-5">Call 1129</div>
            </a>
          </div>
          <div 
            className="w-full max-w-xl md:max-w-2xl h-14 relative rounded-2xl flex flex-col justify-center items-center overflow-hidden shadow-sm animate-slide-in-bottom z-10 cursor-pointer active:bg-black/10 transition-colors bg-white font-semibold mb-2"
            onClick={() => setIsCallSheetOpen(false)}
          >
            <div className="text-center justify-center text-[#007AFF] text-[20px] leading-5">Cancel</div>
          </div>
        </div>
      )}

      {isDetailModalOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#F9FAFB] font-kanit">
          {/* Header */}
          <div className="bg-white px-2 py-3 border-b border-[#F2F4F7] flex items-center justify-between shadow-sm sticky top-0 z-20">
            <div 
              onClick={() => {
                setIsDetailModalOpen(false);
                setSelectedHistoryDetail(null);
                setActiveDetailTab('details');
              }}
              className="p-3 rounded-full hover:bg-gray-100 cursor-pointer text-[#101828]"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                 <span className="material-symbols-outlined">arrow_back_ios_new</span>
              </div>
            </div>
            <h1 className="flex-1 text-center text-xl font-medium text-[#101828]">รายละเอียดการแจ้ง</h1>
            <div className="w-11" /> {/* Spacer */}
          </div>

          {/* Tabs */}
          <div className="flex bg-white px-5 border-b border-[#E4E7EC] sticky top-[60px] z-20">
            <button 
              onClick={() => setActiveDetailTab('details')}
              className={`flex-1 py-4 text-center text-lg font-medium transition-all ${
                activeDetailTab === 'details' 
                ? "text-[#A80689] border-b-2 border-[#A80689]" 
                : "text-[#475467]"
              }`}
            >
              รายละเอียด
            </button>
            <button 
              onClick={() => setActiveDetailTab('status')}
              className={`flex-1 py-4 text-center text-lg font-medium transition-all ${
                activeDetailTab === 'status' 
                ? "text-[#A80689] border-b-2 border-[#A80689]" 
                : "text-[#475467]"
              }`}
            >
              สถานะ
            </button>
          </div>

          {/* Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 pb-10">
            {isDetailLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-[#A80689] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#475467]">กำลังโหลดข้อมูล...</p>
              </div>
            ) : selectedHistoryDetail ? (
              <div className="flex flex-col gap-5">
                {activeDetailTab === 'details' ? (
                  <>
                    {(() => {
                      const detail = selectedHistoryDetail.detail || selectedHistoryDetail.Detail || selectedHistoryDetail;
                      const fileList = selectedHistoryDetail.fileList || selectedHistoryDetail.FileList || [];

                      return (
                        <>
                          {/* 1. รายละเอียดที่แจ้ง */}
                          <div className="w-full px-5 py-6 bg-white rounded-2xl flex flex-col justify-start items-start gap-5 shadow-sm">
                            <div className="self-stretch inline-flex justify-start items-start gap-5">
                              <div className="justify-start text-[#101828] text-base font-semibold font-kanit leading-6">รายละเอียดที่แจ้ง</div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start gap-1">
                              <div className="self-stretch inline-flex justify-start items-center flex-wrap content-center">
                                <div className="justify-start text-[#101828] text-base font-medium font-kanit leading-6">
                                  {outageTypes.find(t => (t.pftId || t.PFTId || t.id)?.toString() === (detail.pftId || detail.PFTId || detail.pftid)?.toString())?.outageTypeName || 
                                   outageTypes.find(t => (t.pftId || t.PFTId || t.id)?.toString() === (detail.pftId || detail.PFTId || detail.pftid)?.toString())?.OutageTypeName || 
                                   detail.title || detail.Title || "ไฟฟ้าขัดข้อง"}
                                </div>
                              </div>
                              <div className="justify-center text-[#475467] text-xs font-normal font-kanit leading-4">วันที่แจ้ง: {detail.createDate || detail.CreateDate || "ไม่ระบุวันที่"}</div>
                            </div>
                            <div className="self-stretch flex flex-col justify-center items-center gap-2.5">
                              <div className="self-stretch h-0 border-b border-[#E4E7EC]"></div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start gap-5">
                              <div className="self-stretch flex flex-col justify-start items-start gap-5">
                                <div className="self-stretch inline-flex justify-start items-start gap-1">
                                  <div className="justify-start text-[#344054] text-base font-normal font-kanit leading-6">รายละเอียด</div>
                                </div>
                                <div className="self-stretch inline-flex justify-start items-start gap-3">
                                  <div className="w-full justify-start text-[#101828] text-base font-medium font-kanit leading-6">{detail.memo || detail.content || detail.Content || "ไม่ระบุรายละเอียด"}</div>
                                </div>
                              </div>
                            </div>
                            <div className="self-stretch inline-flex justify-start items-start gap-1">
                              <div className="justify-start text-[#344054] text-base font-normal font-kanit leading-6">รูปภาพ / เอกสารแนบอื่นๆ</div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                              {fileList.length > 0 ? fileList.map((file: any, index: number) => {
                                const fileKey = file.s3key || file.S3Key || file.fileKey;
                                const fileName = file.fileName || file.FileName || file.name || `ไฟล์_${index + 1}`;
                                const fileUrl = `/API/Outage/file?key=${encodeURIComponent(fileKey || '')}`;

                                return (
                                  <a 
                                    key={index}
                                    href={fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="pr-3 py-2 rounded-full inline-flex justify-center items-center gap-1 overflow-hidden hover:bg-fuchsia-50 transition-colors"
                                  >
                                    <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
                                      <span className="material-symbols-outlined text-[20px] text-[#A80689]">description</span>
                                    </div>
                                    <div className="px-0.5 flex justify-center items-center">
                                      <div className="justify-start text-[#A80689] text-sm font-semibold font-kanit leading-5">{fileName}</div>
                                    </div>
                                  </a>
                                );
                              }) : (
                                <div className="text-[#98A2B3] text-sm font-normal font-kanit italic">ไม่มีไฟล์แนบ</div>
                              )}
                            </div>
                          </div>

                            {/* 2. พื้นที่เกิดเหตุ */}
                            <div className="w-full px-5 py-6 bg-white rounded-2xl flex flex-col justify-start items-start gap-5 shadow-sm">
                              <div className="self-stretch inline-flex justify-start items-start gap-5">
                                <div className="justify-start text-[#101828] text-base font-semibold font-kanit leading-6">พื้นที่เกิดเหตุ</div>
                              </div>
                              <div className="self-stretch flex flex-col gap-4">
                                <div className="self-stretch inline-flex justify-between items-start gap-4">
                                  <div className="justify-start text-[#344054] text-base font-normal font-kanit leading-6 shrink-0">หมายเลขผู้ใช้ไฟฟ้า</div>
                                  <div className="text-right text-[#101828] text-base font-medium font-kanit leading-6">{detail.ca || detail.Ca || "-"}</div>
                                </div>
                                <div className="self-stretch inline-flex justify-between items-start gap-4">
                                  <div className="justify-start text-[#344054] text-base font-normal font-kanit leading-6 shrink-0">ที่อยู่</div>
                                  <div className="text-right text-[#101828] text-base font-medium font-kanit leading-6 break-words">{detail.location || detail.Location || detail.address || detail.Address || "-"}</div>
                                </div>
                                <div className="self-stretch inline-flex justify-between items-center gap-4">
                                  <div className="justify-start text-[#344054] text-base font-normal font-kanit leading-6 shrink-0">การไฟฟ้าที่รับผิดชอบ</div>
                                  <div className="text-right text-[#101828] text-base font-medium font-kanit leading-6">{detail.peaName || detail.PeaName || detail.peaNo || detail.PeaNo || "-"}</div>
                                </div>
                              </div>
                            </div>

                          {/* 3. ข้อมูลผู้แจ้ง */}
                          <div className="w-full px-5 py-6 bg-white rounded-2xl flex flex-col justify-start items-start gap-5 shadow-sm">
                            <h3 className="text-[#101828] text-base font-semibold font-kanit">ข้อมูลผู้แจ้ง</h3>
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-[#FFF5FD] rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[16px] text-[#CF07AA]">person</span>
                              </div>
                              <span className="text-[#101828] text-base font-normal font-kanit">{detail.contactName || detail.ContactName || "ไม่ระบุชื่อ"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-[#FFF5FD] rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[16px] text-[#CF07AA]">call</span>
                              </div>
                              <span className="text-[#101828] text-base font-normal font-kanit">{detail.contactPhoneNo || detail.ContactPhoneNo || "-"}</span>
                            </div>
                          </div>

                          {/* 4. ศูนย์ช่วยเหลือ */}
                          <div className="w-full px-5 pt-6 bg-white rounded-2xl flex flex-col justify-start items-start gap-5 shadow-sm mb-6">
                             <h3 className="text-[#101828] text-base font-bold font-kanit leading-6">ศูนย์ช่วยเหลือ</h3>
                             <a href="tel:1129" className="self-stretch py-4 border-t border-[#E4E7EC] flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-8 bg-[#FFF5FD] rounded-lg flex items-center justify-center shrink-0">
                                   <span className="material-symbols-outlined text-[#CF07AA] text-[20px]">headset_mic</span>
                                </div>
                                <div className="flex-1">
                                  <span className="text-[#101828] text-base font-medium font-kanit">ติดต่อ 1129 PEA Contact Center</span>
                                </div>
                                <div className="text-[#98A2B3]">
                                  <span className="material-symbols-outlined">chevron_right</span>
                                </div>
                             </a>
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  /* Status Tab */
                  <div className="bg-white p-6 rounded-2xl flex flex-col gap-2 shadow-sm">
                    {(() => {
                       const statusList = selectedHistoryDetail.reportStatusList || selectedHistoryDetail.ReportStatusList || [];
                       if (statusList.length === 0) {
                         return <div className="py-10 text-center text-gray-400">ไม่มีข้อมูลสถานะ</div>;
                       }
                       return statusList.map((status: any, idx: number) => (
                          <div key={idx} className={`py-4 flex gap-4 ${idx !== statusList.length - 1 ? "border-b border-[#E4E7EC]" : ""}`}>
                             <div className="flex flex-col items-center shrink-0">
                                <div className={`w-2.5 h-2.5 rounded-full mt-2 ${idx === 0 ? "bg-[#A80689]" : "bg-[#D1D5DB]"}`} />
                                {idx !== statusList.length - 1 && <div className="w-[1px] flex-1 bg-[#E5E7EB] mt-1" />}
                             </div>
                             <div className="flex flex-col gap-1 flex-1">
                                <span className="text-[#667085] text-[11px] font-normal">{status.createDate || status.CreateDate}</span>
                                <span className="text-[#101828] text-base font-semibold leading-6">{status.title || status.Title || "-"}</span>
                                <span className="text-[#475467] text-sm font-normal leading-5">{status.content || status.Content || "-"}</span>
                             </div>
                          </div>
                       ));
                    })()}
                  </div>
                )}
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
          <div className="w-full max-w-xl md:max-w-2xl mx-auto bg-white rounded-t-3xl flex flex-col items-center px-6 pt-8 pb-12 relative z-10 animate-slide-in-bottom shadow-[0_-8px_40px_rgba(0,0,0,0.15)]">
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