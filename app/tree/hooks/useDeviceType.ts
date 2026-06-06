import { useState, useEffect } from 'react';

export function useDeviceType() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [trunkHeightPx, setTrunkHeightPx] = useState(0);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ua = navigator.userAgent;
      const isIpad = /iPad/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
      const isMob = w <= 768 && !isIpad;
      const android = /Android/.test(ua);
      const vw = isMob ? 40 : 19;
      setTrunkHeightPx((vw / 100) * w * 13 / 194);
      setIsMobile(isMob);
      setIsAndroid(android);
      setIsTablet(isIpad || (w > 768 && w <= 1180));
      setWindowSize({ width: w, height: h });
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const isLaptop = !isMobile && !isTablet;
  const isLandscape = windowSize.width > windowSize.height;
  const treeWidthVw = isMobile ? 40 : 19;
  const objScale = isMobile ? windowSize.height / windowSize.width : 1;
  const crownHeightPx = (treeWidthVw / 100) * windowSize.width * (233 / 194);
  const crownOffsetFromBottom = windowSize.width * (isTablet ? 0.11 : isMobile ? 0.10 : 0.12) * objScale;
  const crownTopPx = windowSize.height - crownOffsetFromBottom - crownHeightPx;
  const baseOffset = isMobile ? 0.073 : isTablet ? 0.064 : 0.074;
  const dragonBottomVw = isMobile ? 0.75 : 0.47;
  const bgSrc = isMobile ? '/tree/base_m.png' : '/tree/base.png';

  return {
    isMobile, isTablet, isLaptop, isAndroid,
    isLandscape, windowSize, trunkHeightPx,
    treeWidthVw, objScale, crownTopPx,
    baseOffset, dragonBottomVw, bgSrc,
  };
}
