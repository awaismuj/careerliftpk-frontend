import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNavbar } from "@/components/site/site-navbar";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";

export const metadata: Metadata = {
  title: {
    default: "CareerLift Pakistan — Jobs, CV Builder, Interview Prep",
    template: "%s | CareerLift Pakistan"
  },
  description:
    "CareerLift Pakistan helps you find jobs, build an ATS-friendly CV, write cover letters, and prepare for interviews — free.",
  metadataBase: new URL("https://careerliftpk.netlify.app"),
  openGraph: {
    title: "CareerLift Pakistan",
    description:
      "Find jobs, build a CV, draft cover letters, and prep for interviews — free.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CareerLift Pakistan",
    url: "https://careerliftpk.netlify.app"
  };
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CareerLift Pakistan",
    url: "https://careerliftpk.netlify.app"
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-dvh flex flex-col">
            <SiteNavbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <WhatsAppFloat />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </body>
    </html>
  );
}

