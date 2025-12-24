"use client";

import { SignIn } from "@clerk/nextjs";
import Splash from "@/components/shared/Splash";
import { useState } from "react";

export default function LoginPage() {
    const [showSplash, setShowSplash] = useState(true);

    if (showSplash) {
        return <Splash onComplete={() => setShowSplash(false)} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF3FF] via-[#F8FBFF] to-[#EEF9F4]">
            <SignIn
                routing="hash"
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "shadow-xl border-0"
                    }
                }}
            />
        </div>
    );
}
