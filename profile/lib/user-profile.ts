export interface UserProfile {
  id: string;
  idenNumber: string;
  title: string;
  firstName: string;
  lastName: string;
  fullName: string;
  citizenNo: string;
  birthDate: string;
  phone: string;
  email: string;
  balance: string;
  ca: string;
  accountName: string;
  dueDate: string;
  newServiceLocationCount: number;
  citizenAddress: string;
  currentAddress: string;
  pendingPhone: string;
  pendingEmail: string;
}

export const USER_PROFILE_STORAGE_KEY = "pea-smart-plus:user-profile:v1";

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "90",
  idenNumber: "oPunVQb7OgaT3y6lyuUDrU+oCRct4OBM8kNgjGw=",
  title: "คุณ",
  firstName: "ศิญาพร",
  lastName: "สวยดี",
  fullName: "คุณศิญาพร สวยดี",
  citizenNo: "1819900528841",
  birthDate: "05/11/2548",
  phone: "0910243212",
  email: "charukitsp@gmail.com",
  balance: "1,260.52",
  ca: "020001234567",
  accountName: "บ้านแห่งความสุข",
  dueDate: "28 เม.ย. 2568",
  newServiceLocationCount: 1,
  citizenAddress: "บ้านเลขที่ 95 ถ.มหาราช ต.ปากน้ำ อ.เมืองกระบี่ จ.กระบี่ 81000",
  currentAddress: "บ้านเลขที่ 95 ถ.มหาราช ต.ปากน้ำ อ.เมืองกระบี่ จ.กระบี่ 81000",
  pendingPhone: "",
  pendingEmail: "",
};

const LEGACY_DEFAULT_NAME = {
  title: "คุณ",
  firstName: "ภูริพัฒน์",
  lastName: "เหมกุล",
  fullName: "คุณ ภูริพัฒน์ เหมกุล",
} as const;

const hasMojibakeControls = (value: string): boolean => /[\u0080-\u009f]/.test(value);

const hasSuspiciousThaiMojibakePattern = (value: string): boolean => {
  const markerCount = (value.match(/เธ|เน/g) ?? []).length;
  return markerCount >= 3;
};

export const looksLikeMojibake = (value: string): boolean =>
  hasMojibakeControls(value) || hasSuspiciousThaiMojibakePattern(value);

export const sanitizeReadableText = (value: string, fallback: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  return looksLikeMojibake(trimmed) ? fallback : trimmed;
};

export const sanitizeUserProfile = (profile: UserProfile): UserProfile => {
  const title = sanitizeReadableText(profile.title, DEFAULT_USER_PROFILE.title);
  const firstName = sanitizeReadableText(profile.firstName, DEFAULT_USER_PROFILE.firstName);
  const lastName = sanitizeReadableText(profile.lastName, DEFAULT_USER_PROFILE.lastName);
  const fullName = sanitizeReadableText(profile.fullName, DEFAULT_USER_PROFILE.fullName);

  const usesLegacyDefaultName =
    fullName === LEGACY_DEFAULT_NAME.fullName ||
    (firstName === LEGACY_DEFAULT_NAME.firstName && lastName === LEGACY_DEFAULT_NAME.lastName);

  const resolvedTitle = usesLegacyDefaultName ? DEFAULT_USER_PROFILE.title : title;
  const resolvedFirstName = usesLegacyDefaultName ? DEFAULT_USER_PROFILE.firstName : firstName;
  const resolvedLastName = usesLegacyDefaultName ? DEFAULT_USER_PROFILE.lastName : lastName;
  const resolvedFullName = usesLegacyDefaultName ? DEFAULT_USER_PROFILE.fullName : fullName;

  return {
    ...profile,
    title: resolvedTitle,
    firstName: resolvedFirstName,
    lastName: resolvedLastName,
    fullName: resolvedFullName,
    accountName: sanitizeReadableText(profile.accountName, DEFAULT_USER_PROFILE.accountName),
    dueDate: sanitizeReadableText(profile.dueDate, DEFAULT_USER_PROFILE.dueDate),
    citizenAddress: sanitizeReadableText(profile.citizenAddress, DEFAULT_USER_PROFILE.citizenAddress),
    currentAddress: sanitizeReadableText(profile.currentAddress, DEFAULT_USER_PROFILE.currentAddress),
  };
};

export const getDigits = (value: string): string => (value || "").replace(/\D/g, "");

export const normalizePhone = (value: string): string => getDigits(value).slice(0, 10);

export const normalizeEmail = (value: string): string => (value || "").trim().toLowerCase();

export const isValidThaiMobile = (phone: string): boolean => /^0\d{9}$/.test(normalizePhone(phone));

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

export const formatPhone = (phone: string): string => {
  const digits = normalizePhone(phone);
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
  return phone;
};

export const maskPhoneForProfile = (phone: string): string => {
  const digits = normalizePhone(phone);
  if (digits.length !== 10) {
    return phone || "";
  }
  return `${digits.slice(0, 2)}*-***-${digits.slice(6, 10)}`;
};

export const maskPhoneForOtp = (phone: string): string => {
  const digits = normalizePhone(phone);
  if (digits.length !== 10 || !digits.startsWith("0")) {
    return phone || "";
  }
  return `+66${digits.slice(1, 3)}*****${digits.slice(8, 10)}`;
};

export const maskEmail = (email: string): string => {
  const normalized = normalizeEmail(email);
  if (!normalized) return "";
  
  const [localPart, domain] = normalized.split("@");

  if (!localPart || !domain) {
    return email || "";
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? ""}***@${domain}`;
  }

  return `${localPart[0]}${"*".repeat(Math.max(3, localPart.length - 2))}${
    localPart[localPart.length - 1]
  }@${domain}`;
};
