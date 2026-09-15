import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getGeneralSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGeneralSettings();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://devct.shop";
  return {
    metadataBase: new URL(origin),
    title: { default: `${settings.shopName} — ${settings.tagline}`, template: `%s — ${settings.shopName}` },
    description: settings.siteDescription,
    keywords: ["next.js templates", "react templates", "admin dashboards", "ui kits", "source code", "digital products"],
    openGraph: { type: "website", locale: "en_US", url: origin, siteName: settings.shopName, title: `${settings.shopName} — ${settings.tagline}`, description: settings.siteDescription },
    twitter: { card: "summary_large_image", title: settings.shopName, description: settings.siteDescription },
  };
}

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
