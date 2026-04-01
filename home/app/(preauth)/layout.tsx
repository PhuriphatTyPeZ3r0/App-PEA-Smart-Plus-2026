// app/(preauth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PEA Smart Plus",
};

/**
 * Layout สำหรับ preauth flow ทั้งหมด
 * ไม่มี GlobalTabBar — แสดงเฉพาะ content
 * ใช้ h-full เพื่ออยู่ในกรอบมือถือของ root layout
 */
export default function PreauthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}