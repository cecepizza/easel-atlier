// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "./globals.css";
import { UserProvider } from "../contexts/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Easel-Atelier",
  description: "Create custom art configurations and order prints",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <UserProvider>
        <html lang="en">
          <head>
            <script src="https://js.stripe.com/v3/" async></script>
          </head>
          <body className={`${inter.className} min-h-screen flex flex-col`}>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </body>
        </html>
      </UserProvider>
    </ClerkProvider>
  );
}
