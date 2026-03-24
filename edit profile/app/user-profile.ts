export const USER_PROFILE_STORAGE_KEY = "user_profile";

export interface UserProfile {
  id: string;
  idenNumber: string;
  fullName: string;
  phone: string;
  email: string;
  isVerified: boolean;
  avatarUrl: string;
  balance: number;
  ca: string;
  accountName: string;
  dueDate: string;
  newServiceLocationCount: number;
  pendingPhone: string;
  pendingEmail: string;
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "user-123",
  idenNumber: "1-1007-12345-12-1",
  fullName: "ศิญาพร ชำนิราศิริกูล",
  phone: "0912341234",
  email: "siya.c@example.com",
  isVerified: true,
  avatarUrl: "/avatar.png",
  balance: 1234.56,
  ca: "010012345678",
  accountName: "ศิญาพร ชำนิราศิริกูล",
  dueDate: "25/07/2567",
  newServiceLocationCount: 0,
  pendingPhone: "",
  pendingEmail: "",
};

export const normalizePhone = (phone: string): string => phone.replace(/[^0-9]/g, "");

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const sanitizeUserProfile = (profile: UserProfile): UserProfile => {
  return profile;
};