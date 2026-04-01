// app/ebill/page.tsx
"use client";

import { Suspense } from "react";
import EbillFlow from "@/components/ebill/EbillFlow";

export default function EbillPage() {
  return (
    <Suspense>
      <EbillFlow />
    </Suspense>
  );
}