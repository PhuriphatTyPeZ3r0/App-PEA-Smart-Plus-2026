"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_USER_PROFILE,
  USER_PROFILE_STORAGE_KEY,
  type UserProfile,
  normalizeEmail,
  normalizePhone,
  sanitizeUserProfile,
} from "../../lib/user-profile";

interface UserProfileContextValue {
  profile: UserProfile;
  setPendingPhone: (phone: string) => void;
  confirmPhoneChange: () => void;
  clearPendingPhone: () => void;
  setPendingEmail: (email: string) => void;
  confirmEmailChange: () => void;
  clearPendingEmail: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

const mergeWithDefaults = (stored: Partial<UserProfile>): UserProfile =>
  sanitizeUserProfile({
    ...DEFAULT_USER_PROFILE,
    ...stored,
    phone: normalizePhone(stored.phone ?? DEFAULT_USER_PROFILE.phone),
    email: normalizeEmail(stored.email ?? DEFAULT_USER_PROFILE.email),
    pendingPhone: normalizePhone(stored.pendingPhone ?? ""),
    pendingEmail: normalizeEmail(stored.pendingEmail ?? ""),
  });

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    try {
      const rawProfile = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile) as Partial<UserProfile>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProfile(mergeWithDefaults(parsed));
      }
    } catch {
      // Ignored
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, isClient]);

  const setPendingPhone = useCallback((phone: string) => {
    setProfile((current) => ({ ...current, pendingPhone: normalizePhone(phone) }));
  }, []);

  const clearPendingPhone = useCallback(() => {
    setProfile((current) => ({ ...current, pendingPhone: "" }));
  }, []);

  const confirmPhoneChange = useCallback(() => {
    setProfile((current) => {
      if (!current.pendingPhone) {
        return current;
      }
      return {
        ...current,
        phone: current.pendingPhone,
        pendingPhone: "",
      };
    });
  }, []);

  const setPendingEmail = useCallback((email: string) => {
    setProfile((current) => ({ ...current, pendingEmail: normalizeEmail(email) }));
  }, []);

  const clearPendingEmail = useCallback(() => {
    setProfile((current) => ({ ...current, pendingEmail: "" }));
  }, []);

  const confirmEmailChange = useCallback(() => {
    setProfile((current) => {
      if (!current.pendingEmail) {
        return current;
      }
      return {
        ...current,
        email: current.pendingEmail,
        pendingEmail: "",
      };
    });
  }, []);

  const contextValue = useMemo<UserProfileContextValue>(
    () => ({
      profile,
      setPendingPhone,
      confirmPhoneChange,
      clearPendingPhone,
      setPendingEmail,
      confirmEmailChange,
      clearPendingEmail,
    }),
    [
      profile,
      setPendingPhone,
      confirmPhoneChange,
      clearPendingPhone,
      setPendingEmail,
      confirmEmailChange,
      clearPendingEmail,
    ]
  );

  return <UserProfileContext.Provider value={contextValue}>{children}</UserProfileContext.Provider>;
}

export const useUserProfile = (): UserProfileContextValue => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return context;
};
