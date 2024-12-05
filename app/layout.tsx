import { UserContextProvider } from "@/context/user-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";

import "./globals.css";
import { description, projectName } from "../utils/constants";
import NavbarDesktop from "../components/navbar/navbar-desktop";
import NavbarMobile from "../components/navbar/navbar-mobile";
import { ScrollArea } from "../components/ui/scroll-area";
import ProfileNavbar from "../components/navbar/navbar-desktop/navbar-profile";
import { Toaster } from "../components/ui/sonner";
import SearchUsers from "../components/navbar/search-users";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  const userToken = cookieStore.get("token")?.value;

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar usuário.");
      }

      const data = await res.json();

      return data.response;
    } catch {
      return [];
    }
  };

  const user = await fetchUserData();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased bg-background`}
      >
          <UserContextProvider user={user}>
            <main className="flex flex-col h-screen">
              <div className="flex flex-1 overflow-hidden">
                {/* Barra Lateral */}
                <NavbarDesktop  />
                <NavbarMobile />
                <ScrollArea className="flex flex-1">
                  <div className="h-full w-full flex flex-row justify-center items-stretch">
                    <div className="mt-4 w-full max-w-[630px]">
                      <div className="flex-1 w-full">
                        <div className="hidden md:block">
                          <SearchUsers />
                        </div>
                        <div className="container mx-auto mt-[70px] tablet:mt-0 p-4 overflow-x-hidden">{children}</div>
                      </div>
                    </div>
                    <ProfileNavbar />
                  </div>
                </ScrollArea>
              </div>
            </main>
          </UserContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
