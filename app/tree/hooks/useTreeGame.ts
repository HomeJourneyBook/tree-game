import { useState, useRef } from 'react';
import { COOLDOWN_DURATION, MAX_TRUNKS, QUOTES, CLOUD_TYPES, CLOUD_SPAWN_INTERVAL, CLOUD_MAX_LEVEL, SPACE_THRESHOLD, SPACE_OBJECTS_START, Leaf, Cloud, Star, SpaceObject } from '../constants';

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
  const [planets, setPlanets] = useState<SpaceObject[]>([]);
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

      // Облака — каждые 3 уровня до уровня 15
      if (newLevel < CLOUD_MAX_LEVEL) {
        if (newLevel % CLOUD_SPAWN_INTERVAL === 0) {
          setGeneratedClouds(clouds => {
            const filtered = clouds.filter(c => c.worldY - bg > -windowHeight * 2);
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
              worldY: bg + windowHeight * 1.1 + Math.random() * windowHeight * 0.4,
              widthVw: 10 + Math.random() * 8,
              zIndex: Math.random() > 0.5 ? 3 : 1,
              animDelay: `-${Math.floor(Math.random() * 15)}s`,
              animDur: `${20 + Math.floor(Math.random() * 15)}s`,
            };
            return [...filtered, newCloud];
          });
        }
      } else {
        setGeneratedClouds(clouds => clouds.filter(c => c.worldY - bg > -windowHeight * 2));
      }


      // Звёзды — после уровня 100, каждый полив 2-4 штуки
// Звёзды — после SPACE_THRESHOLD, каждый полив 1-3 штуки
if (newLevel >= SPACE_THRESHOLD) {
  const count = 1 + Math.floor(Math.random() * 3);
  const newStars: Star[] = Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * 90 + 5,
    worldY: bg + windowHeight * (1.1 + Math.random() * 0.8),
    size: Math.random() > 0.7 ? 2 : 1,
    twinkleDelay: `-${(Math.random() * 3).toFixed(1)}s`,
    twinkleDur: `${(1.5 + Math.random() * 2).toFixed(1)}s`,
  }));
  setGeneratedStars(stars => {
    const filtered = stars.filter(s => s.worldY > bg);
    return [...filtered, ...newStars];
  });
}



      // Предупреждение на уровне 90
if (newLevel === 90) {
  setSpaceObjects(objs => [...objs, {
    id: Date.now() + 99,
    type: 'warning' as const,
    x: 0,
worldY: bg - windowHeight * 0.2,
    zIndex: 4,
    fromLeft: true,
  }]);
}


      // Планеты — отдельный стейт, каждые 50 уровней, 40% шанс
        if (newLevel >= SPACE_OBJECTS_START && newLevel % 80 === 0 && Math.random() < 0.4) {
        setPlanets(objs => {
          const filtered = objs.filter(o => o.worldY - bg > -windowHeight * 3);
          let newX = Math.random() * 60 + 10;
          let attempts = 0;
          while (Math.abs(newX - lastPlanetX) < 30 && attempts < 10) {
            newX = Math.random() * 60 + 10;
            attempts++;
          }
          setLastPlanetX(newX);
          return [...filtered, {
            id: Date.now(),
            type: 'planet' as const,
            x: newX,
            worldY: bg + windowHeight * 1.2 + Math.random() * windowHeight * 0.5,
            zIndex: 1,
          }];
        });
      }

      // Космические объекты — отдельный стейт, каждые 5 уровней, 50% шанс
      const SPACE_OBJ_TYPES: Array<'ship' | 'meteor' | 'rocket' | 'satellite' | 'asteroid'> = ['ship', 'meteor', 'rocket', 'satellite', 'asteroid'];
      if (newLevel >= SPACE_OBJECTS_START && newLevel % 5 === 0 && Math.random() < 0.5) {
        setSpaceObjects(objs => {
          const filtered = objs.filter(o => o.worldY - bg > -windowHeight * 3);
          const type = SPACE_OBJ_TYPES[Math.floor(Math.random() * SPACE_OBJ_TYPES.length)];
          const fromLeft = Math.random() > 0.5;
          return [...filtered, {
            id: Date.now() + 1,
            type,
            x: fromLeft ? -10 : 110,
            worldY: bg + windowHeight * 1.1 + Math.random() * windowHeight * 0.5,
            zIndex: 3,
            fromLeft,
          } as SpaceObject];
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
    generatedClouds, generatedStars, planets, spaceObjects,
    handleWater, handleBoost, trunkSegments,
    squashTransform, squashTransition,
  };
}
