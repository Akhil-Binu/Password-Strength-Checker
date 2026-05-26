import React from 'react';

interface StrengthGaugeProps {
  entropy: number;
  strength: 'very-weak' | 'weak' | 'reasonable' | 'strong' | 'very-strong';
  crackTimeOffline: string;
  crackTimeOnline: string;
}

export const StrengthGauge: React.FC<StrengthGaugeProps> = ({
  entropy,
  strength,
  crackTimeOffline,
  crackTimeOnline,
}) => {
  // Map strength to percentage of gauge (max out at 128 bits)
  const maxEntropy = 128;
  const percentage = Math.min(100, (entropy / maxEntropy) * 100);

  // SVG dimensions
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  // Calculate dash offset to fill the circle (counter-clockwise or starting from top)
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Tier specific text and colors
  const strengthLabels = {
    'very-weak': 'Very Weak',
    'weak': 'Weak',
    'reasonable': 'Moderate',
    'strong': 'Strong',
    'very-strong': 'Very Strong',
  };

  return (
    <div className="gauge-wrapper">
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        {/* Outer Glow Ring */}
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
          />
          {/* Animated Progress Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={`var(--color-${strength})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
              filter: `drop-shadow(0 0 6px var(--glow-${strength}))`,
            }}
          />
        </svg>

        {/* Text Inside Ring */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1,
            }}
            className="light-theme-dark-text"
          >
            {entropy}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#6b7280',
              marginTop: '2px',
              textTransform: 'uppercase',
            }}
          >
            Bits Entropy
          </span>
          <span
            className={`badge ${strength}`}
            style={{
              marginTop: '8px',
              fontSize: '0.7rem',
            }}
          >
            {strengthLabels[strength]}
          </span>
        </div>
      </div>

      {/* Time to Crack Stats */}
      <div className="time-to-crack-box">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div className="time-label">Offline Crack Time</div>
            <div className={`time-value ${strength}`}>{crackTimeOffline}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              (Desktop GPU / Botnet brute force)
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <div className="time-label">Online Crack Time</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '2px' }}>
              {crackTimeOnline}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              (Network rate-limited brute force)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StrengthGauge;
