import React from 'react';

type Props = {
  isCooldown: boolean;
  cooldownProgress: number;
  isMobile: boolean;
  plusOnes: { id: number }[];
  onClick: () => void;
  onBoost: () => void;
};

const radius = 26;
const circumference = 2 * Math.PI * radius;

export default function WaterButton({ isCooldown, cooldownProgress, isMobile, plusOnes, onClick, onBoost }: Props) {
  const strokeDashoffset = circumference * (1 - cooldownProgress);

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile
        ? 'calc(env(safe-area-inset-bottom) + 60px)'
        : 'calc(env(safe-area-inset-bottom) + 30px)',
      left: '30px',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    }}>
      {/* +1 анимации */}
      {plusOnes.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          bottom: '130px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          pointerEvents: 'none',
          animation: 'plusOneAnim 1.2s ease forwards',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}>
          +1 💧
        </div>
      ))}

      {/* Кнопка x10 */}
      <button
        onClick={onBoost}
        style={{
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'rgba(180,0,0,0.7)', border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
          boxShadow: '0 0 10px rgba(255,0,0,0.4)',
        }}
      >
        <span style={{ fontSize: '20px' }}>⭐</span>
      </button>

      {/* Кнопка полива */}
      <button
        onClick={onClick}
        disabled={isCooldown}
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)', border: 'none',
          cursor: isCooldown ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0,
        }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: 'absolute' }}>
          <circle cx="30" cy="30" r={radius} fill="none"
            stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          {isCooldown && (
            <circle cx="30" cy="30" r={radius} fill="none"
              stroke="rgba(255,255,255,0.6)" strokeWidth="2"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" transform="rotate(-90 30 30)"
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          )}
        </svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"
          style={{ opacity: isCooldown ? 0.3 : 1, position: 'relative', zIndex: 1 }}>
          <path d="M12 2C12 2 5 10 5 15C5 18.866 8.134 22 12 22C15.866 22 19 18.866 19 15C19 10 12 2 12 2Z"/>
        </svg>
      </button>
    </div>
  );
}
