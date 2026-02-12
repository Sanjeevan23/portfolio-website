//src/hooks/useResponsivePadding.ts
'use client';

import { useEffect, useState } from 'react';

export function useResponsivePadding() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    onResize();

    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { isMobile };
}
