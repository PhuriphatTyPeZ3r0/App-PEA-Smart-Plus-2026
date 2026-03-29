"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/providers/AppPreferencesProvider";
import { getProfileText } from "@/lib/profile-i18n";

export default function ProfileNotificationSettingsPage() {
  const { locale, preferences, toggleNotification } = useAppPreferences();
  const text = getProfileText(locale);
  const notificationText = text.notifications;

  return (
    <div className="h-full overflow-y-auto bg-[#F7F7F8] pb-8">
      <div className="sticky top-0 z-20 bg-[#F7F7F8] px-6 pb-4 pt-6">
        <div className="relative flex items-center justify-center">
          <Link href="/profile/settings" aria-label={text.common.backToSettings} className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition hover:bg-white">
            <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
          </Link>
          <h1 className="text-[22px] font-extrabold tracking-tight text-[#111827]">{text.common.notificationsTitle}</h1>
        </div>
      </div>

      <div className="space-y-8 px-0 py-6">
        <section>
          <h2 className="mb-3 px-6 text-[14px] font-bold text-[#98A2B3]">{notificationText.styleSection}</h2>
          <div className="bg-white px-6">
            <NotificationRow
              title={notificationText.showOnLockScreen}
              description={notificationText.showOnLockScreenDesc}
              checked={preferences.notifications.showOnLockScreen}
              onToggle={() => toggleNotification("showOnLockScreen")}
            />
            <NotificationRow
              title={notificationText.showPreviewText}
              description={notificationText.showPreviewTextDesc}
              checked={preferences.notifications.showPreviewText}
              onToggle={() => toggleNotification("showPreviewText")}
            />
            <NotificationRow
              title={notificationText.sms}
              description={notificationText.smsDesc}
              checked={preferences.notifications.sms}
              onToggle={() => toggleNotification("sms")}
            />
            <NotificationRow
              title={notificationText.email}
              description={notificationText.emailDesc}
              checked={preferences.notifications.email}
              onToggle={() => toggleNotification("email")}
              isLast
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 px-6 text-[14px] font-bold text-[#98A2B3]">{notificationText.categorySection}</h2>
          <div className="bg-white px-6">
            <NotificationRow
              title={notificationText.bill}
              description={notificationText.billDesc}
              note={notificationText.billNote}
              checked={preferences.notifications.bill}
              onToggle={() => {}}
              disabled
            />
            <NotificationRow
              title={notificationText.service}
              description={notificationText.serviceDesc}
              checked={preferences.notifications.service}
              onToggle={() => toggleNotification("service")}
            />
            <NotificationRow
              title={notificationText.outage}
              description={notificationText.outageDesc}
              checked={preferences.notifications.outage}
              onToggle={() => toggleNotification("outage")}
            />
            <NotificationRow
              title={notificationText.news}
              description={notificationText.newsDesc}
              checked={preferences.notifications.news}
              onToggle={() => toggleNotification("news")}
              isLast
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function NotificationRow({
  title,
  description,
  note,
  checked,
  onToggle,
  disabled = false,
  isLast = false,
}: {
  title: string;
  description: string;
  note?: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className={`flex items-start gap-4 py-6 ${isLast ? "" : "border-b border-[#EAECF0]"}`}>
      <div className="min-w-0 flex-1 pr-2">
        <h3 className="text-[18px] font-extrabold leading-7 text-[#111827]">{title}</h3>
        <p className="mt-1 text-[13px] leading-6 text-[#667085]">{description}</p>
        {note ? <p className="mt-1 text-[12px] leading-5 text-[#667085]">{note}</p> : null}
      </div>
      <Switch checked={checked} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

function Switch({ checked, onToggle, disabled = false }: { checked: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`mt-1 relative inline-flex h-9 w-16 items-center rounded-full transition ${checked ? "bg-[#C1179A]" : "bg-[#E4E7EC]"} ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      aria-pressed={checked}
    >
      <span className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-sm transition ${checked ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}
