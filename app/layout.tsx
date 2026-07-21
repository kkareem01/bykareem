import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { seo, site } from "@/content/site-config";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import { AttributionCapture } from "@/components/booking/AttributionCapture";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

/* Luxury editorial serif — offer-stack headlines only */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.defaultTitle,
    template: `%s · ${site.name}`,
  },
  description: seo.defaultDescription,
  openGraph: {
    siteName: site.name,
    images: [seo.ogImage],
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
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${instrument.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AttributionCapture />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileStickyCTA />
      </body>
    </html>
  );
}
