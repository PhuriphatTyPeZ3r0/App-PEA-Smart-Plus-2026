import type { Metadata, Viewport } from "next";
import "./globals.css";
import { UserProfileProvider } from "@/components/providers/UserProfileProvider";
import { AppPreferencesProvider } from "@/components/providers/AppPreferencesProvider";
import GlobalTabBar from "@/components/GlobalTabBar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "PEA Smart Plus",
  description: "PEA Smart Plus Satisfaction Evaluation",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PEA Smart Plus",
  },
  icons: {
    icon: [
      { url: "/pwa-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/pwa-icon-192.png",
  }
};

export const viewport: Viewport = {
  themeColor: "#7B2CBF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const serviceWorkerScript =
  process.env.NODE_ENV === "production"
    ? `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function (err) {
            console.log('ServiceWorker registration failed:', err);
          });
        });
      }
    `
    : `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.getRegistrations().then(function (registrations) {
            registrations.forEach(function (registration) {
              registration.unregister();
            });
          });

          if ('caches' in window) {
            caches.keys().then(function (keys) {
              keys
                .filter(function (key) {
                  return (
                    key.indexOf('evaluate-satisfaction-') === 0 ||
                    key.indexOf('home-pwa-') === 0 ||
                    key.indexOf('pea-smart-plus-home-') === 0
                  );
                })
                .forEach(function (key) {
                  caches.delete(key);
                });
            });
          }
        });
      }
    `;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Script id="sw-registration" strategy="afterInteractive">
          {serviceWorkerScript}
        </Script>
        <AppPreferencesProvider>
          <UserProfileProvider>
            <div className="flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#F1F5F9] p-0 font-sans text-slate-900 md:p-4 lg:p-6">
              <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl md:mx-auto md:h-[calc(100dvh-2rem)] md:max-w-[820px] md:rounded-[40px] md:border-[6px] md:border-slate-800 lg:h-[calc(100dvh-3rem)] lg:max-w-[1180px] lg:border-0 xl:max-w-[1320px]">
                {children}
                <GlobalTabBar />
              </div>
            </div>
          </UserProfileProvider>
        </AppPreferencesProvider>
      </body>
    </html>
  );
}
