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
  metadataBase: new URL("https://jatinwebsite-gamma.vercel.app"),
  title: "Jatin Jangid | Full-Stack Developer — Web, SaaS & AI Products",
  description: "Jatin Jangid is a full-stack developer building modern web applications, SaaS platforms, real-time systems, and AI-powered solutions for startups and businesses.",
  keywords: [
    "Jatin Jangid",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "SaaS Development",
    "AI Automations",
    "Freelance Web Developer",
    "Web Application Developer"
  ],
  authors: [{ name: "Jatin Jangid", url: "https://github.com/jatinjangid80" }],
  creator: "Jatin Jangid",
  openGraph: {
    title: "Jatin Jangid | Full-Stack Developer — Web, SaaS & AI Products",
    description: "I design and build scalable web applications, SaaS platforms, real-time systems, and AI-powered products for startups and businesses.",
    url: "https://jatinwebsite-gamma.vercel.app/",
    siteName: "Jatin Jangid Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jatin Jangid | Full-Stack Developer",
    description: "Full-stack developer building modern web apps, SaaS products, and AI solutions.",
    creator: "@jatinjangid80",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jatin Jangid",
  "jobTitle": "Full-Stack Developer",
  "url": "https://jatinwebsite-gamma.vercel.app",
  "sameAs": [
    "https://github.com/jatinjangid80",
    "https://linkedin.com",
    "https://wa.me/917340098982"
  ],
  "knowsAbout": [
    "React",
    "Next.js",
    "TypeScript",
    "Full-Stack Web Development",
    "SaaS Architecture",
    "AI Automations",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "Supabase"
  ],
  "description": "Full-Stack Developer specializing in high-performance web applications, SaaS platforms, and AI automations."
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen relative light-theme" style={{ overflowX: 'clip' }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
