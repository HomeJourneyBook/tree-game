import React, { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import { useDeviceType } from '../../app/tree/hooks/useDeviceType';
import { useTreeGame } from '../../app/tree/hooks/useTreeGame';
import TreeScene from '../../app/tree/components/TreeScene';
import WaterButton from '../../app/tree/components/WaterButton';
import { SPACE_THRESHOLD, TRANSITION_DURATION } from '../../app/tree/constants';

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = [parseInt(color1.slice(1,3),16), parseInt(color1.slice(3,5),16), parseInt(color1.slice(5,7),16)];
  const c2 = [parseInt(color2.slice(1,3),16), parseInt(color2.slice(3,5),16), parseInt(color2.slice(5,7),16)];
  const result = c1.map((c, i) => Math.round(c + (c2[i] - c) * factor));
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

export default function TreePage() {
  const [imagesReady, setImagesReady] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);

  const {
    isMobile, isTablet, isLandscape,
    windowSize, trunkHeightPx,
    treeWidthVw, objScale, crownTopPx,
    baseOffset, dragonBottomVw, bgSrc,
  } = useDeviceType();

  const {
    level, isCooldown, cooldownProgress,
    isSquashing, plusOnes, quoteDirection, quote, leaves,
    generatedClouds, planets, spaceObjects,
    atmosphereWarning, showRainbow, comet, bird, collectible,
    setCollectible,
    handleWater, handleBoost, trunkSegments,
    squashTransform, squashTransition,
  } = useTreeGame(windowSize.height, trunkHeightPx);

  const isReady = imagesReady && windowSize.width > 0;

  useEffect(() => {
    if (isReady) requestAnimationFrame(() => setHasRendered(true));
  }, [isReady]);

  useEffect(() => {
    const images = [
      '/tree/2.png', '/tree/5.png',
      '/tree/base.png', '/tree/base_m.png',
      '/tree/planet.png', '/tree/ship.gif',
      ...Array.from({ length: 10 }, (_, i) => `/tree/stvol${i + 1}.png`),
    ];
    let loaded = 0;
    images.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; if (loaded === images.length) setImagesReady(true); };
      img.src = src;
    });
  }, []);

  // Звёзды — 250 штук, генерируются один раз
  const stars = useMemo(() => Array.from({ length: 250 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() > 0.8 ? 2 : 1,
    twinkleDur: `${(1.5 + Math.random() * 2).toFixed(1)}s`,
    twinkleDelay: `-${(Math.random() * 3).toFixed(1)}s`,
  })), []);

  // Созвездия — 4 группы по 5-7 звёзд со связями
  const constellations = useMemo(() => [
    { stars: [{x:15,y:20},{x:18,y:15},{x:22,y:18},{x:20,y:23},{x:16,y:26}], lines: [[0,1],[1,2],[2,3],[3,4],[4,0]] },
    { stars: [{x:70,y:15},{x:75,y:12},{x:80,y:16},{x:77,y:22},{x:72,y:20}], lines: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,3]] },
    { stars: [{x:40,y:30},{x:45,y:25},{x:50,y:28},{x:48,y:35},{x:43,y:33}], lines: [[0,1],[1,2],[2,3],[3,4],[4,0]] },
    { stars: [{x:85,y:40},{x:88,y:35},{x:92,y:38},{x:90,y:44},{x:86,y:46}], lines: [[0,1],[1,2],[2,3],[3,4]] },
  ], []);

  const worldBottom = -(level * trunkHeightPx);
  const skyProgress = Math.min(Math.max(level - SPACE_THRESHOLD, 0) / TRANSITION_DURATION, 1);
  const skyColor = interpolateColor('#87ccc9', '#000011', skyProgress);
  const starOffset = windowSize.height > 0
    ? ((level - SPACE_THRESHOLD) * trunkHeightPx) % windowSize.height
    : 0;

  return (
    <>
      <Head><title>The Great Tea Tree</title></Head>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; background: #87ccc9; }
        img { -webkit-user-drag: none; user-select: none; }

        @keyframes cloudFloat1 {
          0% { transform: translateX(0px); } 50% { transform: translateX(40px); } 100% { transform: translateX(0px); }
        }
        @keyframes cloudFloat2 {
          0% { transform: translateX(0px); } 50% { transform: translateX(-35px); } 100% { transform: translateX(0px); }
        }
        @keyframes cloudFloat3 {
          0% { transform: translateX(0px); } 50% { transform: translateX(25px); } 100% { transform: translateX(0px); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); }
        }
        @keyframes dragonFly {
          0% { transform: translateX(120vw); } 100% { transform: translateX(-200px); }
        }
        @keyframes flyLeftToRight {
          0% { transform: translateX(-150vw); } 100% { transform: translateX(150vw); }
        }
        @keyframes flyRightToLeft {
          0% { transform: translateX(150vw); } 100% { transform: translateX(-150vw); }
        }
        @keyframes cometLeft {
          0% { transform: translate(-20vw, -20vh); opacity: 1; }
          100% { transform: translate(120vw, 120vh); opacity: 0; }
        }
        @keyframes cometRight {
          0% { transform: translate(120vw, -20vh); opacity: 1; }
          100% { transform: translate(-20vw, 120vh); opacity: 0; }
        }
        @keyframes birdLeft {
          0% { transform: translateX(-10vw); } 100% { transform: translateX(110vw); }
        }
        @keyframes birdRight {
          0% { transform: translateX(110vw) scaleX(-1); } 100% { transform: translateX(-10vw) scaleX(-1); }
        }
        @keyframes plusOneAnim {
          0% { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.4); }
        }
        @keyframes leafFall {
          0% { opacity: 1; transform: translateX(0px) translateY(0px) rotate(0deg); }
          100% { opacity: 0; transform: translateX(var(--x)) translateY(80px) rotate(180deg); }
        }
        @keyframes quoteLeft {
          0% { opacity: 0; transform: translate(0px, 0px); }
          8% { opacity: 1; }
          60% { opacity: 1; transform: translate(-90px, -90px); }
          100% { opacity: 0; transform: translate(-110px, -110px); }
        }
        @keyframes quoteRight {
          0% { opacity: 0; transform: translate(0px, 0px); }
          8% { opacity: 1; }
          60% { opacity: 1; transform: translate(90px, -90px); }
          100% { opacity: 0; transform: translate(110px, -110px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.6); }
        }
        @keyframes warningFly {
          0% { transform: translateX(-110vw); }
          100% { transform: translateX(110vw); }
        }
        @keyframes rainbowFade {
          0% { opacity: 0; } 15% { opacity: 0.7; } 85% { opacity: 0.7; } 100% { opacity: 0; }
        }
        @keyframes collectibleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        @keyframes collectiblePop {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2); opacity: 0.5; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>

      {!isReady && (
        <div style={{
          position: 'fixed', inset: 0, background: '#87ccc9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, color: 'white', fontSize: '16px', opacity: 0.6,
        }}>
          Loading…
        </div>
      )}

      <div style={{
        width: '100vw', height: '100dvh',
        position: 'relative', overflow: 'hidden',
        backgroundColor: skyColor,
        transition: 'background-color 1s ease',
        opacity: isReady ? 1 : 0,
      }}>

        {/* Радуга */}
        {showRainbow && (
          <div style={{
            position: 'fixed',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120vw',
            height: '60vw',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            background: 'conic-gradient(from 180deg, transparent 50%, rgba(255,0,0,0.3) 52%, rgba(255,165,0,0.3) 56%, rgba(255,255,0,0.3) 60%, rgba(0,255,0,0.3) 64%, rgba(0,0,255,0.3) 68%, rgba(148,0,211,0.3) 72%, transparent 74%)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'rainbowFade 8s ease forwards',
          }} />
        )}

        {/* Звёзды параллакс — два слоя */}
        {level >= SPACE_THRESHOLD && [0, 1].map(layer =>
          stars.map(star => (
            <div key={`${layer}-${star.id}`} style={{
              position: 'fixed',
              left: `${star.x}%`,
              top: `${star.y + (layer * 100) - 100}%`,
              transform: `translateY(${starOffset}px)`,
              width: star.size === 2 ? '3px' : '2px',
              height: star.size === 2 ? '3px' : '2px',
              backgroundColor: 'white',
              borderRadius: '50%',
              zIndex: 0,
              pointerEvents: 'none',
              animation: star.size === 2
                ? `twinkle ${star.twinkleDur} ease-in-out infinite ${star.twinkleDelay}`
                : 'none',
            }} />
          ))
        )}

        {/* Созвездия — в космосе */}
        {level >= SPACE_THRESHOLD + 20 && (
          <svg style={{
            position: 'fixed', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 1,
            opacity: Math.min((level - SPACE_THRESHOLD - 20) / 20, 0.6),
          }}>
            {constellations.map((c, ci) =>
              c.lines.map(([a, b], li) => (
                <line
                  key={`${ci}-${li}`}
                  x1={`${c.stars[a].x}%`} y1={`${c.stars[a].y}%`}
                  x2={`${c.stars[b].x}%`} y2={`${c.stars[b].y}%`}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="0.5"
                />
              ))
            )}
            {constellations.map((c, ci) =>
              c.stars.map((s, si) => (
                <circle
                  key={`${ci}-${si}`}
                  cx={`${s.x}%`} cy={`${s.y}%`}
                  r="2" fill="white" opacity="0.8"
                />
              ))
            )}
          </svg>
        )}

        {/* Комета */}
        {comet && (
          <div style={{
            position: 'fixed',
            top: '10%',
            left: comet.fromLeft ? '-5%' : '105%',
            zIndex: 4,
            pointerEvents: 'none',
            animation: `${comet.fromLeft ? 'cometLeft' : 'cometRight'} 3.5s ease-in forwards`,
            fontSize: isMobile ? '24px' : '32px',
            filter: 'drop-shadow(0 0 6px rgba(255,220,100,0.8))',
          }}>
            ☄️
          </div>
        )}

        {/* Птица */}
        {bird && (
          <div style={{
            position: 'fixed',
            top: `${25 + Math.random() * 20}%`,
            left: 0,
            zIndex: 4,
            pointerEvents: 'none',
            animation: `${bird.side === 'left' ? 'birdLeft' : 'birdRight'} 5s linear forwards`,
            fontSize: isMobile ? '20px' : '26px',
          }}>
            🐦
          </div>
        )}

        {/* Интерактивный объект */}
        {collectible && (
          <div
            onClick={() => setCollectible(null)}
            style={{
              position: 'fixed',
              left: `${collectible.x}%`,
              top: `${collectible.y}%`,
              zIndex: 10,
              cursor: 'pointer',
              fontSize: isMobile ? '28px' : '36px',
              animation: 'collectibleFloat 2s ease-in-out infinite',
              filter: 'drop-shadow(0 0 8px rgba(255,255,100,0.8))',
              userSelect: 'none',
            }}
          >
            {collectible.emoji}
          </div>
        )}

        <TreeScene
          worldBottom={worldBottom}
          windowSize={windowSize}
          objScale={objScale}
          bgSrc={bgSrc}
          treeWidthVw={treeWidthVw}
          crownTopPx={crownTopPx}
          baseOffset={baseOffset}
          dragonBottomVw={dragonBottomVw}
          trunkSegments={trunkSegments}
          squashTransform={squashTransform}
          squashTransition={squashTransition}
          quoteDirection={quoteDirection}
          quote={quote}
          leaves={leaves}
          generatedClouds={generatedClouds}
          planets={planets}
          spaceObjects={spaceObjects}
          isTablet={isTablet}
          isMobile={isMobile}
          level={level}
          hasRendered={hasRendered}
        />

        {/* Надпись на уровне 90 */}
        {atmosphereWarning && (
          <div style={{
            position: 'fixed',
            top: '35%',
            left: 0,
            zIndex: 10,
            pointerEvents: 'none',
            animation: 'warningFly 10s linear forwards',
            whiteSpace: 'nowrap',
            fontSize: isMobile ? '13px' : '16px',
            color: 'rgba(255, 220, 100, 0.9)',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(255, 200, 0, 0.6)',
            letterSpacing: '0.05em',
          }}>
            ⚠️ Осторожно — вы выходите за пределы атмосферы
          </div>
        )}

        <WaterButton
          isCooldown={isCooldown}
          cooldownProgress={cooldownProgress}
          isMobile={isMobile}
          plusOnes={plusOnes}
          onClick={handleWater}
          onBoost={handleBoost}
        />

        {isMobile && isLandscape && (
          <div style={{
            position: 'fixed', inset: 0, background: '#1a1a2e',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 100, color: 'white', fontSize: '16px',
            textAlign: 'center', gap: '16px',
          }}>
            <div style={{ fontSize: '48px' }}>🌳</div>
            <div>Поверни телефон вертикально</div>
          </div>
        )}
      </div>
    </>
  );
}
