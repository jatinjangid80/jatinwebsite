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
  title: "Jatin Jangid | Full Stack Web Developer — Portfolio & Freelance Services",
  description: "Jatin Jangid is a full-stack web developer and 3rd-year B.Tech engineering student building modern websites, web applications, CRM dashboards, and business tools that turn ideas into working products.",
  keywords: [
    "Jatin Jangid",
    "Full Stack Developer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "Freelance Web Developer",
    "CRM Developer",
    "TypeScript Developer",
    "Jaipur Web Developer",
    "Node.js Developer"
  ],
  authors: [{ name: "Jatin Jangid", url: "https://github.com/jatinjangid80" }],
  creator: "Jatin Jangid",
  openGraph: {
    title: "Jatin Jangid | Full Stack Web Developer",
    description: "I build modern, responsive web applications, business tools, and digital experiences that turn ideas into working products.",
    url: "https://jatinwebsite-gamma.vercel.app/",
    siteName: "Jatin Jangid Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jatin Jangid | Full Stack Web Developer",
    description: "Full-stack developer building modern web apps, CRM dashboards, and freelance web solutions.",
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
  "jobTitle": "Full Stack Web Developer",
  "url": "https://jatinwebsite-gamma.vercel.app",
  "email": "jatinnjangid72973@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Jaipur",
    "addressRegion": "Rajasthan",
    "addressCountry": "India"
  },
  "sameAs": [
    "https://github.com/jatinjangid80",
    "https://linkedin.com",
    "https://wa.me/917340098982"
  ],
  "knowsAbout": [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Supabase",
    "Full-Stack Web Development",
    "CRM Development"
  ],
  "description": "Full-Stack Web Developer building modern web applications, business tools, and responsive digital experiences."
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
