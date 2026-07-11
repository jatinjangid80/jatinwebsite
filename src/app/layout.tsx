import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jatin Jangid — Full-Stack Developer",
  description: "I design, build, and ship websites, dashboards, and mobile runner games.",
  openGraph: {
    title: "Jatin Jangid — Full-Stack Developer",
    description: "I design, build, and ship websites, dashboards, and mobile apps — from first commit to live deployment.",
    url: "https://jatinwebsite-gamma.vercel.app/", // Or the final custom domain
    siteName: "Jatin Jangid Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen relative overflow-x-hidden light-theme">
        {children}
      </body>
    </html>
  );
}
