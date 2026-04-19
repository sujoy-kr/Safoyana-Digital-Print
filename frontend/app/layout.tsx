import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/ToastContainer";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

import ClientOnly from "@/components/ClientOnly";

export const metadata: Metadata = {
  title: "Safoyana Digital Print - Premium",
  description: "High quality professional digital printing with a high-end experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`} suppressHydrationWarning>
        <ClientOnly>
            <ToastContainer />
            {children}
        </ClientOnly>
      </body>
    </html>
  );
}
