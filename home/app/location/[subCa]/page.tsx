"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { checkInternalAndExternalCAView, ebillSessionKeys, extractResultFlag, type CheckInternalExternalResult } from "@/lib/ebill";
import { getElectricLocationBySubCA } from "@/lib/electric-location-mock";

type ApiState = {
  resultFlag: number;
  raw: CheckInternalExternalResult | null;
};

const ACTION_ITEMS = [
  { icon: "history", label: "ประวัติการใช้ไฟ" },
  { icon: "qr_code_scanner", label: "QR/บาร์โค้ด" },
  { icon: "qr_code_2", label: "QR/บาร์โค้ด" },
  { icon: "location_on", label: "แจ้งปัญหา" },
  { icon: "apps", label: "ดูเพิ่มเติม" },
];

function ActionCircle({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex w-[62px] flex-col items-center gap-2 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#FDE7F7_0%,#D81B92_100%)] text-white shadow-[0_8px_18px_rgba(216,27,146,0.25)]">
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      <span className="text-[11px] leading-4 text-[#344054]">{label}</span>
    </div>
  );
}

function BillRow() {
  return (
    <div className="border-b border-[#EAECF0] py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[18px] font-bold text-[#344054]">มิ.ย. 2568 <span className="text-[14px] font-medium text-[#667085]">(367 หน่วย)</span></div>
          <div className="mt-1 text-[14px] text-[#667085]">กำหนดชำระ: 20 ก.ค. 2568</div>
        </div>
        <div className="text-right">
          <div className="text-[20px] font-bold">1,287.21 บาท</div>
          <div className="mt-1 text-[15px] font-bold text-[#C11574]">ดูบิล</div>
        </div>
      </div>
    </div>
  );
}

export default function ElectricLocationDetailPage() {
  const params = useParams<{ subCa: string }>();
  const router = useRouter();
  const { profile } = useUserProfile();
  const subCA = decodeURIComponent(params.subCa);
  const card = useMemo(() => getElectricLocationBySubCA(subCA), [subCA]);
  const [apiState, setApiState] = useState<ApiState>({ resultFlag: 0, raw: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const cached = sessionStorage.getItem(ebillSessionKeys.checkResult(subCA));
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as CheckInternalExternalResult;
          if (active) {
            setApiState({ resultFlag: extractResultFlag(parsed), raw: parsed });
            setLoading(false);
          }
          return;
        } catch {
          // continue to refetch
        }
      }

      try {
        const response = await checkInternalAndExternalCAView(subCA, 6);
        if (!active) return;
        sessionStorage.setItem(ebillSessionKeys.checkResult(subCA), JSON.stringify(response));
        setApiState({ resultFlag: extractResultFlag(response), raw: response });
      } catch (error) {
        console.error("CheckInternalAndExternalCAView failed", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, [subCA]);

  const showEnrollButton = apiState.resultFlag === 1;

  return (
    <div className="h-full overflow-y-auto bg-[#F8F4FA] pb-32 text-[#101828]">
      <div className="bg-[linear-gradient(135deg,#FCE8F6_0%,#FCE8F6_55%,#F7D0EB_100%)] px-6 pb-8 pt-6">
        <div className="mb-8 flex items-center justify-between text-[#101828]">
          <div className="text-[16px] font-medium">9:41</div>
          <div className="flex items-center gap-3 text-[20px]">
            <span className="material-symbols-outlined">signal_cellular_alt</span>
            <span className="material-symbols-outlined">wifi</span>
            <span className="material-symbols-outlined">battery_full</span>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <button type="button" onClick={() => router.back()} className="text-[#344054]">
            <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
          </button>
          <h1 className="text-[22px] font-bold">สถานที่ใช้ไฟฟ้าของฉัน</h1>
          <span className="material-symbols-outlined text-[28px] text-[#344054]">sync_alt</span>
        </div>

        <div className="rounded-[26px] bg-white p-5 shadow-[0_14px_30px_rgba(16,24,40,0.08)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[18px] font-bold">
                <span>{card?.ownerName || profile.fullName}</span>
                <span className="material-symbols-outlined text-[18px] text-[#C11574]">settings</span>
              </div>
              <div className="text-[13px] leading-5 text-[#475467]">{card?.address || profile.currentAddress}</div>
            </div>
            <button className="rounded-2xl bg-[linear-gradient(180deg,#C11574_0%,#9E0E8E_100%)] px-5 py-3 text-[18px] font-bold text-white shadow-[0_10px_24px_rgba(193,21,116,0.25)]">
              จ่ายบิล
            </button>
          </div>

          <div className="mb-5 flex items-center justify-between border-b border-[#EAECF0] pb-5">
            <div className="text-[17px] font-bold">หมายเลขผู้ใช้ไฟฟ้า</div>
            <div className="text-[20px] font-bold tracking-wide">{subCA}</div>
          </div>

          <div className="flex items-start justify-between gap-3 overflow-x-auto no-scrollbar">
            {ACTION_ITEMS.map((item) => (
              <ActionCircle key={item.label + item.icon} icon={item.icon} label={item.label} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-5">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-2.5 w-8 rounded-full bg-[#C11574]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
        </div>

        {showEnrollButton ? (
          <Link
            href={`/ebill?subCA=${subCA}`}
            className="mb-5 flex items-center justify-between gap-3 rounded-[28px] border border-[#6AC746] bg-[linear-gradient(90deg,#ECFFF6_0%,#F6FFF0_100%)] px-5 py-4 shadow-[0_12px_20px_rgba(106,199,70,0.08)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#A5F5A9_0%,#44B832_100%)] text-white shadow-[0_8px_20px_rgba(68,184,50,0.2)]">
                <span className="material-symbols-outlined text-[28px]">public</span>
              </div>
              <div>
                <div className="text-[20px] font-bold">รับ e-Bill และ e-Receipt</div>
                <div className="text-[15px] font-semibold text-[#16703A]">แทนการรับบิลกระดาษ</div>
                <div className="text-[13px] text-[#16A34A]">เปลี่ยนเพื่อโลกที่ดีกว่า เริ่มง่าย ๆ ได้ที่คุณ</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[28px] text-[#101828]">chevron_right</span>
          </Link>
        ) : null}

        <div className="mb-4 flex rounded-full border border-[#D0D5DD] bg-white p-1">
          <button className="flex-1 rounded-full bg-[linear-gradient(180deg,#C11574_0%,#9E0E8E_100%)] px-4 py-3 text-[18px] font-bold text-white">บิลและการชำระเงิน</button>
          <button className="flex-1 rounded-full px-4 py-3 text-[18px] font-bold text-[#667085]">ข้อมูลสถานที่ใช้ไฟฟ้า</button>
        </div>

        <div className="rounded-[28px] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(16,24,40,0.06)]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="text-[18px] font-bold">ประวัติย้อนหลัง 6 เดือนที่ผ่านมา</div>
            <button className="rounded-full border-2 border-[#C11574] px-4 py-2 text-[16px] font-bold text-[#C11574]">ดูข้อมูลการใช้ไฟฟ้า</button>
          </div>
          <BillRow />
          <BillRow />
        </div>

        <div className="mt-4 rounded-2xl bg-white/70 p-4 text-[13px] text-[#667085]">
          <div>ผลลัพธ์ CheckInternalAndExternalCAView: <span className="font-bold text-[#101828]">{loading ? "กำลังโหลด" : apiState.resultFlag}</span></div>
          {apiState.raw ? <div className="mt-1">ระบบจะโชว์ปุ่มเขียวเฉพาะเมื่อ result = 1</div> : null}
        </div>
      </div>
    </div>
  );
}
