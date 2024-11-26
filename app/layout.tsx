import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import { description, projectName } from "../utils/constants";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
 
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
  title: `${projectName}`,
  description: `${description}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
