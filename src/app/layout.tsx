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
  title: "TiokariShop - Fashion & Lifestyle",
  description: "Shop the latest clothes, shoes, perfumes, and accessories at TiokariShop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
        <WhatsAppChatWidget />
        <AIChatbotWidget />
      </body>
    </html>
  );
}
