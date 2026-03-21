import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";
import { UserButton } from "@/components/auth/user-button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
        <SessionProvider>
          <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
            <div className="flex items-center gap-6">
              <a href="/" className="text-sm font-bold tracking-tight">BBTB</a>
              <nav className="hidden items-center gap-1 sm:flex">
                <a href="/bazi" className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Bát Tự</a>
                <a href="/bazi/cases" className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Cases</a>
                <a href="/readings" className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Lá Số</a>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserButton />
            </div>
          </header>
          <main>{children}</main>
        </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
