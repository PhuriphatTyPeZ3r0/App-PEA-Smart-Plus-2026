export type EbillDocType = "B" | "R";
export type SelectChannel = 1 | 2 | 3;

export type EbillEnvelope<T = unknown> = {
  success?: boolean;
  data?: T;
  message?: string;
  [key: string]: unknown;
};

export type CheckInternalExternalResult = EbillEnvelope<{
  result?: number | string;
  results?: number | string;
  [key: string]: unknown;
}> & {
  result?: number | string;
  results?: number | string;
};

export type CheckCAOwnerResult = EbillEnvelope<{
  subCA?: string;
  subDocTypeB?: string | null;
  subDocTypeR?: string | null;
  [key: string]: unknown;
}>;

export type ChannelSelectionResult = EbillEnvelope<{
  subDocType?: string;
  subStatus?: number | string;
  subChannel?: number | string;
  subPhone?: string | null;
  subEmailAddress?: string | null;
  [key: string]: unknown;
}>;

export type SaveChannelPayload = {
  pSubCA: string;
  pSubDocType: EbillDocType;
  pSubStatus: number;
  pSubChannel: SelectChannel;
  pSubEmail: string | null;
  pSubPhone: string | null;
  pActor: number;
};

export type CancelAnswerPayload = {
  pSubCA: string;
  pSubDocType: EbillDocType;
  pReasonCode: number;
  pOtherText: string | null;
  pActor: number;
};

const ACTIONS = {
  syncCA: "SyncCAFromElectricCheckUpdateInsert",
  checkInternalAndExternalCAView: "CheckInternalAndExternalCAView",
  checkCAOwner1: "CheckCAOwner1",
  getSelectChannel: "GetSelectChannel",
  requestEmailOtp: "RequestEmailOtp",
  verifyEmailOtp: "VerifyEmailOtp",
  saveChannel: "SaveChannel",
  checkRegisterWdp: "CheckRegisterWdp",
  addCancelSubCAAnswer: "AddCancelSUBCAAnswer",
  getSelectChannelForProfile: "GetSelectChannelForProfile",
  checkHomeSlideEbillEreceipt: "CheckHomeSlideEbillEreceipt",
} as const;

async function postEbill<T>(action: string, payload: unknown): Promise<T> {
  const response = await fetch(`/api/ebill/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(body?.message || `Request failed: ${response.status}`);
  }

  return body as T;
}

export async function syncCAFromElectricCheckUpdateInsert(pIdentityId: string) {
  return postEbill<EbillEnvelope>(ACTIONS.syncCA, { pIdentityId });
}

export async function checkInternalAndExternalCAView(pSubCA: string, pActor = 6) {
  return postEbill<CheckInternalExternalResult>(ACTIONS.checkInternalAndExternalCAView, {
    pSubCA,
    pActor,
  });
}

export async function checkCAOwner1(pSubCA: string) {
  return postEbill<CheckCAOwnerResult>(ACTIONS.checkCAOwner1, { pSubCA });
}

export async function getSelectChannel(pSubCA: string, pSubDocType: EbillDocType) {
  return postEbill<ChannelSelectionResult>(ACTIONS.getSelectChannel, { pSubCA, pSubDocType });
}

export async function requestEmailOtp(pSubCA: string, pSubDocType: EbillDocType, pSubEmail: string, pActor: number) {
  return postEbill<EbillEnvelope>(ACTIONS.requestEmailOtp, { pSubCA, pSubDocType, pSubEmail, pActor });
}

export async function verifyEmailOtp(
  pSubCA: string,
  pSubDocType: EbillDocType,
  pSubEmail: string,
  pOtpPlaintext: string,
  pActor: number
) {
  return postEbill<EbillEnvelope>(ACTIONS.verifyEmailOtp, {
    pSubCA,
    pSubDocType,
    pSubEmail,
    pOtpPlaintext,
    pActor,
  });
}

export async function saveChannel(payload: SaveChannelPayload) {
  return postEbill<EbillEnvelope>(ACTIONS.saveChannel, payload);
}

export async function checkRegisterWdp(pUserAccId: number) {
  return postEbill<EbillEnvelope<{ results?: number | string }>>(ACTIONS.checkRegisterWdp, { pUserAccId });
}

export async function addCancelSubCAAnswer(payload: CancelAnswerPayload) {
  return postEbill<EbillEnvelope>(ACTIONS.addCancelSubCAAnswer, payload);
}

export function extractResultFlag(payload: unknown): number {
  if (typeof payload === "number") return payload;
  if (typeof payload === "string" && /^\d+$/.test(payload)) return Number(payload);
  if (!payload || typeof payload !== "object") return 0;

  const candidate = payload as Record<string, unknown>;
  const direct = candidate.result ?? candidate.results;
  if (typeof direct === "number") return direct;
  if (typeof direct === "string" && /^\d+$/.test(direct)) return Number(direct);

  const nested = candidate.data;
  if (nested && typeof nested === "object") {
    const nestedRecord = nested as Record<string, unknown>;
    const nestedValue = nestedRecord.result ?? nestedRecord.results;
    if (typeof nestedValue === "number") return nestedValue;
    if (typeof nestedValue === "string" && /^\d+$/.test(nestedValue)) return Number(nestedValue);
  }

  return 0;
}

export function extractBooleanResult(payload: unknown): boolean {
  const result = extractResultFlag(payload);
  return result === 1;
}

export const ebillSessionKeys = {
  checkResult: (subCA: string) => `pea-sp3:ebill:check:${subCA}`,
};

export const EBILL_STORAGE_KEYS = {
  introSeen: "isEbillIntro",
  tncSeen: "isEbillTnC",
};
