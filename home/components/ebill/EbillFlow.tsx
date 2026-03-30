"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import {
  addCancelSubCAAnswer,
  checkCAOwner1,
  checkRegisterWdp,
  EBILL_STORAGE_KEYS,
  extractBooleanResult,
  getSelectChannel,
  requestEmailOtp,
  saveChannel,
  type ChannelSelectionResult,
  type CheckCAOwnerResult,
  type EbillDocType,
  type EbillEnvelope,
  type SaveChannelPayload,
  type SelectChannel,
  verifyEmailOtp,
} from "@/lib/ebill";
import { formatPhone, isValidEmail, maskEmail, normalizeEmail } from "@/lib/user-profile";

const CANCEL_REASONS = [
  { code: 1, label: "ใช้ใบเสร็จฯ ในการเบิกค่าใช้จ่าย" },
  { code: 2, label: "ใช้ใบเสร็จฯ ในการตรวจสอบรายละเอียด" },
  { code: 3, label: "ไม่สะดวกใช้งานระบบออนไลน์" },
  { code: 4, label: "อื่น ๆ" },
] as const;

type Step =
  | "loading"
  | "intro"
  | "docType"
  | "tnc"
  | "channel"
  | "emailInput"
  | "emailOtp"
  | "wdp"
  | "success";

