import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Saira } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";

import CustomCursor from "@/components/ui/custom-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Slice Atelier — From Pixels To Code",
  description:
    "Creative Designer & Full Stack Developer portfolio. From visual communication into interactive web experiences — a futuristic digital architecture.",
  keywords: [
    "The Slice Atelier",
    "Creative Designer",
    "Full Stack Developer",
    "Portfolio",
    "Three.js",
    "React",
    "Next.js",
    "Web Design",
  ],
  authors: [{ name: "The Slice Atelier" }],
  creator: "The Slice Atelier",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://localhost:3001",
    siteName: "The Slice Atelier",
    title: "The Slice Atelier — From Pixels To Code",
    description:
      "Creative Designer & Full Stack Developer. From pixels to code — a futuristic digital monument.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Slice Atelier — From Pixels To Code",
    description:
      "Creative Designer & Full Stack Developer. From pixels to code — a futuristic digital monument.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${saira.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "The Slice Atelier",
              jobTitle: ["Creative Designer", "Full Stack Developer"],
              description:
                "Creative Designer and Full Stack Developer. From visual communication into interactive web experiences.",
              knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "Node.js",
                "Three.js",
                "UI Design",
                "Motion Design",
                "Branding",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScrollProvider />
        <CustomCursor />
        <div id="main">{children}</div>
      </body>
    </html>
  );
}