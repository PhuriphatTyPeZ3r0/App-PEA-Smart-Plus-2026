"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { checkInternalAndExternalCAView, ebillSessionKeys, syncCAFromElectricCheckUpdateInsert } from "@/lib/ebill";
import { ELECTRIC_LOCATION_CARDS, type ElectricLocationCard } from "@/lib/electric-location-mock";

type TabKey = "all" | "mine" | "favorite";

function StatusChip() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#D0D5DD] bg-white px-3 py-1 text-[13px] font-medium text-[#475467] shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FDB022]" />
      ไม่มียอดค้างชำระ
    </div>
  );
}

function LocationIcon({ tone = "purple" }: { tone?: ElectricLocationCard["iconTone"] }) {
  const toneClass =
    tone === "gold"
      ? "bg-[#FDF1D6] text-[#D9A441]"
      : "bg-[#FBE7F7] text-[#B423A2]";

  return (
    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${toneClass}`}>
      <span className="material-symbols-outlined text-[28px]">bolt</span>
    </div>
  );
}

function SegmentButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-2.5 text-[16px] font-semibold transition-colors ${
        active
          ? "border-[#C11574] bg-[#C11574] text-white shadow-[0_8px_18px_rgba(193,21,116,0.22)]"
          : "border-[#D5D9EB] bg-white text-[#344054]"
      }`}
    >
      {children}
    </button>
  );
}

export default function ElectricLocationListPage() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [syncing, setSyncing] = useState(true);
  const [openingSubCA, setOpeningSubCA] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        await syncCAFromElectricCheckUpdateInsert(profile.idenNumber);
      } catch (error) {
        console.error("SyncCAFromElectricCheckUpdateInsert failed", error);
      } finally {
        if (alive) {
          setSyncing(false);
        }
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [profile.idenNumber]);

  const cards = useMemo(() => {
    if (activeTab === "mine") {
      return ELECTRIC_LOCATION_CARDS.slice(0, 3);
    }
    if (activeTab === "favorite") {
      return ELECTRIC_LOCATION_CARDS.filter((item) => item.isFavorite);
    }
    return ELECTRIC_LOCATION_CARDS;
  }, [activeTab]);

  const openCard = async (card: ElectricLocationCard) => {
    setOpeningSubCA(card.subCA);
    try {
      const response = await checkInternalAndExternalCAView(card.subCA, 6);
      sessionStorage.setItem(ebillSessionKeys.checkResult(card.subCA), JSON.stringify(response));
      router.push(`/location/${card.subCA}`);
    } catch (error) {
      console.error("CheckInternalAndExternalCAView failed", error);
      router.push(`/location/${card.subCA}`);
    } finally {
      setOpeningSubCA(null);
    }
  };

  return (
    <div className="relative h-full overflow-y-auto bg-[#F7EEF7] pb-32 text-[#101828]">
      <div className="bg-[linear-gradient(135deg,#FCE8F6_0%,#FCE8F6_55%,#F7D0EB_100%)] px-7 pb-10 pt-6">
        <div className="mb-10 flex items-center justify-between text-[#101828]">
          <div className="text-[16px] font-medium">9:41</div>
          <div className="flex items-center gap-3 text-[20px]">
            <span className="material-symbols-outlined">signal_cellular_alt</span>
            <span className="material-symbols-outlined">wifi</span>
            <span className="material-symbols-outlined">battery_full</span>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-[26px] font-bold tracking-tight">สถานที่ใช้ไฟฟ้า</h1>
          <div className="flex items-center gap-4 text-[#101828]">
            <span className="material-symbols-outlined text-[32px]">search</span>
            <span className="material-symbols-outlined text-[32px]">add</span>
            <span className="material-symbols-outlined text-[32px]">sync_alt</span>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <SegmentButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
            ทั้งหมด
          </SegmentButton>
          <SegmentButton active={activeTab === "mine"} onClick={() => setActiveTab("mine")}>
            ของฉัน (3)
          </SegmentButton>
          <SegmentButton active={activeTab === "favorite"} onClick={() => setActiveTab("favorite")}>
            รายการโปรด (1)
          </SegmentButton>
        </div>
      </div>

      <div className="px-6 pb-10 pt-6">
        <div className="mb-4 flex items-end gap-2">
          <h2 className="text-[18px] font-bold">สถานที่ใช้ไฟฟ้าหลัก</h2>
          <span className="text-[13px] font-medium text-[#667085]">(แสดงผลในหน้าแรก)</span>
        </div>

        <div className="space-y-5">
          {cards.map((card) => {
            const isOpening = openingSubCA === card.subCA;
            return (
              <button
                type="button"
                key={card.subCA}
                onClick={() => openCard(card)}
                className="w-full rounded-[28px] bg-white p-6 text-left shadow-[0_10px_30px_rgba(16,24,40,0.08)] transition-transform active:scale-[0.99]"
              >
                <div className="flex items-start gap-4">
                  <LocationIcon tone={card.iconTone} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-[18px] font-bold leading-none">{card.title}</div>
                    <div className="mb-4 text-[15px] leading-6 text-[#667085]">{card.address}</div>
                    <div className="mb-4 text-[15px] font-semibold text-[#475467]">
                      หมายเลขผู้ใช้ไฟฟ้า: <span className="ml-2">{card.subCA}</span>
                    </div>
                    <StatusChip />
                  </div>
                </div>
                {isOpening ? <div className="mt-4 text-[13px] text-[#C11574]">กำลังตรวจสอบ Ebill...</div> : null}
              </button>
            );
          })}
        </div>
      </div>

      {syncing ? (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 mx-auto w-fit rounded-full bg-[#101828] px-4 py-2 text-sm text-white shadow-xl">
          กำลัง Sync CA จากไฟฟ้า...
        </div>
      ) : null}
    </div>
  );
}
