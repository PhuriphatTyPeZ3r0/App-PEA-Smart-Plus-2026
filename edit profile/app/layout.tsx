import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { UserProfileProvider } from "../components/providers/UserProfileProvider";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mockup App",
  description: "Mockup application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        <UserProfileProvider>
          {children}
        </UserProfileProvider>
      </body>
    </html>
  );
}
