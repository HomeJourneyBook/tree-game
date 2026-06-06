import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useDeviceType } from '../../app/tree/hooks/useDeviceType';
import { useTreeGame } from '../../app/tree/hooks/useTreeGame';
import TreeScene from '../../app/tree/components/TreeScene';
import WaterButton from '../../app/tree/components/WaterButton';
import { SPACE_THRESHOLD, TRANSITION_DURATION } from '../../app/tree/constants';

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = [
    parseInt(color1.slice(1, 3), 16),
    parseInt(color1.slice(3, 5), 16),
    parseInt(color1.slice(5, 7), 16),
  ];
  const c2 = [
    parseInt(color2.slice(1, 3), 16),
    parseInt(color2.slice(3, 5), 16),
    parseInt(color2.slice(5, 7), 16),
  ];
  const result = c1.map((c, i) => Math.round(c + (c2[i] - c) * factor));
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

export default function TreePage() {
  const [imagesReady, setImagesReady] = useState(false);

  const {
    isMobile, isTablet, isLandscape,
    windowSize, trunkHeightPx,
    treeWidthVw, objScale, crownTopPx,
    baseOffset, dragonBottomVw, bgSrc,
  } = useDeviceType();

  const {
    level, isCooldown, cooldownProgress,
    isSquashing, plusOnes, quote, leaves,
    generatedClouds, generatedStars, spaceObjects,
    handleWater, handleBoost, trunkSegments,
    squashTransform, squashTransition,
  } = useTreeGame(windowSize.height, trunkHeightPx);

  const isReady = imagesReady && windowSize.width > 0;

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
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === images.length) setImagesReady(true);
      };
      img.src = src;
    });
  }, []);

  const worldBottom = -(level * trunkHeightPx);

  const skyProgress = Math.min(
    Math.max(level - SPACE_THRESHOLD, 0) / TRANSITION_DURATION,
    1
  );
  const skyColor = interpolateColor('#87ccc9', '#000011', skyProgress);

  return (
    <>
      <Head>
        <title>The Great Tea Tree</title>
      </Head>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; background: #87ccc9; }
        img { -webkit-user-drag: none; user-select: none; }

        @keyframes cloudFloat1 {
          0% { transform: translateX(0px); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(0px); }
        }
        @keyframes cloudFloat2 {
          0% { transform: translateX(0px); }
          50% { transform: translateX(-35px); }
          100% { transform: translateX(0px); }
        }
        @keyframes cloudFloat3 {
          0% { transform: translateX(0px); }
          50% { transform: translateX(25px); }
          100% { transform: translateX(0px); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes dragonFly {
          0% { transform: translateX(120vw); }
          100% { transform: translateX(-200px); }
        }
        @keyframes shipFly {
          0% { transform: translateX(120vw); }
          100% { transform: translateX(-400px); }
        }
        @keyframes plusOneAnim {
          0% { opacity: 1; transform: translateY(0px) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.4); }
        }
        @keyframes leafFall {
          0% { opacity: 1; transform: translateX(0px) translateY(0px) rotate(0deg); }
          100% { opacity: 0; transform: translateX(var(--x)) translateY(80px) rotate(180deg); }
        }
        @keyframes quoteAnim {
          0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0px); }
          75% { opacity: 1; transform: translateX(-50%) translateY(0px); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.6); }
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
          quote={quote}
          leaves={leaves}
          generatedClouds={generatedClouds}
          generatedStars={generatedStars}
          spaceObjects={spaceObjects}
          isTablet={isTablet}
          isMobile={isMobile}
        />

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
