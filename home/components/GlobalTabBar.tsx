"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TabItem = {
  href: string;
  label: string;
  icon: string;
  activeIcon?: string;
};

const TAB_ITEMS: TabItem[] = [
  {
    href: "/",
    label: "หน้าหลัก",
    icon: "/asset/tab-bar-asset/home-nav-bar.png",
    activeIcon: "/asset/tab-bar-asset/active-home-nav-bar.png",
  },
  {
    href: "/location",
    label: "สถานที่ใช้ไฟฟ้า",
    icon: "/asset/tab-bar-asset/ca-nav-bar.svg",
    activeIcon: "/asset/tab-bar-asset/active-ca-nav-bar.png",
  },
  {
    href: "/service",
    label: "บริการ",
    icon: "/asset/tab-bar-asset/service-nav-bar.png",
    activeIcon: "/asset/tab-bar-asset/active-service-nav-bar.png",
  },
  {
    href: "/watt-d-point",
    label: "พอยต์",
    icon: "/asset/tab-bar-asset/watt-d-point-nav-bar.svg",
    activeIcon: "/asset/tab-bar-asset/active-watt-d-point.png",
  },
  {
    href: "/profile",
    label: "โปรไฟล์",
    icon: "/asset/tab-bar-asset/user-avatar-nav-bar.svg",
    activeIcon: "/asset/tab-bar-asset/active-avatar-nav-bar.png",
  },
];

function isActivePath(currentPath: string, href: string) {
  if (href === "/") {
    return currentPath === "/";
  }
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function GlobalTabBar() {
  const pathname = usePathname();

  const errorPaths = ["/system-error", "/no-internet", "/loading-error"];
  if (pathname === "/evaluation" || pathname === "/power-failure-report" || errorPaths.includes(pathname)) {
    return null;
  }

  return (
    <div data-tutorial="bottom-nav" className="pwa-tabbar absolute bottom-0 left-0 right-0 z-[60] bg-white/95 px-3 pb-safe-bottom pt-3 shadow-[0_-12px_32px_rgba(0,0,0,0.03)] backdrop-blur-2xl md:rounded-t-[32px] lg:px-6">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-around border-t border-slate-50/50 pt-1">
        {TAB_ITEMS.map((tab) => {
          const active = isActivePath(pathname, tab.href);
          const iconSrc = active && tab.activeIcon ? tab.activeIcon : tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`group flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1.5 transition-transform active:scale-95 ${
                active ? "text-[#74045F]" : "text-slate-400"
              }`}
            >
              <div className="relative flex h-8 w-8 items-center justify-center transition-all group-hover:scale-110">
                <Image
                  src={iconSrc}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className={`${active ? "opacity-100" : "opacity-80"} object-contain transition-all group-hover:opacity-100`}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              <span className={`w-full truncate px-1 text-center text-[10px] tracking-tight ${active ? "font-bold" : "font-normal"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}