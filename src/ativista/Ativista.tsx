import React from 'react';
import {useCurrentFrame} from 'remotion';

export type Humor =
  | 'feliz'
  | 'orgulhoso'
  | 'triste'
  | 'assustado'
  | 'chocado'
  | 'aliviado'
  | 'determinado'
  | 'confuso'
  | 'cansado';

export type Item = 'nenhum' | 'saco' | 'muda' | 'placa' | 'celular';

const TINTA = '#1d2433';
const PELE = '#b97a4f';
const PELE_ESCURA = '#9c6440';
const CABELO = '#2a1d17';
const CAMISA = '#2f9e5b';
const CAMISA_ESCURA = '#23784a';
const CALCA = '#2b3a67';

// Escolhe o humor pelo tempo: lista de [segundos, humor] em ordem.
export const humorEm = (t: number, passos: [number, Humor][]): Humor => {
  let h = passos[0][1];
  for (const [em, humor] of passos) if (t >= em) h = humor;
  return h;
};

const Olho: React.FC<{cx: number; cy: number; r: number; pupila: number; olhar: number; aberto: number}> = ({
  cx,
  cy,
  r,
  pupila,
  olhar,
  aberto,
}) => (
  <g transform={`translate(${cx} ${cy}) scale(1 ${Math.max(aberto, 0.08)}) translate(${-cx} ${-cy})`}>
    <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={TINTA} strokeWidth="2.5" />
    <circle cx={cx + olhar * (r - pupila - 1.5)} cy={cy + 1} r={pupila} fill={TINTA} />
    <circle cx={cx + olhar * (r - pupila - 1.5) + pupila * 0.4} cy={cy + 1 - pupila * 0.4} r={pupila * 0.36} fill="#fff" />
  </g>
);

const Rosto: React.FC<{humor: Humor; piscar: number; olhar: number; t: number}> = ({humor, piscar, olhar, t}) => {
  const olhos: [number, number][] = [
    [82, 76],
    [118, 76],
  ];
  const fechados = humor === 'aliviado' || humor === 'orgulhoso';
  const grandes = humor === 'assustado' || humor === 'chocado';
  const r = grandes ? 12.5 : 10.5;
  const pupila = grandes ? 3.6 : 5.4;
  const abertura = humor === 'cansado' ? 0.45 : 1;

  // Sobrancelhas: [esquerda, direita]
  const sob: Record<Humor, [string, string]> = {
    feliz: ['M70 58 q12 -6 22 -1', 'M108 57 q10 -5 22 1'],
    orgulhoso: ['M70 58 q12 -7 22 -2', 'M108 56 q10 -5 22 2'],
    triste: ['M70 60 L92 54', 'M108 54 L130 60'],
    assustado: ['M70 52 q12 -8 22 -2', 'M108 50 q10 -6 22 2'],
    chocado: ['M70 49 q12 -9 22 -2', 'M108 47 q10 -7 22 2'],
    aliviado: ['M70 59 q12 -5 22 0', 'M108 59 q10 -5 22 0'],
    determinado: ['M70 56 L92 62', 'M108 62 L130 56'],
    confuso: ['M70 52 q12 -8 22 0', 'M108 60 L130 60'],
    cansado: ['M70 62 q12 -3 22 1', 'M108 63 q10 -4 22 -1'],
  };

  const boca: Record<Humor, React.ReactNode> = {
    feliz: <path d="M88 98 q12 12 24 0" stroke={TINTA} strokeWidth="3.4" fill="none" strokeLinecap="round" />,
    orgulhoso: <path d="M86 96 q14 16 28 0 Z" fill={TINTA} />,
    triste: <path d="M89 104 q11 -9 22 0" stroke={TINTA} strokeWidth="3.4" fill="none" strokeLinecap="round" />,
    assustado: <ellipse cx="100" cy="101" rx="6" ry="7" fill={TINTA} />,
    chocado: <ellipse cx="100" cy="102" rx="9" ry="11" fill={TINTA} />,
    aliviado: <path d="M88 98 q12 9 24 0" stroke={TINTA} strokeWidth="3.4" fill="none" strokeLinecap="round" />,
    determinado: <path d="M89 101 q11 3 22 -3" stroke={TINTA} strokeWidth="3.6" fill="none" strokeLinecap="round" />,
    confuso: <path d="M88 101 q5 -5 10 0 q5 5 12 -2" stroke={TINTA} strokeWidth="3.4" fill="none" strokeLinecap="round" />,
    cansado: <path d="M90 102 q10 -2 20 0" stroke={TINTA} strokeWidth="3.4" fill="none" strokeLinecap="round" />,
  };

  return (
    <g>
      {(humor === 'feliz' || humor === 'orgulhoso' || humor === 'aliviado') && (
        <>
          <ellipse cx="70" cy="92" rx="8" ry="4.5" fill="#ff8a7a" opacity="0.55" />
          <ellipse cx="130" cy="92" rx="8" ry="4.5" fill="#ff8a7a" opacity="0.55" />
        </>
      )}
      {fechados
        ? olhos.map(([x, y]) => (
            <path key={x} d={`M${x - 9} ${y + 2} q 9 -10 18 0`} stroke={TINTA} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          ))
        : olhos.map(([x, y]) => (
            <Olho key={x} cx={x} cy={y} r={r} pupila={pupila} olhar={olhar} aberto={(1 - piscar) * abertura} />
          ))}
      {humor === 'cansado' &&
        olhos.map(([x, y]) => (
          <path key={'o' + x} d={`M${x - 9} ${y + 13} q 9 5 18 0`} stroke="#7a5a8c" strokeWidth="2.4" fill="none" opacity="0.7" />
        ))}
      <path d={sob[humor][0]} stroke={TINTA} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={sob[humor][1]} stroke={TINTA} strokeWidth="4" fill="none" strokeLinecap="round" />
      {boca[humor]}
      {humor === 'triste' && <path d={`M122 ${86 + ((t * 30) % 16)} q -3.5 6 0 8 q 3.5 -2 0 -8`} fill="#7dd3fc" />}
      {(humor === 'assustado' || humor === 'aliviado' || humor === 'cansado') && (
        <path d="M140 46 q -5 9 0 13 q 5 -4 0 -13" fill="#7dd3fc" stroke="#38bdf8" strokeWidth="1" />
      )}
    </g>
  );
};

