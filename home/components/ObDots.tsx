// components/ObDots.tsx
// Onboarding progress dots — 4 dots, current active

interface ObDotsProps {
  current: 1 | 2 | 3 | 4;
}

export default function ObDots({ current }: ObDotsProps) {
  return (
    <>
      <style>{`
        .ob-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E0B0D8;
          transition: all .3s;
        }
        .ob-dot.act {
          width: 24px;
          border-radius: 4px;
          background: #8B1A6B;
        }
      `}</style>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 28 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`ob-dot${current === n ? " act" : ""}`} />
        ))}
      </div>
    </>
  );
}
