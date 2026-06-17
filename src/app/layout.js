import { Outfit, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "LegalEase – Online Lawyer Hiring Platform",
  description: "Find & Hire Expert Legal Counsel with ease and confidence. Premium legal marketplace connecting clients and businesses with top-tier verified lawyers.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-grow min-h-[calc(100vh-16rem)]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

