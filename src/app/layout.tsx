import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { UserButton } from "@/components/auth/user-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BBTB App",
  description: "Next.js + Auth.js + Prisma starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <header className="flex items-center justify-between border-b px-6 py-3">
            <div className="flex items-center gap-6">
              <a href="/" className="text-lg font-semibold">BBTB</a>
              <nav className="hidden sm:flex items-center gap-4 text-sm">
                <a href="/bazi" className="text-muted-foreground hover:text-foreground transition-colors">Bát Tự</a>
                <a href="/bazi/cases" className="text-muted-foreground hover:text-foreground transition-colors">Cases</a>
                <a href="/readings" className="text-muted-foreground hover:text-foreground transition-colors">Lá Số</a>
              </nav>
            </div>
            <UserButton />
          </header>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
