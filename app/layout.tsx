import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteOrigin } from "@/lib/agent-discovery";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "BrandSignal shows how ChatGPT, Perplexity, Gemini and Google AI Mode recommend beauty, fashion and luxury brands: who gets mentioned, who gets cited, and why.";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: "BrandSignal: AI visibility for beauty, fashion & luxury brands",
  description,
  openGraph: {
    title: "BrandSignal: AI visibility for beauty, fashion & luxury brands",
    description,
    type: "website",
    url: "/",
    siteName: "BrandSignal",
  },
};

/** Inline script to apply theme before first paint — prevents flash */
const themeScript = `(function(){try{var t=localStorage.getItem('sovereign-theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
