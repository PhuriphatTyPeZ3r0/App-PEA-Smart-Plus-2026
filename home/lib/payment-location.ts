export type PaymentLocationItem = {
  OBJECTID?: number | string;
  TYPE?: string;
  PEAMOBILE_TYPE?: string;
  DISPLAY_NAME?: string;
  ADDRESS?: string;
  DISTANCE_KM?: number | string;
  LAT?: number | string;
  LON?: number | string;
  TELEPHONE?: string;
  OFFICE_HOURS?: string;
  SERVICE?: string;
};

export type CustomerContractItem = {
  ca?: string;
  customerName?: string;
  customerAddress?: string;
};

const DEV_BASE = "/API/PaymentLocation";
const CUSTOMER_CONTRACT_URL =
  "https://smartplus3-api.pea.co.th/API/PaymentLocation/CustomerContract";
const IDENTITY_ID = "ovijXQf7OgKR2y+vwqWLu6GaxXaeyuvu70NvhVM=";
const TOKEN_KEY = "paymentLocationToken";
const EXPIRES_KEY = "paymentLocationExpires";

function getClientStorage(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function setClientStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export function getAccessToken(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_PAYMENT_LOCATION_ACCESS_TOKEN ?? "";
  }

  return (
    window.localStorage.getItem("accessToken") ??
    process.env.NEXT_PUBLIC_PAYMENT_LOCATION_ACCESS_TOKEN ??
    ""
  );
}

async function postJson<T>(url: string, body?: unknown, useAccessToken = true): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const accessToken = getAccessToken();
  if (useAccessToken && accessToken) {
    headers.accessToken = accessToken;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function customerContract(): Promise<CustomerContractItem[]> {
  try {
    const result = await postJson<{ item?: CustomerContractItem[] }>(
      CUSTOMER_CONTRACT_URL,
      { identityId: IDENTITY_ID },
      true,
    );
    return result.item ?? [];
  } catch (error) {
    console.error("CustomerContract error", error);
    return [];
  }
}

export async function generateToken(): Promise<{ token?: string; expires?: number } | null> {
  try {
    const result = await postJson<{ token?: string; expires?: number }>(
      `${DEV_BASE}/MapPEAGenerateToken`,
      undefined,
      true,
    );
    if (result.token) {
      setClientStorage(TOKEN_KEY, String(result.token));
    }
    if (result.expires) {
      setClientStorage(EXPIRES_KEY, String(result.expires));
    }
    return result;
  } catch (error) {
    console.error("GenerateToken error", error);
    return null;
  }
}

export async function getValidToken(): Promise<string | null> {
  const token = getClientStorage(TOKEN_KEY);
  const expiresValue = getClientStorage(EXPIRES_KEY);
  if (token && expiresValue) {
    const expires = Number(expiresValue);
    const now = Date.now();
    if (Number.isFinite(expires) && expires - now >= 300000) {
      return token;
    }
  }

  const refreshed = await generateToken();
  return refreshed?.token ?? null;
}

function normalizeItems(input: unknown): PaymentLocationItem[] {
  if (!Array.isArray(input)) return [];
  return input as PaymentLocationItem[];
}

export async function fetchMainData(lat: number, lon: number): Promise<PaymentLocationItem[]> {
  try {
    const token = await getValidToken();
    if (!token) return [];
    const result = await postJson<{ status?: string; data?: unknown }>(`${DEV_BASE}/MapPEAMainData`, {
      map_pea_token: token,
      lat_user: lat,
      lon_user: lon,
    });
    if (result.status !== "success") return [];
    return normalizeItems(result.data).sort((a, b) => {
      const da = Number(a.DISTANCE_KM ?? 999999);
      const db = Number(b.DISTANCE_KM ?? 999999);
      return da - db;
    });
  } catch (error) {
    console.error("MapPEAMainData error", error);
    return [];
  }
}

export async function searchData(search: string, lat: number, lon: number): Promise<PaymentLocationItem[]> {
  try {
    const token = await getValidToken();
    if (!token) return [];
    const result = await postJson<{ status?: string; data?: unknown }>(`${DEV_BASE}/MapPEASearchData`, {
      map_pea_token: token,
      search,
      lat_user: lat,
      lon_user: lon,
    });
    if (result.status !== "success") return [];
    return normalizeItems(result.data);
  } catch (error) {
    console.error("MapPEASearchData error", error);
    return [];
  }
}

export async function processFilter(ca: string): Promise<{ lat?: number; lon?: number } | null> {
  try {
    const result = await postJson<{ status?: string; data?: Array<{ lat?: number | string; lon?: number | string }> }>(
      `${DEV_BASE}/ProcessPaymentLocationFilter`,
      { ca },
    );

    if (result.status !== "success") return null;
    const first = result.data?.[0];
    if (!first) return null;
    return {
      lat: Number(first.lat),
      lon: Number(first.lon),
    };
  } catch (error) {
    console.error("ProcessPaymentLocationFilter error", error);
    return null;
  }
}

export function getItemLat(item: PaymentLocationItem): number | null {
  const value = Number(item.LAT);
  return Number.isFinite(value) ? value : null;
}

export function getItemLon(item: PaymentLocationItem): number | null {
  const value = Number(item.LON);
  return Number.isFinite(value) ? value : null;
}

export function getDistanceLabel(item: PaymentLocationItem): string {
  const value = item.DISTANCE_KM;
  if (value === null || value === undefined || value === "") return "-";
  return `${value} กม.`;
}

export function getMapIconPath(item: Pick<PaymentLocationItem, "TYPE" | "PEAMOBILE_TYPE">): string {
  if (item.TYPE === "OFFICE") return "/asset/payment-location/office.png";
  switch (item.PEAMOBILE_TYPE) {
    case "M_counterservice":
      return "/asset/payment-location/M_counterservice.png";
    case "M_bigc":
      return "/asset/payment-location/M_bigc.png";
    case "M_tops":
      return "/asset/payment-location/M_tops.png";
    case "M_lotus":
      return "/asset/payment-location/M_lotus.png";
    case "M_kbank":
      return "/asset/payment-location/M_kbank.png";
    case "M_ktb":
      return "/asset/payment-location/M_ktb.png";
    case "M_ais":
      return "/asset/payment-location/M_ais.png";
    case "M_true":
      return "/asset/payment-location/M_true.png";
    case "M_dtac":
      return "/asset/payment-location/M_dtac.png";
    case "M_central":
      return "/asset/payment-location/M_central.png";
    case "M_robinson":
      return "/asset/payment-location/M_robinson.png";
    default:
      return "/asset/payment-location/M_counterservice.png";
  }
}
