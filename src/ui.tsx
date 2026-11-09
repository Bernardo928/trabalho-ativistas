import React from 'react';
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const C = {
  ink: '#0d1b2a',
  yellow: '#ffd23f',
  red: '#dc2626',
  green: '#22c55e',
  greenDark: '#15803d',
  white: '#ffffff',
  sand: '#f2cf8d',
  sandDark: '#d9ad62',
  night1: '#0a1630',
  night2: '#1b3768',
  sea1: '#0c7fa8',
  sea2: '#063a5c',
};

export const FONT_TITLE = 'Anton, Impact, sans-serif';
export const FONT_UI = 'Inter, Arial, sans-serif';

// Spring 0..1 that starts at a given time (seconds) relative to the scene.
export const usePop = (atSeconds = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - atSeconds * fps, fps, config: {damping, mass: 0.6}});
};

export const useSeconds = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

export const Fill: React.FC<{style?: React.CSSProperties; children?: React.ReactNode}> = ({
  style,
  children,
}) => <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...style}}>{children}</div>;

// Rounded label in the same family as the on-screen UI cards.
export const Tag: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, bg = C.red, color = C.white, size = 40, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      background: bg,
      color,
      fontFamily: FONT_UI,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 1,
      textTransform: 'uppercase',
      padding: `${size * 0.35}px ${size * 0.6}px`,
      borderRadius: size * 0.45,
      boxShadow: '0 10px 0 rgba(0,0,0,.25)',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Bubbles: React.FC<{count?: number; seed?: string}> = ({count = 26, seed = 'b'}) => {
  const t = useSeconds();
  return (
    <Fill>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const speed = 60 + random(`${seed}s${i}`) * 120;
        const r = 6 + random(`${seed}r${i}`) * 18;
        const y = 1920 - ((t * speed + random(`${seed}y${i}`) * 1920) % 2100);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.sin(t * 2 + i) * 12,
              top: y,
              width: r,
              height: r,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,.45)',
            }}
          />
        );
      })}
    </Fill>
  );
};

export const Underwater: React.FC<{children?: React.ReactNode; tint?: string}> = ({
  children,
  tint,
}) => {
  const t = useSeconds();
  return (
    <Fill style={{background: `linear-gradient(${tint ?? C.sea1}, ${C.sea2} 85%)`}}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: -200,
            left: 120 + i * 260 + Math.sin(t * 0.8 + i) * 40,
            width: 120,
            height: 1500,
            background: 'linear-gradient(rgba(255,255,255,.18), rgba(255,255,255,0))',
            transform: 'rotate(14deg)',
            transformOrigin: 'top',
          }}
        />
      ))}
      <Bubbles />
      {children}
    </Fill>
  );
};

export const fadeIn = (t: number, at: number, dur = 0.35) =>
  interpolate(t, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
