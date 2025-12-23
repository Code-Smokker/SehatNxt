"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Splash from '@/components/common/Splash';
import { getToken } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    const token = getToken();
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  return null; // Or a loader while redirecting
}
