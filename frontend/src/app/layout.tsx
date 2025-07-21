import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AmplifyWrapper from "./amplifyWrapper";
import NavMenu from "@/components/nav/navigation";
import { AuthContextProvider } from "@/context/auth";
import ClientProvider from "./clientProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UpSkillsr",
  description: "Track and showcase your skill development with journals, videos, and progress logs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>
          <AuthContextProvider>
            <AmplifyWrapper />
            <NavMenu />
            <AuthGuard>
              {children}
              <Toaster visibleToasts={1} toastOptions={{ className: "!bg-white !text-black !shadow-md" }} />
            </AuthGuard>
          </AuthContextProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
