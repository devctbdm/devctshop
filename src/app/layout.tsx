import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://devct.shop",
  ),
  title: {
    default: "Devct Shop — Premium templates, UI kits & source code",
    template: "%s — Devct Shop",
  },
  description:
    "Buy and sell production-ready website source code, Next.js templates, React templates, admin dashboards, and UI kits. Built for developers who ship fast.",
  keywords: [
    "next.js templates",
    "react templates",
    "admin dashboards",
    "ui kits",
    "source code",
    "digital products",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devct.shop",
    siteName: "Devct Shop",
    title: "Devct Shop — Premium templates, UI kits & source code",
    description:
      "Buy and sell production-ready website source code, Next.js templates, React templates, admin dashboards, and UI kits.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devct Shop",
    description: "Premium templates, UI kits, and source code for developers.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#17171a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