function PageFrame({ children }: { children: React.ReactNode }) {
  return <div className="min-h-full bg-[#F8F4FA] pb-24 text-[#101828]">{children}</div>;
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-20 bg-[#F8F4FA]/95 px-6 pb-4 pt-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between text-[#101828]">
        <div className="text-[16px] font-medium">9:41</div>
        <div className="flex items-center gap-3 text-[20px]">
          <span className="material-symbols-outlined">signal_cellular_alt</span>
          <span className="material-symbols-outlined">wifi</span>
          <span className="material-symbols-outlined">battery_full</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" onClick={onBack} className="text-[#344054]">
          <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-[26px] font-bold">{title}</h1>
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-[20px] bg-[linear-gradient(180deg,#C11574_0%,#9E0E8E_100%)] px-5 py-4 text-[18px] font-bold text-white shadow-[0_14px_28px_rgba(193,21,116,0.25)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[20px] border-2 border-[#C11574] px-5 py-4 text-[18px] font-bold text-[#C11574] ${className}`}
    >
      {children}
    </button>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] bg-white p-5 shadow-[0_12px_24px_rgba(16,24,40,0.08)] ${className}`}>{children}</div>;
}

function RadioMark({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
        active ? "border-[#C11574] bg-[#C11574]" : "border-[#D0D5DD] bg-white"
      }`}
    >
      {active ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
    </span>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <PageFrame>
      <Header title="สมัครรับ e-Bill แทนบิลกระดาษ" onBack={() => history.back()} />
      <div className="px-6 pt-10">
        <SectionCard className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F4E8FF] text-[#C11574]">
            <span className="material-symbols-outlined animate-spin text-[30px]">progress_activity</span>
          </div>
          <div className="text-[18px] font-bold">{text}</div>
        </SectionCard>
      </div>
    </PageFrame>
  );
}

export default function EbillFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useUserProfile();
  const subCA = searchParams.get("subCA") || profile.ca;

  const [step, setStep] = useState<Step>("loading");
  const [docType, setDocType] = useState<EbillDocType | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<CheckCAOwnerResult | null>(null);
  const [channelInfo, setChannelInfo] = useState<ChannelSelectionResult | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<SelectChannel | null>(null);
  const [saving, setSaving] = useState(false);
  const [screenError, setScreenError] = useState<string>("");
  const [emailInput, setEmailInput] = useState(profile.email || "");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpRequestedFor, setOtpRequestedFor] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [cancelMode, setCancelMode] = useState(false);
  const [cancelReasonCode, setCancelReasonCode] = useState<number | null>(null);
  const [cancelOtherText, setCancelOtherText] = useState("");

  const actorId = Number(profile.id || 6) || 6;
  const smsPhone = channelInfo?.data?.subPhone || profile.phone;
  const existingEmail = channelInfo?.data?.subEmailAddress || verifiedEmail || profile.email;
  const currentSubStatus = Number(channelInfo?.data?.subStatus ?? 0);
  const currentSubChannel = Number(channelInfo?.data?.subChannel ?? 0) as SelectChannel;

  const canSelectDocB = useMemo(() => {
    const value = ownerInfo?.data?.subDocTypeB;
    if (value == null) return true;
    return String(value).trim() !== "";
  }, [ownerInfo]);

  const canSelectDocR = useMemo(() => {
    const value = ownerInfo?.data?.subDocTypeR;
    if (value == null) return true;
    return String(value).trim() !== "";
  }, [ownerInfo]);

  const loadOwnerAndNext = async () => {
    setScreenError("");
    setStep("loading");
    try {
      const owner = await checkCAOwner1(subCA);
      setOwnerInfo(owner);
      const introSeen = window.localStorage.getItem(EBILL_STORAGE_KEYS.introSeen) === "1";
      if (!introSeen) {
        setStep("intro");
        return;
      }
      setStep("docType");
    } catch (error) {
      console.error("CheckCAOwner1 failed", error);
      setScreenError("ไม่สามารถตรวจสอบข้อมูลสิทธิ์การสมัครได้");
      setStep("docType");
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const owner = await checkCAOwner1(subCA);
        if (!alive) return;
        setOwnerInfo(owner);
        const introSeen = window.localStorage.getItem(EBILL_STORAGE_KEYS.introSeen) === "1";
        setStep(introSeen ? "docType" : "intro");
      } catch (error) {
        console.error("CheckCAOwner1 failed", error);
        if (alive) {
          setScreenError("ไม่สามารถตรวจสอบข้อมูลสิทธิ์การสมัครได้");
          setStep("docType");
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [subCA]);

  const goToTncOrChannel = async (nextDocType: EbillDocType) => {
    setDocType(nextDocType);
    setScreenError("");
    const accepted = window.localStorage.getItem(EBILL_STORAGE_KEYS.tncSeen) === "1";
    if (!accepted) {
      setStep("tnc");
      return;
    }
    await loadChannels(nextDocType);
  };

  const loadChannels = async (nextDocType: EbillDocType) => {
    setStep("loading");
    setScreenError("");
    try {
      const response = await getSelectChannel(subCA, nextDocType);
      setChannelInfo(response);
      const existingChannel = Number(response?.data?.subChannel ?? 0) as SelectChannel;
      if ([1, 2, 3].includes(existingChannel)) {
        setSelectedChannel(existingChannel);
      } else {
        setSelectedChannel(null);
      }
      const upstreamEmail = normalizeEmail(String(response?.data?.subEmailAddress || ""));
      if (upstreamEmail) {
        setVerifiedEmail(upstreamEmail);
        setEmailInput(upstreamEmail);
      }
      setStep("channel");
    } catch (error) {
      console.error("GetSelectChannel failed", error);
      setScreenError("ไม่สามารถดึงข้อมูลช่องทางรับเอกสารได้");
      setStep("channel");
    }
  };

  const requestOtp = async () => {
    const normalized = normalizeEmail(emailInput);
    if (!isValidEmail(normalized)) {
      setScreenError("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }
    if (!docType) {
      setScreenError("ยังไม่ได้เลือกประเภทเอกสาร");
      return;
    }

    setEmailSubmitting(true);
    setScreenError("");
    try {
      await requestEmailOtp(subCA, docType, normalized, actorId);
      setOtpRequestedFor(normalized);
      setOtpCode("");
      setStep("emailOtp");
    } catch (error) {
      console.error("RequestEmailOtp failed", error);
      setScreenError("ไม่สามารถส่ง OTP ไปยังอีเมลนี้ได้");
    } finally {
      setEmailSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!docType) return;
    if (otpCode.trim().length < 4) {
      setScreenError("กรุณากรอก OTP ให้ครบ");
      return;
    }
    setOtpVerifying(true);
    setScreenError("");
    try {
      await verifyEmailOtp(subCA, docType, otpRequestedFor, otpCode.trim(), actorId);
      setVerifiedEmail(otpRequestedFor);
      setEmailInput(otpRequestedFor);
      setStep("channel");
    } catch (error) {
      console.error("VerifyEmailOtp failed", error);
      setScreenError("OTP ไม่ถูกต้องหรือหมดอายุ");
    } finally {
      setOtpVerifying(false);
    }
  };

  const continueSave = async () => {
    if (!docType || !selectedChannel) {
      setScreenError("กรุณาเลือกช่องทางรับเอกสาร");
      return;
    }
    if (selectedChannel === 3 && !verifiedEmail) {
      setStep("emailInput");
      return;
    }

    setSaving(true);
    setScreenError("");
    try {
      const payload: SaveChannelPayload = {
        pSubCA: subCA,
        pSubDocType: docType,
        pSubStatus: 1,
        pSubChannel: selectedChannel,
        pSubEmail: selectedChannel === 3 ? verifiedEmail : null,
        pSubPhone: selectedChannel === 2 ? smsPhone || null : null,
        pActor: actorId,
      };
      await saveChannel(payload);
      const registerResult = await checkRegisterWdp(actorId);
      const isRegistered = extractBooleanResult(registerResult);
      setStep(isRegistered ? "success" : "wdp");
    } catch (error) {
      console.error("SaveChannel failed", error);
      setScreenError("บันทึกช่องทางรับเอกสารไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const submitCancellation = async () => {
    if (!docType || !cancelReasonCode) {
      setScreenError("กรุณาเลือกเหตุผลการยกเลิก");
      return;
    }
    if (cancelReasonCode === 4 && !cancelOtherText.trim()) {
      setScreenError("กรุณาระบุเหตุผลเพิ่มเติม");
      return;
    }

    setSaving(true);
    setScreenError("");
    try {
      await addCancelSubCAAnswer({
        pSubCA: subCA,
        pSubDocType: docType,
        pReasonCode: cancelReasonCode,
        pOtherText: cancelReasonCode === 4 ? cancelOtherText.trim() : null,
        pActor: actorId,
      });
      const refreshed = await getSelectChannel(subCA, docType);
      setChannelInfo(refreshed);
      setSelectedChannel(null);
      setCancelMode(false);
      setCancelReasonCode(null);
      setCancelOtherText("");
      setStep("success");
    } catch (error) {
      console.error("AddCancelSUBCAAnswer failed", error);
      setScreenError("ไม่สามารถยกเลิกบริการได้");
    } finally {
      setSaving(false);
    }
  };

  if (step === "loading") {
    return <LoadingState text="กำลังเตรียมข้อมูล e-Bill และ e-Receipt" />;
  }

  if (step === "intro") {
    return (
      <PageFrame>
        <Header title="สมัครรับ e-Bill แทนบิลกระดาษ" onBack={() => router.back()} />
        <div className="px-6 pt-4">
          <div className="mb-6 overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#BEE7FF_0%,#FFFFFF_50%,#FFFFFF_100%)]">
            <div className="h-[240px] bg-[linear-gradient(180deg,#99D8FF_0%,#F3FCFF_50%,#FFFFFF_100%)]" />
          </div>
          <div className="mb-4 text-center text-[30px] font-bold leading-tight">PEA ชวนลดโลกร้อน\nสมัครรับ e-Bill และ e-Receipt\nแทนกระดาษ</div>
          <div className="mx-auto mb-8 max-w-[320px] text-center text-[16px] leading-7 text-[#475467]">
            เพื่อการจัดการค่าไฟฟ้าที่สะดวกยิ่งกว่า สะอาด และเป็นมิตรกับสิ่งแวดล้อม
          </div>
          <div className="space-y-4 rounded-[28px] bg-white p-5 shadow-[0_12px_24px_rgba(16,24,40,0.08)]">
            {[
              "เปิดดูข้อมูลบิลย้อนหลังได้ รวดวกว่าบิลกระดาษ 24 ชั่วโมง",
              "รับใบเสร็จรับเงิน ในรูปแบบอิเล็กทรอนิกส์ได้ทันที รับ SMS แจ้งเตือนสำคัญ",
              "หมดกังวลเรื่องเอกสารสูญหาย ดูย้อนหลังข้อมูลย้อนหลังได้ถึง 6 เดือน",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-1 text-[20px] text-[#12B76A]">eco</span>
                <div className="text-[15px] leading-6 text-[#344054]">{item}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 bg-[#F8F4FA] px-6 pb-8 pt-4">
          <PrimaryButton
            onClick={() => {
              window.localStorage.setItem(EBILL_STORAGE_KEYS.introSeen, "1");
              setStep("docType");
            }}
          >
            เริ่มต้นใช้งาน
          </PrimaryButton>
        </div>
      </PageFrame>
    );
  }

  if (step === "docType") {
    return (
      <PageFrame>
        <Header title="เลือกประเภทเอกสาร" onBack={() => router.back()} />
        <div className="space-y-4 px-6 pt-4">
          {screenError ? <div className="rounded-2xl bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">{screenError}</div> : null}
          <SectionCard>
            <button
              type="button"
              disabled={!canSelectDocB}
              onClick={() => goToTncOrChannel("B")}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#D0D5DD] px-4 py-4 text-left disabled:opacity-40"
            >
              <div>
                <div className="text-[18px] font-bold">ใบแจ้งค่าไฟฟ้า</div>
                <div className="text-[14px] text-[#667085]">Smart Invoice</div>
              </div>
              <span className="material-symbols-outlined text-[24px]">chevron_right</span>
            </button>
            <button
              type="button"
              disabled={!canSelectDocR}
              onClick={() => goToTncOrChannel("R")}
              className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-[#D0D5DD] px-4 py-4 text-left disabled:opacity-40"
            >
              <div>
                <div className="text-[18px] font-bold">ใบเสร็จรับเงิน</div>
                <div className="text-[14px] text-[#667085]">e-Receipt / e-Tax invoice</div>
              </div>
              <span className="material-symbols-outlined text-[24px]">chevron_right</span>
            </button>
          </SectionCard>
        </div>
      </PageFrame>
    );
  }

  if (step === "tnc") {
    return (
      <PageFrame>
        <Header title="ข้อตกลงและเงื่อนไข" onBack={() => setStep("docType")} />
        <div className="px-6 pt-4">
          <SectionCard className="text-[15px] leading-7 text-[#344054]">
            <div className="mb-2 text-[24px] font-bold">ข้อตกลงและเงื่อนไข</div>
            <div className="mb-6 text-[14px] text-[#667085]">อัปเดตล่าสุด เมื่อ 15 กรกฎาคม 2568</div>
            <ol className="space-y-4 pl-5">
              <li>การรับบิลอิเล็กทรอนิกส์และการลงทะเบียน e-Bill มีผลยกเลิกการรับเอกสารแบบกระดาษทางไปรษณีย์</li>
              <li>ท่านต้องแจ้งการเปลี่ยนแปลงข้อมูลอีเมลหรือเบอร์โทรให้ถูกต้องเสมอ</li>
              <li>สามารถยกเลิกบริการและกลับไปรับเอกสารกระดาษในภายหลังได้</li>
              <li>กฟภ. จะเก็บรักษาข้อมูลส่วนบุคคลตามนโยบายคุ้มครองข้อมูลส่วนบุคคล</li>
            </ol>
          </SectionCard>
        </div>
        <div className="fixed inset-x-0 bottom-0 bg-[#F8F4FA] px-6 pb-8 pt-4">
          <div className="space-y-3">
            <PrimaryButton
              onClick={() => {
                window.localStorage.setItem(EBILL_STORAGE_KEYS.tncSeen, "1");
                if (docType) {
                  void loadChannels(docType);
                }
              }}
            >
              ยอมรับ
            </PrimaryButton>
            <SecondaryButton onClick={() => setStep("docType")}>ไม่ยอมรับ</SecondaryButton>
          </div>
        </div>
      </PageFrame>
    );
  }

  if (step === "emailInput") {
    return (
      <PageFrame>
        <Header title="ระบุอีเมลรับใบแจ้งค่าไฟฟ้า" onBack={() => setStep("channel")} />
        <div className="px-6 pt-4">
          <SectionCard>
            <label className="mb-3 block text-[16px] font-semibold">อีเมล</label>
            <input
              type="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              placeholder="abc.pea@email.com"
              className="w-full rounded-[18px] border border-[#D0D5DD] px-4 py-4 text-[16px] outline-none focus:border-[#C11574]"
            />
            <div className="mt-3 text-[13px] leading-5 text-[#667085]">เมื่อกดขอ OTP ระบบจะส่งไปยังอีเมลนี้เพื่อยืนยันความเป็นเจ้าของอีเมล</div>
            {screenError ? <div className="mt-4 rounded-2xl bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">{screenError}</div> : null}
          </SectionCard>
        </div>
        <div className="fixed inset-x-0 bottom-0 bg-[#F8F4FA] px-6 pb-8 pt-4">
          <PrimaryButton onClick={requestOtp} disabled={emailSubmitting}>{emailSubmitting ? "กำลังส่ง OTP..." : "ถัดไป"}</PrimaryButton>
        </div>
      </PageFrame>
    );
  }

  if (step === "emailOtp") {
    return (
      <PageFrame>
        <Header title="ยืนยันตัวตน" onBack={() => setStep("emailInput")} />
        <div className="px-6 pt-4">
          <SectionCard>
            <div className="mb-3 text-[24px] font-bold">ยืนยันอีเมล</div>
            <div className="mb-6 text-[15px] leading-6 text-[#667085]">กรอกรหัส OTP 6 หลัก ที่ส่งไปยัง {maskEmail(otpRequestedFor)}</div>
            <input
              inputMode="numeric"
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="กรอกรหัส OTP"
              className="w-full rounded-[18px] border border-[#D0D5DD] px-4 py-4 text-center text-[24px] tracking-[0.35em] outline-none focus:border-[#C11574]"
            />
            {screenError ? <div className="mt-4 rounded-2xl bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">{screenError}</div> : null}
          </SectionCard>
        </div>
        <div className="fixed inset-x-0 bottom-0 bg-[#F8F4FA] px-6 pb-8 pt-4">
          <PrimaryButton onClick={verifyOtp} disabled={otpVerifying}>{otpVerifying ? "กำลังยืนยัน..." : "ยืนยัน OTP"}</PrimaryButton>
        </div>
      </PageFrame>
    );
  }

  if (step === "wdp") {
    return (
      <PageFrame>
        <Header title="Watt-D Point" onBack={() => setStep("success")} />
        <div className="px-6 pt-8">
          <SectionCard className="text-center">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF7E8] text-[#C11574] shadow-[0_12px_24px_rgba(193,21,116,0.12)]">
              <span className="material-symbols-outlined text-[48px]">military_tech</span>
            </div>
            <div className="mb-2 text-[26px] font-bold">คุณยังไม่ได้เป็นสมาชิก Watt-D Point</div>
            <div className="mb-6 text-[15px] leading-7 text-[#667085]">สมัครเป็นสมาชิก Watt-D Point และรับสิทธิ์เพื่อสะสมแต้มแทนการสมัครรับ e-Bill</div>
            <div className="space-y-3">
              <PrimaryButton onClick={() => setStep("success")}>สมัครสมาชิก Watt-D Point</PrimaryButton>
              <SecondaryButton onClick={() => setStep("success")}>ยังไม่สนใจ</SecondaryButton>
            </div>
          </SectionCard>
        </div>
      </PageFrame>
    );
  }

  if (step === "success") {
    return (
      <PageFrame>
        <Header title="สมัครสำเร็จ" onBack={() => router.push(`/location/${subCA}`)} />
        <div className="px-6 pt-10">
          <SectionCard className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFDF3] text-[#12B76A]">
              <span className="material-symbols-outlined text-[42px]">check_circle</span>
            </div>
            <div className="mb-2 text-[28px] font-bold">ดำเนินการสำเร็จ</div>
            <div className="mb-6 text-[16px] leading-7 text-[#667085]">ระบบบันทึกการรับเอกสารของหมายเลขผู้ใช้ไฟฟ้า {subCA} เรียบร้อยแล้ว</div>
            <div className="space-y-3">
              <PrimaryButton onClick={() => router.push(`/location/${subCA}`)}>กลับหน้าสถานที่ใช้ไฟฟ้า</PrimaryButton>
              <Link href="/location" className="block rounded-[20px] border-2 border-[#C11574] px-5 py-4 text-[18px] font-bold text-[#C11574]">กลับหน้ารายการทั้งหมด</Link>
            </div>
          </SectionCard>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <Header title="เลือกช่องทางรับเอกสาร" onBack={() => setStep("docType")} />
      <div className="space-y-4 px-6 pt-4 pb-40">
        <SectionCard>
          <div className="mb-2 text-[24px] font-bold">{docType === "B" ? "ใบแจ้งค่าไฟฟ้า (Smart Invoice)" : "ใบเสร็จรับเงิน / ใบกำกับภาษี"}</div>
          <div className="text-[15px] leading-6 text-[#667085]">จะถูกส่งไปยังช่องทางที่คุณเลือกโดยอัตโนมัติ คุณจะไม่ได้รับเอกสารในรูปแบบกระดาษในรอบบิลถัดไป</div>
        </SectionCard>

        {screenError ? <div className="rounded-2xl bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">{screenError}</div> : null}

        <SectionCard>
          <button
            type="button"
            onClick={() => setSelectedChannel(1)}
            className="flex w-full items-center gap-4 rounded-2xl border border-[#D0D5DD] px-4 py-4 text-left"
          >
            <div className="flex-1">
              <div className="text-[18px] font-bold">PEA Smart Plus App</div>
              <div className="text-[14px] text-[#667085]">รับและดูผ่านแอปพลิเคชัน</div>
            </div>
            <RadioMark active={selectedChannel === 1} />
          </button>

          <button
            type="button"
            onClick={() => setSelectedChannel(2)}
            className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-[#D0D5DD] px-4 py-4 text-left"
          >
            <div className="flex-1">
              <div className="text-[18px] font-bold">SMS</div>
              <div className="text-[14px] text-[#667085]">รับข้อความแจ้งเตือน พร้อมลิงก์ไปยังโทรศัพท์มือถือ</div>
              <div className="mt-2 inline-flex rounded-full bg-[#F2F4F7] px-3 py-1 text-[14px] font-semibold text-[#344054]">{formatPhone(smsPhone || "") || "ไม่มีเบอร์โทร"}</div>
            </div>
            <RadioMark active={selectedChannel === 2} />
          </button>

          <button
            type="button"
            onClick={() => setSelectedChannel(3)}
            className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-[#D0D5DD] px-4 py-4 text-left"
          >
            <div className="flex-1">
              <div className="text-[18px] font-bold">อีเมล</div>
              <div className="text-[14px] text-[#667085]">รับไฟล์ใบแจ้งค่าไฟฟ้าทางอีเมล</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-[#F2F4F7] px-3 py-1 text-[14px] font-semibold text-[#344054]">{existingEmail ? maskEmail(existingEmail) : "ยังไม่มีอีเมล"}</span>
                <span
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setStep("emailInput");
                  }}
                  className="inline-flex rounded-full border border-[#F4B8E0] px-3 py-1 text-[14px] font-semibold text-[#C11574]"
                >
                  {existingEmail ? "แก้ไข" : "เพิ่ม"}
                </span>
              </div>
            </div>
            <RadioMark active={selectedChannel === 3} />
          </button>
        </SectionCard>

        {(currentSubStatus === 1 || [1, 2, 3].includes(currentSubChannel)) && !cancelMode ? (
          <button
            type="button"
            onClick={() => setCancelMode(true)}
            className="w-full rounded-[18px] border border-[#D0D5DD] bg-white px-5 py-4 text-[16px] font-semibold text-[#344054]"
          >
            ยกเลิกการรับบริการ {docType === "B" ? "Smart Invoice" : "e-Receipt"}
          </button>
        ) : null}

        {cancelMode ? (
          <SectionCard>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="text-[22px] font-bold">เหตุผลในการยกเลิก PEA {docType === "B" ? "e-Bill" : "e-Receipt"}</div>
              <button type="button" onClick={() => setCancelMode(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mb-4 text-[14px] leading-6 text-[#667085]">คุณจะได้รับใบเสร็จในรูปแบบกระดาษในรอบเดือนถัดไป</div>
            <div className="space-y-3">
              {CANCEL_REASONS.map((reason) => (
                <button
                  type="button"
                  key={reason.code}
                  onClick={() => setCancelReasonCode(reason.code)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#D0D5DD] px-4 py-4 text-left"
                >
                  <div className="flex-1 text-[16px] font-semibold">{reason.label}</div>
                  <RadioMark active={cancelReasonCode === reason.code} />
                </button>
              ))}
              {cancelReasonCode === 4 ? (
                <input
                  value={cancelOtherText}
                  onChange={(event) => setCancelOtherText(event.target.value)}
                  placeholder="โปรดระบุเหตุผล"
                  className="w-full rounded-[18px] border border-[#D0D5DD] px-4 py-4 text-[16px] outline-none focus:border-[#C11574]"
                />
              ) : null}
            </div>
            <div className="mt-4 space-y-3">
              <PrimaryButton onClick={submitCancellation} disabled={saving}>{saving ? "กำลังยืนยัน..." : "ยืนยัน"}</PrimaryButton>
              <SecondaryButton onClick={() => setCancelMode(false)}>รับ PEA {docType === "B" ? "e-Bill" : "e-Receipt"} ต่อ</SecondaryButton>
            </div>
          </SectionCard>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-[#F8F4FA] px-6 pb-8 pt-4">
        <div className="space-y-3">
          <PrimaryButton onClick={continueSave} disabled={saving}>{saving ? "กำลังบันทึก..." : "ถัดไป"}</PrimaryButton>
          <button type="button" className="mx-auto block text-[14px] font-semibold text-[#C11574]">รายละเอียดบริการ</button>
        </div>
      </div>
    </PageFrame>
  );
}
