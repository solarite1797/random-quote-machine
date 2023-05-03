import Link from "next/link";
import Logo from "../components/Logo";
import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-200 text-black dark:bg-gray-900 dark:text-white">
        <header className="bg-gray-200/40 dark:bg-gray-900/40 backdrop-blur fixed top-0 w-full">
          <div className="max-w-screen-lg mx-auto h-16 flex items-center px-4">
            <div className="flex space-x-3 items-center">
              <Logo className="w-10 h-10" />
              <span>Random Quote Machine</span>
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
