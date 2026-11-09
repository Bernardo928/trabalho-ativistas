import React from 'react';
import {useCurrentFrame} from 'remotion';

export type Mood =
  | 'feliz'
  | 'orgulhosa'
  | 'triste'
  | 'assustada'
  | 'chocada'
  | 'aliviada'
  | 'determinada'
  | 'confusa'
  | 'mastigando';

const INK = '#10243a';

// Olho grande com brilho; `open` 0..1 (piscar), `pupil` raio da pupila.
const Eye: React.FC<{cx: number; cy: number; r: number; pupil: number; look: number; open: number}> = ({
  cx,
  cy,
  r,
  pupil,
  look,
  open,
}) => (
  <g transform={`translate(${cx} ${cy}) scale(1 ${Math.max(open, 0.08)}) translate(${-cx} ${-cy})`}>
    <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth="2" />
    <circle cx={cx + look * (r - pupil - 1)} cy={cy + 0.5} r={pupil} fill={INK} />
    <circle cx={cx + look * (r - pupil - 1) + pupil * 0.4} cy={cy - pupil * 0.4} r={pupil * 0.38} fill="#fff" />
  </g>
);

// Rosto da tartaruga (vista de lado). Coordenadas do viewBox 0 0 200 140.
const Face: React.FC<{mood: Mood; blink: number; look: number; t: number}> = ({mood, blink, look, t}) => {
  const ex = 177;
  const ey = 72;
  const happyEyes = mood === 'aliviada' || mood === 'orgulhosa';
  const big = mood === 'assustada' || mood === 'chocada';
  const r = big ? 10 : 8;
  const pupil = big ? 3 : 4.6;

  const brow: Record<Mood, string> = {
    feliz: `M${ex - 9} ${ey - 13} q 9 -5 18 0`,
    orgulhosa: `M${ex - 9} ${ey - 13} q 9 -6 18 -1`,
    triste: `M${ex - 9} ${ey - 11} L${ex + 9} ${ey - 17}`,
    assustada: `M${ex - 10} ${ey - 18} q 10 -7 20 0`,
    chocada: `M${ex - 10} ${ey - 20} q 10 -8 20 0`,
    aliviada: `M${ex - 9} ${ey - 12} q 9 -4 18 0`,
    determinada: `M${ex - 9} ${ey - 16} L${ex + 9} ${ey - 10}`,
    confusa: `M${ex - 9} ${ey - 18} q 9 -6 18 2`,
    mastigando: `M${ex - 9} ${ey - 13} q 9 -4 18 0`,
  };

  const chew = Math.sin(t * 18);
  const mouth: Record<Mood, React.ReactNode> = {
    feliz: <path d="M181 84 q7 7 14 -1" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />,
    orgulhosa: <path d="M180 83 q8 9 16 -1 Z" fill={INK} />,
    triste: <path d="M182 90 q6 -6 12 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />,
    assustada: <ellipse cx="188" cy="88" rx="4" ry="5" fill={INK} />,
    chocada: <ellipse cx="188" cy="88" rx="6" ry="8" fill={INK} />,
    aliviada: <path d="M181 84 q7 6 14 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />,
    determinada: <path d="M182 87 q6 2 13 -2" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />,
    confusa: <path d="M181 87 q3 -3 6 0 q3 3 7 -1" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />,
    mastigando: (
      <>
        <ellipse cx="191" cy={86 + chew} rx="7" ry={3 + chew * 1.5} fill={INK} />
        <circle cx="184" cy="84" r="6" fill="#4fb07f" />
      </>
    ),
  };

  return (
    <g>
      {(mood === 'feliz' || mood === 'orgulhosa' || mood === 'aliviada') && (
        <ellipse cx="172" cy="86" rx="6" ry="3.5" fill="#ff8fa3" opacity="0.7" />
      )}
      {happyEyes ? (
        <path d={`M${ex - 7} ${ey + 1} q 7 -8 14 0`} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <Eye cx={ex} cy={ey} r={r} pupil={pupil} look={look} open={1 - blink} />
      )}
      <path d={brow[mood]} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      {mouth[mood]}
      {mood === 'triste' && (
        <path d={`M${ex + 2} ${ey + 9 + ((t * 30) % 14)} q -3 5 0 7 q 3 -2 0 -7`} fill="#7dd3fc" />
      )}
      {(mood === 'assustada' || mood === 'aliviada') && (
        <path d="M160 58 q -4 7 0 10 q 4 -3 0 -10" fill="#7dd3fc" stroke="#38bdf8" strokeWidth="1" />
      )}
    </g>
  );
};

