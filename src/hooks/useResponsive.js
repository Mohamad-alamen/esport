import { useState, useEffect } from 'react';

// Breakpoints
const MOBILE = 768;
const TABLET = 1024;

// Returns { isMobile, isTablet, width }. Updates on resize.
export function useResponsive() {
  const get = () => (typeof window !== 'undefined' ? window.innerWidth : 1280);
  const [width, setWidth] = useState(get);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return {
    width,
    isMobile: width <= MOBILE,
    isTablet: width > MOBILE && width <= TABLET,
    isCompact: width <= TABLET, // mobile or tablet
  };
}
