import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ACTIONS = new Set([
  "SyncCAFromElectricCheckUpdateInsert",
  "CheckInternalAndExternalCAView",
  "CheckCAOwner1",
  "GetSelectChannel",
  "RequestEmailOtp",
  "VerifyEmailOtp",
  "SaveChannel",
  "CheckRegisterWdp",
  "AddCancelSUBCAAnswer",
  "GetSelectChannelForProfile",
  "CheckHomeSlideEbillEreceipt",
]);

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ action: string }> }
) {
  const { action } = await context.params;

  if (!ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json({ message: "Unsupported Ebill action" }, { status: 404 });
  }

  const baseUrl = process.env.EBILL_API_BASE_URL || "https://smartplus3-api-dev.pea.co.th";
  const upstreamUrl = `${baseUrl}/API/Ebill/${action}`;

  try {
    const payload = await request.json();
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const rawText = await upstream.text();

    return new NextResponse(rawText, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error(`[ebill/${action}]`, error);
    return NextResponse.json(
      {
        message: "Ebill proxy failed",
      },
      { status: 500 }
    );
  }
}
