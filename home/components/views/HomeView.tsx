import React, { useEffect, useState } from "react";
import Image from "next/image";
import AccountSummaryCard from "../AccountSummaryCard";
import FoundNewCACard from "../FoundNewCACard";
import RecommendedServiceCard from "../RecommendedServiceCard";
import Link from "next/link";
interface HomeViewProps {
  mockUser: {
    id: string;
    idenNumber: string;
    name: string;
    balance: string;
    ca: string;
    accountName: string;
    dueDate: string;
    newServiceLocationCount: number;
  };
  isActive: boolean;
  onOpenEvaluation: () => void;
  onOpenNotifications: () => void;
  onOpenServiceAll: () => void;
}

const QUICK_ACTIONS = [
  { label: "ดูและจ่ายบิล", icon: "ดูและจ่ายบิล.svg" },
  { label: "ดูการใช้ไฟ", icon: "ดูการใช้ไฟ.svg" },
  { label: "แจ้งไฟฟ้าขัดข้อง", icon: "แจ้งไฟดับ 2.svg", href: "/power-failure-report"},
  { label: "ดูเพิ่มเติม", icon: "ดูเพิ่มเติม.svg" },
];

const BANNER_SLIDE = [
  {
    title: "PEA Volta ครอบคลุมทั่วไทย",
    description: "ชาร์จมั่นใจทุกเส้นทาง",
    discount: "",
    imageSrc: "/images/banner/1-3_0.png",
  },
  {
    title: "PEA ติดโซล่าเซลล์บนหลังคา",
    description: "ลดค่าไฟฟ้า ประหยัด คุ้มค่า",
    discount: "",
    imageSrc: "/images/banner/2_th_0.png",
  },
  {
    title: "ชาร์จ PEA Volta ครั้งแรกลด 20 บาท",
    description: "พร้อมดูแลทุกวันทุกเส้นทาง",
    discount: "",
    imageSrc: "/images/banner/3_th_0.png",
  },
];

const PRIVILEGES = [
  {
    title: "PEA Volta ครอบคลุมทั่วไทย",
    description: "ชาร์จมั่นใจทุกเส้นทาง",
    discount: "",
    imageSrc: "/images/banner/1-3_0.png",
  },
  {
    title: "PEA ติดโซล่าเซลล์บนหลังคา",
    description: "ลดค่าไฟฟ้า ประหยัด คุ้มค่า",
    discount: "",
    imageSrc: "/images/banner/2_th_0.png",
  },
  {
    title: "ชาร์จ PEA Volta ครั้งแรกลด 20 บาท",
    description: "พร้อมดูแลทุกวันทุกเส้นทาง",
    discount: "",
    imageSrc: "/images/banner/3_th_0.png",
  },
];

const RECOMMENDED_SERVICES = [
  {
    title: "บริการติดตั้ง Solar",
    description: "ใช้ 250 คะแนน แลกส่วนลด 20 บาท",
    imageSrc: "/images/banner/3_th_0.png",
  },
  {
    title: "บริการติดตั้ง Solar",
    description: "ใช้ 250 คะแนน แลกส่วนลด 20 บาท",
    imageSrc: "/images/banner/3_th_0.png",
  },
  {
    title: "บริการติดตั้ง Solar",
    description: "ใช้ 250 คะแนน แลกส่วนลด 20 บาท",
    imageSrc: "/images/banner/3_th_0.png",
  },
];

