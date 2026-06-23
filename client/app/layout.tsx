import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CompareWidget from "./components/CompareWidget";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EDUTech | Discover Your Future After Intermediate",
  description: "Find the right course, college, entrance exam and career after Class 12. Predict college admissions and get AI counseling.",
  keywords: "EAPCET college predictor, JEE Main college predictor, NEET cutoff ranks, career guidance after 12th, TS ePASS scholarships, best engineering colleges Hyderabad",
  authors: [{ name: "EDUTech Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 font-sans transition-colors">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <CompareWidget />
        <Footer />
      </body>
    </html>
  );
}
