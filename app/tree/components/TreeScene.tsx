import React from 'react';
import { CLOUDS_BEHIND, CLOUDS_FRONT, Leaf, Cloud, Star, SpaceObject } from '../constants';

type Props = {
  worldBottom: number;
  windowSize: { width: number; height: number };
  objScale: number;
  bgSrc: string;
  treeWidthVw: number;
  crownTopPx: number;
  baseOffset: number;
  dragonBottomVw: number;
  trunkSegments: string[];
  squashTransform: string;
  squashTransition: string;
  quote: string | null;
  quoteDirection: 'left' | 'right';
  leaves: Leaf[];
  generatedClouds: Cloud[];
  generatedStars: Star[];
  spaceObjects: SpaceObject[];
  planets: SpaceObject[];
  isTablet: boolean;
  isMobile: boolean;
  level: number;
  hasRendered: boolean;
};

export default function TreeScene({
  worldBottom, windowSize, objScale, bgSrc,
  treeWidthVw, crownTopPx, baseOffset,
  dragonBottomVw, trunkSegments, planets,
  squashTransform, squashTransition,
  quote, quoteDirection, leaves, generatedClouds, generatedStars,
  spaceObjects, isMobile, isTablet, level, hasRendered,
}: Props) {
  const bt = hasRendered ? 'bottom 0.8s ease' : 'none';

  return (
    <>
      {/* Фон */}
      <div style={{
        position: 'absolute', bottom: worldBottom, left: '50%',
        transform: 'translateX(-50%)', transition: bt, width: '100%',
      }}>
        <img src={bgSrc} alt="background" draggable="false"
          style={{ width: '100%', display: 'block', imageRendering: 'pixelated' }}
        />
      </div>

      {/* Дракон */}
      <div style={{
        position: 'absolute',
        bottom: worldBottom + windowSize.width * dragonBottomVw,
        left: 0, right: 0, transition: bt,
        zIndex: 1, pointerEvents: 'none',
      }}>
        <img src="/tree/dragon.gif" alt="" draggable="false"
          style={{ imageRendering: 'pixelated', animation: 'dragonFly 50s linear infinite', animationDelay: '-25s' }}
        />
      </div>

      {/* Облака ЗА деревом — статичные */}
      {CLOUDS_BEHIND.map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: worldBottom + windowSize.width * c.bottomVw * objScale,
          left: c.left, transition: bt,
          zIndex: 1, pointerEvents: 'none',
        }}>
          <img src={`/tree/${c.src}.png`} alt="" draggable="false"
            style={{
              width: `${c.widthVw}vw`, imageRendering: 'pixelated',
              animation: `${c.anim} ${c.dur} ease-in-out infinite`,
              animationDelay: c.delay,
            }}
          />
        </div>
      ))}

      {/* Облака генерируемые */}
      {generatedClouds.map(cloud => (
        <div key={cloud.id} style={{
          position: 'absolute',
          bottom: worldBottom + cloud.worldY,
          left: `${cloud.x}%`,
          transition: bt,
          zIndex: cloud.zIndex,
          pointerEvents: 'none',
        }}>
          <img src={`/tree/${cloud.type}.png`} alt="" draggable="false"
            style={{
              width: `${cloud.widthVw}vw`,
              imageRendering: 'pixelated',
              animation: `cloudFloat1 ${cloud.animDur} ease-in-out infinite`,
              animationDelay: cloud.animDelay,
            }}
          />
        </div>
      ))}

      {/* Звёзды */}
      {generatedStars.map(star => (
        <div key={star.id} style={{
          position: 'absolute',
          left: `${star.x}%`,
          bottom: worldBottom + star.worldY,
          transition: bt,
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
      ))}

      {/* Планеты */}
      {planets.map(obj => (
        <div key={obj.id} style={{
          position: 'absolute',
          bottom: worldBottom + obj.worldY,
          left: `${obj.x}%`,
          transition: bt,
          zIndex: obj.zIndex,
          pointerEvents: 'none',
        }}>
          <img src="/tree/planet.png" alt="" draggable="false"
            style={{
              width: isMobile ? '35vw' : '18vw',
              imageRendering: 'pixelated',
              display: 'block',
            }}
          />
        </div>
      ))}

      {/* Космические объекты — летят горизонтально */}
      {spaceObjects.map(obj => (
        <div key={obj.id} style={{
          position: 'absolute',
          bottom: worldBottom + obj.worldY,
          left: obj.fromLeft ? '-10%' : '110%',
          transition: bt,
          zIndex: obj.zIndex,
          pointerEvents: 'none',
          animation: `${obj.fromLeft ? 'flyLeftToRight' : 'flyRightToLeft'} 8s linear forwards`,
        }}>
          {obj.type === 'ship' && (
            <img src="/tree/ship.gif" alt="" draggable="false"
              style={{
                imageRendering: 'pixelated',
                transform: obj.fromLeft ? 'scaleX(1)' : 'scaleX(-1)',
              }}
            />
          )}
          {obj.type === 'meteor' && (
            <div style={{ fontSize: isMobile ? '40px' : '52px', lineHeight: 1,
              transform: obj.fromLeft ? 'rotate(-45deg)' : 'rotate(45deg)' }}>
              ☄️
            </div>
          )}
          {obj.type === 'rocket' && (
            <div style={{ fontSize: isMobile ? '36px' : '48px', lineHeight: 1,
              transform: obj.fromLeft ? 'rotate(90deg)' : 'rotate(-90deg)' }}>
              🚀
            </div>
          )}
          {obj.type === 'satellite' && (
            <div style={{ fontSize: isMobile ? '34px' : '44px', lineHeight: 1 }}>
              🛸
            </div>
          )}
          {obj.type === 'asteroid' && (
            <div style={{ fontSize: isMobile ? '38px' : '50px', lineHeight: 1,
              transform: 'rotate(20deg)' }}>
              🪨
            </div>
          )}
        </div>
      ))}

      {/* Крона + стволы */}
      <div style={{
        position: 'fixed',
        top: `${crownTopPx}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2, pointerEvents: 'none',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          lineHeight: 0, fontSize: 0, transformOrigin: 'bottom center',
          transform: squashTransform, transition: squashTransition,
        }}>
          <img src="/tree/2.png" alt="crown" draggable="false"
            style={{ width: `${treeWidthVw}vw`, imageRendering: 'pixelated', display: 'block' }}
          />
          {trunkSegments.map((src, i) => (
            <img key={i} src={src} alt="trunk" draggable="false"
              style={{
                width: `${treeWidthVw}vw`,
                imageRendering: 'pixelated',
                display: 'block',
                marginBottom: '-1px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Листья */}
      {leaves.map(leaf => (
        <div key={leaf.id} style={{
          position: 'fixed',
          top: `${crownTopPx + (isMobile ? 180 : isTablet ? 240 : 260)}px`,
          left: `calc(50% + ${leaf.startX}px)`,
          width: '3px',
          height: '3px',
          backgroundColor: '#5b6d43',
          borderRadius: '1px',
          pointerEvents: 'none',
          zIndex: 6,
          animationName: 'leafFall',
          animationDuration: `${leaf.duration}s`,
          animationTimingFunction: 'ease-in',
          animationDelay: `${leaf.delay}s`,
          animationFillMode: 'forwards',
          ['--x' as any]: `${leaf.x}px`,
        }} />
      ))}

      {/* Level badge */}
      <div style={{
        position: 'fixed',
        top: `${crownTopPx - 36}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
        pointerEvents: 'none',
        color: 'white',
        fontSize: isMobile ? '11px' : '13px',
        fontFamily: 'monospace',
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.25)',
        padding: '3px 10px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
        letterSpacing: '0.05em',
      }}>
        Level {level}
      </div>

      {/* Цитата */}
      {quote && (
        <div style={{
          position: 'fixed',
          top: `${crownTopPx - 20}px`,
          left: '50%',
          zIndex: 5,
          pointerEvents: 'none',
          animation: `${quoteDirection === 'left' ? 'quoteLeft' : 'quoteRight'} 5s ease forwards`,
          whiteSpace: 'nowrap',
          fontSize: isMobile ? '11px' : '13px',
          color: 'black',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(255,255,255,0.4)',
        }}>
          {quote}
        </div>
      )}

      {/* Основание */}
      <div style={{
        position: 'absolute',
        bottom: worldBottom + windowSize.width * baseOffset * objScale,
        left: '50%', transform: 'translateX(-50%)',
        transition: bt, zIndex: 2, pointerEvents: 'none',
      }}>
        <img src="/tree/5.png" alt="tree base" draggable="false"
          style={{ width: `${treeWidthVw}vw`, imageRendering: 'pixelated', display: 'block' }}
        />
      </div>

      {/* Облака ПОВЕРХ дерева */}
      {CLOUDS_FRONT.map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: worldBottom + windowSize.width * c.bottomVw * objScale,
          left: c.left, transition: bt,
          zIndex: 3, pointerEvents: 'none',
        }}>
          <img src={`/tree/${c.src}.png`} alt="" draggable="false"
            style={{
              width: `${c.widthVw}vw`, imageRendering: 'pixelated',
              animation: `${c.anim} ${c.dur} ease-in-out infinite`,
              animationDelay: c.delay,
            }}
          />
        </div>
      ))}

      {/* Дирижабль */}
      <div style={{
        position: 'absolute',
        bottom: worldBottom + windowSize.width * 0.43 * objScale,
        right: '18%', transition: bt,
        zIndex: 3, pointerEvents: 'none',
      }}>
        <img src="/tree/dirijabl.png" alt="" draggable="false"
          style={{ imageRendering: 'pixelated', animation: 'bob 6s ease-in-out infinite' }}
        />
      </div>
    </>
  );
}
