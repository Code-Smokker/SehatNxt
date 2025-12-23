"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleWrapper({ children }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable");
        return <>{children}</>;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
