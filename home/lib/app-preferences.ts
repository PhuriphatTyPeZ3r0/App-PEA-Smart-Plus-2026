export type AppLocale = "th" | "en";

export interface NotificationPreferences {
  showOnLockScreen: boolean;
  showPreviewText: boolean;
  sms: boolean;
  email: boolean;
  bill: boolean;
  service: boolean;
  outage: boolean;
  news: boolean;
}

export interface AppPreferences {
  locale: AppLocale;
  autoSaveSlip: boolean;
  biometric: boolean;
  notifications: NotificationPreferences;
}

export const APP_PREFERENCES_STORAGE_KEY = "pea-smart-plus:app-preferences:v1";

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  locale: "th",
  autoSaveSlip: false,
  biometric: true,
  notifications: {
    showOnLockScreen: true,
    showPreviewText: true,
    sms: true,
    email: true,
    bill: false,
    service: true,
    outage: true,
    news: true,
  },
};