export default function HomeView({ mockUser, isActive, onOpenEvaluation, onOpenNotifications, onOpenServiceAll }: HomeViewProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % BANNER_SLIDE.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const goToPreviousSlide = () => {
    setActiveSlide((current) => (current - 1 + BANNER_SLIDE.length) % BANNER_SLIDE.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % BANNER_SLIDE.length);
  };

  return (
    <div
      className={`relative flex h-full flex-1 flex-col overflow-hidden bg-[#F8FAFC] ${
        !isActive ? "pointer-events-none" : "animate-zoom-in"
      }`}
    >
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[116px] sm:pb-[124px] lg:pb-[138px]">
        <div className="relative overflow-hidden">
          <div className="relative h-[220px] sm:h-[260px] lg:h-[320px] xl:h-[360px]">
            <Image
              src="/asset/home-img/Rectangle 2.png"
              alt="Header Bg"
              fill
              sizes="100vw"
              className="object-cover lg:object-[center_20%] md:rounded-b-[40px] lg:rounded-b-[56px]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1180px] items-start justify-between px-5 pt-10 sm:px-6 md:pt-12 lg:px-10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border-[0.75px] border-white/20 p-0.5 sm:h-14 sm:w-14">
                  <Image
                    src="/avatar.png"
                    alt="Profile"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-5 text-white/80 sm:text-base">สวัสดี</span>
                  <span className="text-base font-semibold leading-6 text-white sm:text-lg">{mockUser.name}</span>
                </div>
              </div>

              <button
                type="button"
                data-tutorial="home-notification"
                onClick={onOpenNotifications}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-lg transition-transform active:scale-90 sm:h-11 sm:w-11"
                aria-label="Notifications"
              >
                <Image
                  src="/asset/icons/home-icon/bell-01.svg"
                  alt="Notifications"
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-pink-500" />
              </button>
            </div>
          </div>

          <div className="relative z-20 mx-auto -mt-16 w-full max-w-[1180px] px-5 sm:-mt-20 sm:px-6 lg:-mt-24 lg:px-10">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div data-tutorial="payment-card">
                <AccountSummaryCard
                  accountName={mockUser.accountName}
                  accountNumber={mockUser.ca}
                  balance={mockUser.balance}
                  dueDate={mockUser.dueDate}
                  onPayBill={() => {}}
                  onSwitchAccount={() => {}}
                />
              </div>

              <div data-tutorial="new-ca-card">
                <FoundNewCACard count={mockUser.newServiceLocationCount} />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1180px] px-4 pb-10 pt-8 sm:px-6 lg:px-10">
          <section className="mx-auto w-full max-w-[760px]" data-tutorial="quick-actions">
            <div className="grid grid-cols-4 gap-x-2 gap-y-7 sm:gap-x-4 sm:gap-y-8 lg:gap-x-6">
              {QUICK_ACTIONS.map((item) => {
                const isExtra = item.label === "ดูเพิ่มเติม";
                const handleClick = isExtra ? onOpenServiceAll : undefined;
                
                const content = (
                  <>
                    <div className="flex aspect-square w-full max-w-[62px] items-center justify-center rounded-[20px] border border-slate-50 bg-white shadow-[0_10px_20px_-8px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-purple-50/20 group-hover:shadow-xl active:scale-90 sm:max-w-[72px] lg:max-w-[78px]">
                      <Image
                        src={`/asset/icons/home-icon/${item.icon}`}
                        alt={item.label}
                        width={36}
                        height={36}
                        className="h-1/2 w-1/2 object-contain"
                      />
                    </div>
                    <span className="min-h-[2.6em] px-0.5 text-center text-[10px] font-medium leading-[1.3] text-[#344054] transition-colors line-clamp-2 group-hover:text-[#74045F] sm:text-xs lg:text-[13px]">
                      {item.label}
                    </span>
                  </>
                );

                const commonClassName = "group flex min-w-0 cursor-pointer flex-col items-center gap-3";

                if (item.href) {
                  return (
                    <Link key={item.label} className={commonClassName} href={item.href}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.label}
                    className={commonClassName}
                    onClick={handleClick}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-8">
            <div className="relative pb-2">
              <div className="overflow-hidden rounded-[20px]">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {BANNER_SLIDE.map((item, index) => (
                    <div key={`${item.imageSrc}-${index}`} className="w-full shrink-0">
                      <div className="relative h-[168px] w-full sm:h-[220px] lg:h-[250px] xl:h-[280px]">
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          sizes="100vw"
                          loading={index === 0 ? "eager" : "lazy"}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {BANNER_SLIDE.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeSlide === index ? "w-6 bg-[#A80689]" : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10" data-tutorial="privileges-section">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">สิทธิพิเศษ</h2>
              <button className="text-sm font-medium text-[#A80689] transition-transform active:scale-95">ดูทั้งหมด</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible xl:grid-cols-3">
              {PRIVILEGES.map((item, index) => (
                <RecommendedServiceCard key={`${item.title}-${index}`} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">บริการแนะนำ</h2>
              <button className="text-sm font-medium text-[#A80689] transition-transform active:scale-95">ดูทั้งหมด</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible xl:grid-cols-3">
              {RECOMMENDED_SERVICES.map((item, index) => (
                <RecommendedServiceCard key={`${item.title}-${index}`} {...item} />
              ))}
            </div>
          </section>

          <button onClick={onOpenEvaluation} className="mx-auto mt-8 block h-20 w-40 cursor-default opacity-0" />
        </div>
      </div>

    </div>
  );
}