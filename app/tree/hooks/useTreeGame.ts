import { useState, useRef } from 'react';
import { COOLDOWN_DURATION, MAX_TRUNKS, QUOTES, CLOUD_TYPES, CLOUD_SPAWN_INTERVAL, SPACE_THRESHOLD, Leaf, Cloud, Star, SpaceObject } from '../constants';

export function useTreeGame(windowHeight: number, trunkHeightPx: number) {
  const [level, setLevel] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownProgress, setCooldownProgress] = useState(0);
  const [isSquashing, setIsSquashing] = useState(false);
  const [plusOnes, setPlusOnes] = useState<{ id: number }[]>([]);
const [quote, setQuote] = useState<string | null>(null);
const [quoteDirection, setQuoteDirection] = useState<'left' | 'right'>('left');
const quoteDirRef = useRef<'left' | 'right'>('left');
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [generatedClouds, setGeneratedClouds] = useState<Cloud[]>([]);
  const [generatedStars, setGeneratedStars] = useState<Star[]>([]);
  const [spaceObjects, setSpaceObjects] = useState<SpaceObject[]>([]);
  const [lastCloudX, setLastCloudX] = useState(50);
  const [lastPlanetX, setLastPlanetX] = useState(50);

  const bgOffsetRef = useRef(0);
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = () => {
    setIsCooldown(true);
    setCooldownProgress(0);
    const start = Date.now();
    cooldownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / COOLDOWN_DURATION, 1);
      setCooldownProgress(progress);
      if (progress >= 1) {
        clearInterval(cooldownIntervalRef.current!);
        setIsCooldown(false);
      }
    }, 50);
  };

  const doWater = () => {
    try {
      const audio = new Audio('/tree/bump.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (e) {}

    const id = Date.now();
    setPlusOnes(prev => [...prev, { id }]);
    setTimeout(() => {
      setPlusOnes(prev => prev.filter(p => p.id !== id));
    }, 1200);

    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
const dir = quoteDirRef.current;
setQuoteDirection(dir);
quoteDirRef.current = dir === 'left' ? 'right' : 'left';
setQuote(randomQuote);
setTimeout(() => setQuote(null), 5000);


    const newLeaves = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      startX: Math.random() * 80 - 40,
      delay: 0,
      duration: 1.0 + Math.random() * 0.6,
    }));
    setLeaves(prev => [...prev, ...newLeaves]);
    setTimeout(() => {
      setLeaves(prev => prev.filter(l => !newLeaves.find(n => n.id === l.id)));
    }, 2000);

    setIsSquashing(true);
    setTimeout(() => setIsSquashing(false), 150);

    setLevel(prev => {
      const newLevel = prev + 1;
      bgOffsetRef.current = newLevel * trunkHeightPx;
      const bg = bgOffsetRef.current;

      // Облака — только до порога космоса
      if (newLevel < SPACE_THRESHOLD) {
        setGeneratedClouds(clouds => {
          const filtered = clouds.filter(c => c.worldY - bg > -200);
          if (newLevel % CLOUD_SPAWN_INTERVAL === 0) {
            let newX = Math.random() * 70 + 5;
            let attempts = 0;
            while (Math.abs(newX - lastCloudX) < 25 && attempts < 10) {
              newX = Math.random() * 70 + 5;
              attempts++;
            }
            setLastCloudX(newX);
            const newCloud: Cloud = {
              id: Date.now(),
              type: CLOUD_TYPES[Math.floor(Math.random() * CLOUD_TYPES.length)],
              x: newX,
              worldY: bg + windowHeight * 2.5 + Math.random() * windowHeight,
              widthVw: 10 + Math.random() * 8,
              zIndex: Math.random() > 0.5 ? 3 : 1,
              animDelay: `-${Math.floor(Math.random() * 15)}s`,
              animDur: `${20 + Math.floor(Math.random() * 15)}s`,
            };
            return [...filtered, newCloud];
          }
          return filtered;
        });
      }

      // Звёзды — после порога, каждые 3 полива
      if (newLevel >= SPACE_THRESHOLD && newLevel % 3 === 0) {
        setGeneratedStars(stars => {
          const filtered = stars.filter(s => s.worldY - bg > -200);
          const count = 3 + Math.floor(Math.random() * 3);
          const newStars: Star[] = Array.from({ length: count }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 95 + 2,
            worldY: bg + windowHeight * 2 + Math.random() * windowHeight * 1.5,
            size: Math.random() > 0.7 ? 2 : 1,
            twinkleDelay: `-${(Math.random() * 3).toFixed(1)}s`,
            twinkleDur: `${(1.5 + Math.random() * 2).toFixed(1)}s`,
          }));
          return [...filtered, ...newStars];
        });
      }

      // Планета — каждые 5 поливов после порога
      if (newLevel >= SPACE_THRESHOLD && newLevel % 5 === 0) {
        setSpaceObjects(objs => {
          const filtered = objs.filter(o => o.worldY - bg > -200);
          let newX = Math.random() * 60 + 10;
          let attempts = 0;
          while (Math.abs(newX - lastPlanetX) < 30 && attempts < 10) {
            newX = Math.random() * 60 + 10;
            attempts++;
          }
          setLastPlanetX(newX);
          const planet: SpaceObject = {
            id: Date.now(),
            type: 'planet',
            x: newX,
            worldY: bg + windowHeight * 2 + Math.random() * windowHeight,
            zIndex: 1,
          };
          return [...filtered, planet];
        });
      }

      // Корабль — каждые 20 поливов после порога
      if (newLevel >= SPACE_THRESHOLD && newLevel % 20 === 0) {
        setSpaceObjects(objs => {
          const filtered = objs.filter(o => o.worldY - bg > -200);
          const ship: SpaceObject = {
            id: Date.now() + 1,
            type: 'ship',
            x: 0,
            worldY: bg + windowHeight * 1.8 + Math.random() * windowHeight,
            zIndex: 3,
          };
          return [...filtered, ship];
        });
      }

      return newLevel;
    });
  };

  const handleWater = () => {
    if (isCooldown) return;
    doWater();
    startCooldown();
  };

  const handleBoost = () => {
    if (isCooldown) return;
    Array.from({ length: 10 }).forEach((_, i) => {
      setTimeout(() => doWater(), i * 100);
    });
    startCooldown();
  };

  const visibleCount = Math.min(level, MAX_TRUNKS);
  const trunkSegments = Array.from({ length: visibleCount }, (_, i) => {
    const segNum = MAX_TRUNKS - i;
    return `/tree/stvol${segNum}.png`;
  });

  const squashTransform = isSquashing
    ? 'scaleY(0.92) scaleX(1.04)'
    : 'scaleY(1) scaleX(1)';
  const squashTransition = isSquashing
    ? 'transform 0.15s ease-out'
    : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

  return {
    level, isCooldown, cooldownProgress,
    isSquashing, plusOnes, quote, quoteDirection, leaves,
    generatedClouds, generatedStars, spaceObjects,
    handleWater, handleBoost, trunkSegments,
    squashTransform, squashTransition,
  };
}
