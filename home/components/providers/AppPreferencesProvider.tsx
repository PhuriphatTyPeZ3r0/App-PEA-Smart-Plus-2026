"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  APP_PREFERENCES_STORAGE_KEY,
  DEFAULT_APP_PREFERENCES,
  type AppLocale,
  type AppPreferences,
  type NotificationPreferences,
} from "@/lib/app-preferences";

interface AppPreferencesContextValue {
  preferences: AppPreferences;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleAutoSaveSlip: () => void;
  toggleBiometric: () => void;
  toggleNotification: (key: keyof NotificationPreferences) => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

const mergePreferences = (stored: Partial<AppPreferences>): AppPreferences => ({
  ...DEFAULT_APP_PREFERENCES,
  ...stored,
  notifications: {
    ...DEFAULT_APP_PREFERENCES.notifications,
    ...(stored.notifications ?? {}),
  },
});

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_APP_PREFERENCES);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(APP_PREFERENCES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppPreferences>;
        setPreferences(mergePreferences(parsed));
      }
    } catch {
      // ignore invalid local storage
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    window.localStorage.setItem(APP_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [isClient, preferences]);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      preferences,
      locale: preferences.locale,
      setLocale: (locale) => {
        setPreferences((current) => ({ ...current, locale }));
      },
      toggleAutoSaveSlip: () => {
        setPreferences((current) => ({ ...current, autoSaveSlip: !current.autoSaveSlip }));
      },
      toggleBiometric: () => {
        setPreferences((current) => ({ ...current, biometric: !current.biometric }));
      },
      toggleNotification: (key) => {
        if (key === "bill") {
          return;
        }
        setPreferences((current) => ({
          ...current,
          notifications: {
            ...current.notifications,
            [key]: !current.notifications[key],
          },
        }));
      },
    }),
    [preferences]
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }
  return context;
}
