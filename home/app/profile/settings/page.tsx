"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/providers/AppPreferencesProvider";
import { getProfileText } from "@/lib/profile-i18n";

export default function ProfileSettingsPage() {
  const { locale, setLocale, preferences, toggleAutoSaveSlip, toggleBiometric } = useAppPreferences();
  const text = getProfileText(locale);

  return (
    <div className="h-full overflow-y-auto bg-[#F7F7F8] pb-8">
      <PageHeader title={text.common.settingsTitle} backHref="/profile" backLabel={text.common.backToProfile} />

      <div className="space-y-8 px-6 py-6">
        <section>
          <h2 className="mb-3 text-[14px] font-bold text-[#98A2B3]">{text.settings.appSettings}</h2>
          <div className="overflow-hidden rounded-[28px] bg-white">
            <div className="flex items-center gap-4 border-b border-[#EAECF0] px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center text-[#667085]">
                <span className="material-symbols-outlined text-[28px]">language</span>
              </div>
              <div className="flex-1 text-[16px] font-extrabold text-[#111827]">{text.settings.language}</div>
              <LanguageToggle locale={locale} setLocale={setLocale} thaiLabel={text.common.thai} englishLabel={text.common.english} />
            </div>

            <Link href="/profile/settings/notifications" className="flex items-center gap-4 border-b border-[#EAECF0] px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center text-[#667085]">
                <span className="material-symbols-outlined text-[28px]">notifications</span>
              </div>
              <div className="flex-1 text-[16px] font-extrabold text-[#111827]">{text.settings.notifications}</div>
              <span className="material-symbols-outlined text-[24px] text-[#98A2B3]">chevron_right</span>
            </Link>

            <SettingArrowRow icon="dashboard_customize" label={text.settings.homeMenu} />

            <ToggleRow
              icon="download"
              label={text.settings.autoSaveSlip}
              description={text.settings.autoSaveSlipDesc}
              checked={preferences.autoSaveSlip}
              onToggle={toggleAutoSaveSlip}
              isLast
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[14px] font-bold text-[#98A2B3]">{text.settings.securitySettings}</h2>
          <div className="overflow-hidden rounded-[28px] bg-white">
            <ToggleRow
              icon="fingerprint"
              label={text.settings.biometric}
              description={text.settings.biometricDesc}
              checked={preferences.biometric}
              onToggle={toggleBiometric}
            />
            <SettingArrowRow icon="password" label={text.settings.changePassword} isLast />
          </div>
        </section>
      </div>
    </div>
  );
}

function PageHeader({ title, backHref, backLabel }: { title: string; backHref: string; backLabel: string }) {
  return (
    <div className="sticky top-0 z-20 bg-[#F7F7F8] px-6 pb-4 pt-6">
      <div className="relative flex items-center justify-center">
        <Link href={backHref} aria-label={backLabel} className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition hover:bg-white">
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </Link>
        <h1 className="text-[22px] font-extrabold tracking-tight text-[#111827]">{title}</h1>
      </div>
    </div>
  );
}

function LanguageToggle({
  locale,
  setLocale,
  thaiLabel,
  englishLabel,
}: {
  locale: "th" | "en";
  setLocale: (locale: "th" | "en") => void;
  thaiLabel: string;
  englishLabel: string;
}) {
  const activeClass = "text-[#C1179A]";
  const inactiveClass = "text-[#344054]";

  return (
    <div className="flex items-center gap-3 text-[14px] font-bold">
      <button type="button" onClick={() => setLocale("th")} className={locale === "th" ? activeClass : inactiveClass}>
        {thaiLabel}
      </button>
      <span className="text-[#D0D5DD]">|</span>
      <button type="button" onClick={() => setLocale("en")} className={locale === "en" ? activeClass : inactiveClass}>
        {englishLabel}
      </button>
    </div>
  );
}

function SettingArrowRow({ icon, label, isLast = false }: { icon: string; label: string; isLast?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-5 py-5 ${isLast ? "" : "border-b border-[#EAECF0]"}`}>
      <div className="flex h-10 w-10 items-center justify-center text-[#667085]">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <div className="flex-1 text-[16px] font-extrabold text-[#111827]">{label}</div>
      <span className="material-symbols-outlined text-[24px] text-[#98A2B3]">chevron_right</span>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onToggle,
  isLast = false,
}: {
  icon: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 px-5 py-5 ${isLast ? "" : "border-b border-[#EAECF0]"}`}>
      <div className="flex h-10 w-10 items-center justify-center text-[#667085]">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[16px] font-extrabold text-[#111827]">{label}</div>
        <p className="mt-1 text-[13px] leading-5 text-[#98A2B3]">{description}</p>
      </div>
      <Switch checked={checked} onToggle={onToggle} />
    </div>
  );
}

function Switch({ checked, onToggle, disabled = false }: { checked: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-9 w-16 items-center rounded-full transition ${checked ? "bg-[#C1179A]" : "bg-[#E4E7EC]"} ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      aria-pressed={checked}
    >
      <span className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-sm transition ${checked ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}