const Sinal: React.FC<{humor: Humor; t: number}> = ({humor, t}) => {
  const sobe = Math.sin(t * 6) * 3;
  const estilo = {fontFamily: 'Anton, Impact, sans-serif', textAnchor: 'middle' as const, paintOrder: 'stroke' as const};
  if (humor === 'chocado')
    return (
      <text x="158" y={22 + sobe} fontSize="44" fill="#dc2626" stroke="#fff" strokeWidth="4" {...estilo}>
        !
      </text>
    );
  if (humor === 'confuso')
    return (
      <text x="160" y={22 + sobe} fontSize="42" fill="#ffd23f" stroke={TINTA} strokeWidth="4" {...estilo}>
        ?
      </text>
    );
  if (humor === 'cansado')
    return (
      <text x="158" y={24 + sobe} fontSize="26" fill="#cfe3ff" stroke={TINTA} strokeWidth="3" {...estilo}>
        z z
      </text>
    );
  if (humor === 'orgulhoso')
    return (
      <g transform={`translate(162 ${18 + sobe}) rotate(${t * 90})`}>
        <path d="M0 -13 L4 -4 L13 0 L4 4 L0 13 L-4 4 L-13 0 L-4 -4 Z" fill="#ffd23f" stroke={TINTA} strokeWidth="1.5" />
      </g>
    );
  return null;
};

// Objeto na mão direita, desenhado com a mão na origem.
const Objeto: React.FC<{item: Item; texto: string; t: number}> = ({item, texto, t}) => {
  if (item === 'saco')
    return (
      <g transform={`rotate(${Math.sin(t * 4) * 4})`}>
        <path d="M-6 0 L6 0 L4 10 L-4 10 Z" fill="#14532d" />
        <path d="M-4 10 Q-30 18 -28 52 Q-24 78 0 80 Q24 78 28 52 Q30 18 4 10 Z" fill="#1f2937" />
        <path d="M-14 30 Q-16 52 -8 66" stroke="#4b5563" strokeWidth="3" fill="none" />
        <path d="M10 26 Q14 46 8 64" stroke="#4b5563" strokeWidth="3" fill="none" />
      </g>
    );
  if (item === 'muda')
    return (
      <g transform="translate(0 -6)">
        <path d="M-18 -4 L18 -4 L13 24 L-13 24 Z" fill="#c2613a" />
        <rect x="-20" y="-9" width="40" height="8" rx="3" fill="#a94f2c" />
        <path d="M0 -8 L0 -40" stroke="#2f7d3a" strokeWidth="4" strokeLinecap="round" />
        <path d={`M0 -26 Q-22 ${-36 + Math.sin(t * 3) * 2} -24 -50 Q-6 -46 0 -30 Z`} fill="#4caf50" />
        <path d={`M0 -34 Q20 ${-46 + Math.sin(t * 3 + 1) * 2} 24 -60 Q4 -56 0 -38 Z`} fill="#66bb6a" />
      </g>
    );
  if (item === 'placa')
    return (
      <g>
        <rect x="-4" y="-150" width="8" height="160" rx="3" fill="#8b5a2b" />
        <g transform={`rotate(${Math.sin(t * 2.5) * 3} 0 -150)`}>
          <rect x="-72" y="-214" width="144" height="84" rx="8" fill="#fff8e1" stroke={TINTA} strokeWidth="4" />
          <text x="0" y="-180" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="26" fill="#2f9e5b">
            {texto.split('|')[0]}
          </text>
          <text x="0" y="-148" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="26" fill="#dc2626">
            {texto.split('|')[1] ?? ''}
          </text>
        </g>
      </g>
    );
  if (item === 'celular')
    return (
      <g transform="translate(-4 -30) rotate(-8)">
        <rect x="-14" y="0" width="28" height="48" rx="5" fill={TINTA} />
        <rect x="-11" y="4" width="22" height="36" rx="2" fill="#7dd3fc" />
        <circle cx="0" cy="44" r="2" fill="#4b5563" />
      </g>
    );
  return null;
};

