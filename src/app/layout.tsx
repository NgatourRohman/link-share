import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Quick Share | Internal Group Link Sharing",
  description: "Bagi profil Instagram, LinkedIn, dan GitHub kamu dengan cepat dan tanpa ribet.",
  keywords: ["share profile", "instagram", "linkedin", "github", "internal tools", "quick share"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-[var(--bg)] text-[var(--fg)] min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }} 
        />
      </body>
    </html>
  );
}
