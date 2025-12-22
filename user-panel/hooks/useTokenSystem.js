"use client";

import { useState, useEffect } from 'react';

// Mock Data Configuration
const MOCK_CONFIG = {
    USER_TOKEN: 17,
    INITIAL_CURRENT_TOKEN: 10,
    AVG_TIME_PER_PATIENT_MINS: 4,
    UPDATE_INTERVAL_MS: 5000 // Update every 5 seconds
};

export const useTokenSystem = () => {
    const [userToken] = useState(MOCK_CONFIG.USER_TOKEN);
    const [currentToken, setCurrentToken] = useState(MOCK_CONFIG.INITIAL_CURRENT_TOKEN);

    // Derived state
    const patientsAhead = Math.max(0, userToken - currentToken);
    const estimatedTime = patientsAhead * MOCK_CONFIG.AVG_TIME_PER_PATIENT_MINS;

    // Calculate progress percentage (starts from 0% when user joins queue)
    const totalQueue = userToken;
    const queueProgress = Math.min(100, Math.round((currentToken / totalQueue) * 100));

    useEffect(() => {
        // Mock live updates
        const interval = setInterval(() => {
            setCurrentToken(prev => {
                // Stop incrementing if we reached the user's token
                if (prev >= userToken) return prev;
                return prev + 1;
            });
        }, MOCK_CONFIG.UPDATE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [userToken]);

    return {
        userToken,
        currentToken,
        patientsAhead,
        estimatedTime,
        queueProgress,
        status: patientsAhead === 0 ? 'YOUR_TURN' : patientsAhead < 3 ? 'ALMOST_TURN' : 'WAITING'
    };
};
