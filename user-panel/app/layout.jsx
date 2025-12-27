import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: "SehatNxt – Smart Healthcare & Doctor Appointments",
    description:
        "SehatNxt is a digital healthcare platform for doctor appointments, prescriptions, patient management, and clinic analytics.",
    keywords: [
        "healthcare app",
        "doctor appointment",
        "online prescription",
        "clinic management",
        "SehatNxt"
    ],
    openGraph: {
        title: "SehatNxt – Digital Healthcare Platform",
        description: "Healthcare simplified for doctors and patients",
        images: ["/og-image.png"],
        type: "website"
    },
    robots: "index, follow",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

import { LocationProvider } from '@/context/LocationContext';
import GoogleMapsLoader from '@/components/shared/GoogleMapsLoader';

import BackgroundEffects from '@/components/shared/BackgroundEffects';

import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <BackgroundEffects />
                    <GoogleMapsLoader />
                    <LocationProvider>
                        <main className="relative z-10 min-h-screen">
                            {children}
                        </main>
                    </LocationProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
