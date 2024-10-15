import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "@/app/NavBars/service-provider-bottomBar";
import { SessionProvider } from "next-auth/react";
import SessionProviderWrapper from "@/lib/utils/sessionProviderWrapper"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zimasa Consumer App",
  description: "NextJs Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <SessionProviderWrapper>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

{/* <BottomNav /> */}
      
      </body>
    </html>
    </SessionProviderWrapper>
  );
}
