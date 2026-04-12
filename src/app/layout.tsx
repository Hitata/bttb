import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { UserButton } from "@/components/auth/user-button";
import { AppNav } from "@/components/app-nav";
import { MobileNav } from "@/components/mobile-nav";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bát Tự Tử Bình — Phân tích mệnh lý & phong thuỷ",
  description: "Công cụ phân tích Bát Tự, Tử Vi, Kinh Dịch và Human Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.className} antialiased`}
      >
        <SessionProvider>
          <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
            <div className="flex items-center gap-6">
              <MobileNav />
              <Link href="/" className="text-sm font-bold tracking-tight">BBTB</Link>
              <div className="hidden sm:flex">
                <AppNav />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserButton />
            </div>
          </header>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
