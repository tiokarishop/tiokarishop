import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppChatWidget from "@/components/WhatsAppChatWidget";
import AIChatbotWidget from "@/components/AIChatbotWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://tiokarishop.github.io/tiokarishop"),
  title: {
    default: "TiokariShop - Fashion & Lifestyle",
    template: "%s | TiokariShop",
  },
  description: "Premium fashion & lifestyle e-commerce platform. Shop clothes, shoes, perfumes, and accessories with AI-powered shopping assistance and WhatsApp integration.",
  keywords: ["fashion", "clothes", "shoes", "perfumes", "accessories", "e-commerce", "online shopping", "AI chatbot", "WhatsApp"],
  authors: [{ name: "TiokariShop" }],
  creator: "TiokariShop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://tiokarishop.github.io/tiokarishop",
    siteName: "TiokariShop",
    title: "TiokariShop - Fashion & Lifestyle",
    description: "Premium fashion & lifestyle e-commerce platform with AI chatbot and WhatsApp integration.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TiokariShop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TiokariShop - Fashion & Lifestyle",
    description: "Premium fashion & lifestyle e-commerce platform with AI chatbot and WhatsApp integration.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
        <WhatsAppChatWidget />
        <AIChatbotWidget />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

function ServiceWorkerRegistration() {
  if (typeof window === "undefined") return null;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('ServiceWorker registration successful');
              }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
              });
            });
          }
        `,
      }}
    />
  );
}
