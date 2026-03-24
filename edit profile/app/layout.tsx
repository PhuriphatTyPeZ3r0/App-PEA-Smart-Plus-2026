import "./globals.css";
import { UserProfileProvider } from "../components/providers/UserProfileProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <UserProfileProvider>{children}</UserProfileProvider>
      </body>
    </html>
  );
}