/**
 * Ativista de frente, estilo 2D chapado.
 * braçoE/braçoD: graus que o braço abre para fora (0 = caído, 160 = levantado).
 * passo: fase da caminhada (0 = parado).
 */
export const Ativista: React.FC<{
  width?: number;
  humor?: Humor;
  olhar?: number;
  bracoE?: number;
  bracoD?: number;
  item?: Item;
  placa?: string;
  passo?: number;
  style?: React.CSSProperties;
}> = ({width = 300, humor = 'feliz', olhar = 0, bracoE = 8, bracoD = 8, item = 'nenhum', placa = 'SALVE O|PLANETA', passo = 0, style}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ciclo = frame % 100;
  const piscar = ciclo < 2 ? ciclo / 2 : ciclo < 4 ? 1 - (ciclo - 2) / 2 : 0;
  const perna = Math.sin(passo) * 14;
  const pulo = passo ? Math.abs(Math.sin(passo)) * -4 : 0;
  const ombroE = {x: 66, y: 134};
  const ombroD = {x: 134, y: 134};
  const L = 66;
  const rad = (-bracoD * Math.PI) / 180;
  const maoD = {x: ombroD.x - Math.sin(rad) * L, y: ombroD.y + Math.cos(rad) * L};
  const braco = (o: {x: number; y: number}, ang: number) => (
    <g transform={`rotate(${ang} ${o.x} ${o.y})`}>
      <rect x={o.x - 9} y={o.y - 6} width="18" height={L} rx="9" fill={CAMISA_ESCURA} />
      <rect x={o.x - 8} y={o.y + 26} width="16" height={L - 26} rx="8" fill={PELE} />
      <circle cx={o.x} cy={o.y + L} r="10" fill={PELE} />
    </g>
  );
  return (
    <svg width={width} height={width * 1.6} viewBox="0 0 200 320" style={{overflow: 'visible', ...style}}>
      <ellipse cx="100" cy="304" rx="58" ry="9" fill="rgba(0,0,0,.18)" />
      <g transform={`translate(0 ${pulo})`}>
        <g transform={`rotate(${perna} 86 212)`}>
          <rect x="77" y="206" width="20" height="84" rx="9" fill={CALCA} />
          <ellipse cx="84" cy="292" rx="16" ry="8" fill={TINTA} />
        </g>
        <g transform={`rotate(${-perna} 114 212)`}>
          <rect x="103" y="206" width="20" height="84" rx="9" fill={CALCA} />
          <ellipse cx="116" cy="292" rx="16" ry="8" fill={TINTA} />
        </g>
        {braco(ombroE, bracoE)}
        <rect x="90" y="110" width="20" height="18" fill={PELE_ESCURA} />
        <rect x="62" y="122" width="76" height="94" rx="24" fill={CAMISA} />
        <path d="M100 150 q-14 4 -14 20 q14 0 18 -12 q2 -6 -4 -8 Z" fill="#c8f7d6" />
        <path d="M100 150 l-8 18" stroke={CAMISA_ESCURA} strokeWidth="2.5" />
        {braco(ombroD, -bracoD)}
        <g transform={`translate(${maoD.x} ${maoD.y})`}>
          <Objeto item={item} texto={placa} t={t} />
        </g>
        <circle cx="54" cy="78" r="10" fill={PELE_ESCURA} />
        <circle cx="146" cy="78" r="10" fill={PELE_ESCURA} />
        <circle cx="100" cy="72" r="46" fill={PELE} />
        <path d="M54 72 Q48 22 100 20 Q152 22 146 72 Q140 46 112 44 Q100 54 86 44 Q60 46 54 72 Z" fill={CABELO} />
        {[62, 80, 100, 120, 138].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 26 : 32} r="12" fill={CABELO} />
        ))}
        <Rosto humor={humor} piscar={piscar} olhar={olhar} t={t} />
        <Sinal humor={humor} t={t} />
      </g>
    </svg>
  );
};
