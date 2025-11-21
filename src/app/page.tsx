'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PortalLanding from '@/components/sections/portal-landing';
import HomePageContent from '@/components/sections/home-page-content';

// Force dynamic rendering
// export const dynamic = 'force-dynamic';

export default function Home() {
  const [showPortal, setShowPortal] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // F5 yapılınca her zaman portal açılsın (sessionStorage kullanmıyoruz)
    setIsLoaded(true);
  }, []);

  const handleEnter = () => {
    setShowPortal(false);
    router.push('/featured');
  };

  if (!isLoaded) {
    // Portal yüklenene kadar tamamen boş - footer flash'ı önle
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-50 via-white to-orange-50" />
    );
  }

  return (
    <>
      {showPortal && <PortalLanding onEnter={handleEnter} />}
      {!showPortal && <HomePageContent />}
    </>
  );
}
