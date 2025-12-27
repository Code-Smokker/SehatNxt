import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/shared/Navbar";
import GoogleMapsLoader from "@/components/shared/GoogleMapsLoader";
import { LocationProvider } from "@/context/LocationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "SehatNxt",
    description: "Advanced Healthcare Platform",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <LocationProvider>
                        <GoogleMapsLoader />
                        <Navbar />
                        <main className="min-h-screen bg-slate-50">
                            {children}
                        </main>
                    </LocationProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
