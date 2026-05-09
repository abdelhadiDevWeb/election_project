import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ANIE | Système de Gestion Électorale",
  description: "Plateforme officielle de gestion des élections de l'Autorité Nationale Indépendante des Élections.",
};

import { DataProvider } from "./context/DataContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <DataProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-64">
              <Header />
              <main className="flex-1 p-8">
                {children}
              </main>
            </div>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
