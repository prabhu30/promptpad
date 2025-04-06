import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptPad",
  description: "AI-powered prompt engineering assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