// Sinal acima da cabeça: "!", "?" ou brilho.
const Bubble: React.FC<{mood: Mood; t: number}> = ({mood, t}) => {
  const bob = Math.sin(t * 6) * 2;
  if (mood === 'chocada')
    return (
      <text x="182" y={42 + bob} fontFamily="Anton, Impact, sans-serif" fontSize="34" fill="#dc2626" stroke="#fff" strokeWidth="3" paintOrder="stroke" textAnchor="middle">
        !
      </text>
    );
  if (mood === 'confusa')
    return (
      <text x="186" y={42 + bob} fontFamily="Anton, Impact, sans-serif" fontSize="32" fill="#ffd23f" stroke={INK} strokeWidth="3" paintOrder="stroke" textAnchor="middle">
        ?
      </text>
    );
  if (mood === 'orgulhosa')
    return (
      <g transform={`translate(196 ${40 + bob}) rotate(${t * 90})`}>
        <path d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z" fill="#ffd23f" />
      </g>
    );
  return null;
};

// Tartaruga de lado. `flap` em [-1, 1] mexe as nadadeiras; `mood` muda o rosto.
export const Turtle: React.FC<{
  width?: number;
  flap?: number;
  sad?: boolean;
  mood?: Mood;
  look?: number;
  style?: React.CSSProperties;
}> = ({width = 420, flap = 0, sad = false, mood, look = 0.3, style}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const m: Mood = mood ?? (sad ? 'triste' : 'feliz');
  // Pisca a cada ~3 s, por 4 quadros.
  const cycle = frame % 95;
  const blink = cycle < 2 ? cycle / 2 : cycle < 4 ? 1 - (cycle - 2) / 2 : 0;
  return (
    <svg width={width} height={width * 0.7} viewBox="0 0 200 140" style={{overflow: 'visible', ...style}}>
      <g transform={`rotate(${-15 + flap * 18} 62 96)`}>
        <ellipse cx="44" cy="104" rx="26" ry="9" fill="#2e8a5c" />
      </g>
      <ellipse cx="172" cy="78" rx="27" ry="21" fill="#5cc28d" />
      <path d="M28 94 Q36 28 98 26 Q158 28 164 94 Z" fill="#2a7350" />
      <path d="M28 94 L164 94 Q158 104 98 106 Q36 104 28 94Z" fill="#efd894" />
      <path d="M78 38 L118 38 L132 64 L98 84 L64 64Z" fill="#3f9e6c" />
      <path d="M46 72 L64 64 L98 84 L88 93 L38 92Z" fill="#3f9e6c" opacity=".85" />
      <path d="M132 64 L150 72 L156 92 L108 93 L98 84Z" fill="#3f9e6c" opacity=".85" />
      <path d="M40 56 Q60 40 78 38 L64 64 L46 72Z" fill="#358c5e" />
      <path d="M118 38 Q144 42 150 72 L132 64Z" fill="#358c5e" />
      <Face mood={m} blink={blink} look={look} t={t} />
      <g transform={`rotate(${18 - flap * 28} 124 96)`}>
        <path d="M112 96 Q150 104 168 128 Q140 124 110 104Z" fill="#45ad78" />
      </g>
      <Bubble mood={m} t={t} />
    </svg>
  );
};

// Escolhe o humor pelo tempo: lista de [segundos, humor] em ordem.
export const moodAt = (t: number, steps: [number, Mood][]): Mood => {
  let m = steps[0][1];
  for (const [at, mood] of steps) if (t >= at) m = mood;
  return m;
};
