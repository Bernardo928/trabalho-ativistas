import React from 'react';
import {interpolate, random} from 'remotion';
import {Scene, wordTime} from './timeline';
import {Turtle, moodAt} from './Turtle';
import {Dino, Fossil, Meteor, X0, X1, X_EXT} from './mockups/LinhaDoTempo';
import {C, FONT_TITLE, FONT_UI, Fill, Tag, Underwater, fadeIn, usePop, useSeconds} from './ui';

type P = {s: Scene};
// Time of a word relative to the start of the scene.
const at = (s: Scene, word: string) => wordTime(word, s.start) - s.start;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ---------- Mar ao pôr do sol (gancho e final) ---------- */
const HORIZON = 700;

// Repeating wave line that drifts sideways; `fill` paints everything below it.
const WaveLine: React.FC<{
  y: number;
  amp: number;
  len: number;
  speed: number;
  color: string;
  width?: number;
  fill?: boolean;
}> = ({y, amp, len, speed, color, width = 5, fill = false}) => {
  const t = useSeconds();
  const off = (t * speed) % len;
  let d = `M ${-2 * len} ${y}`;
  for (let x = -2 * len; x < 1080 + 2 * len; x += len) {
    d += ` q ${len / 4} ${-amp} ${len / 2} 0 q ${len / 4} ${amp} ${len / 2} 0`;
  }
  if (fill) d += ` V 1920 H ${-2 * len} Z`;
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', top: 0, left: 0}}>
      <path
        d={d}
        transform={`translate(${-off} 0)`}
        fill={fill ? color : 'none'}
        stroke={fill ? 'none' : color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    </svg>
  );
};

const SeaScene: React.FC<{children?: React.ReactNode; front?: React.ReactNode}> = ({children, front}) => {
  const t = useSeconds();
  return (
    <Fill style={{background: 'linear-gradient(#ffd08a, #ff9a6e 45%, #d9708a)'}}>
      <div style={{position: 'absolute', left: 540 - 200, top: HORIZON - 230, width: 400, height: 400, borderRadius: '50%', background: '#ffe7a3', boxShadow: '0 0 120px 40px rgba(255,231,163,.45)'}} />
      <div style={{position: 'absolute', top: HORIZON, left: 0, right: 0, bottom: 0, background: 'linear-gradient(#45aede, #1a7fb6 22%, #0d5688 55%, #062f4f)'}} />
      {/* Reflexo do sol na água */}
      {new Array(9).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: HORIZON + 14 + i * 30,
            left: 540 - (190 - i * 16) / 2 + Math.sin(t * 2.4 + i * 1.7) * 18,
            width: 190 - i * 16,
            height: 9,
            borderRadius: 6,
            background: '#ffe7a3',
            opacity: 0.85 - i * 0.07 + Math.sin(t * 5 + i) * 0.1,
          }}
        />
      ))}
      <WaveLine y={HORIZON + 50} amp={5} len={120} speed={30} color="rgba(255,255,255,.35)" width={3} />
      <WaveLine y={HORIZON + 130} amp={9} len={190} speed={-40} color="rgba(255,255,255,.3)" width={4} />
      <WaveLine y={HORIZON + 250} amp={14} len={280} speed={50} color="rgba(255,255,255,.28)" width={5} />
      {children}
      {/* Água na frente da personagem: deixa a tartaruga "dentro" do mar */}
      <WaveLine y={HORIZON + 210} amp={18} len={320} speed={-35} color="rgba(6,60,100,.32)" fill />
      <WaveLine y={HORIZON + 212} amp={18} len={320} speed={-35} color="rgba(255,255,255,.45)" width={6} />
      <WaveLine y={HORIZON + 470} amp={24} len={420} speed={60} color="rgba(255,255,255,.22)" width={7} />
      <WaveLine y={HORIZON + 760} amp={30} len={520} speed={-50} color="rgba(255,255,255,.18)" width={8} />
      {front}
    </Fill>
  );
};

// Bubbles trailing behind a swimmer.
const Trail: React.FC<{x: number; y: number}> = ({x, y}) => {
  const t = useSeconds();
  return (
    <>
      {new Array(7).fill(0).map((_, i) => {
        const k = (t * 1.2 + i / 7) % 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - k * 160 + Math.sin(i * 3) * 20,
              top: y - k * 120,
              width: 14 + (i % 3) * 8,
              height: 14 + (i % 3) * 8,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,.6)',
              opacity: 1 - k,
            }}
          />
        );
      })}
    </>
  );
};

/* ---------- 1. Gancho ---------- */
export const Hook: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const pop = usePop(0.1);
  const stamp = usePop(at(s, 'impossivel'), 9);
  const tx = 230 + Math.sin(t * 1.1) * 40;
  const ty = 880 + Math.sin(t * 2) * 16;
  return (
    <SeaScene>
      <Trail x={tx + 40} y={ty + 150} />
      <Turtle
        width={560}
        flap={Math.sin(t * 5)}
        mood={moodAt(t, [[0, 'feliz'], [at(s, 'descobrir'), 'confusa'], [at(s, 'impossivel'), 'assustada']])}
        style={{position: 'absolute', left: tx, top: ty, transform: `rotate(${Math.sin(t * 2) * 3}deg)`}}
      />
      <div style={{position: 'absolute', top: 230, width: '100%', textAlign: 'center', transform: `scale(${pop})`}}>
        <Tag bg={C.ink} size={40}>
          1 dia · 24 horas
        </Tag>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 340,
          width: '100%',
          textAlign: 'center',
          opacity: stamp,
          transform: `scale(${1.25 - stamp * 0.25}) rotate(-3deg)`,
        }}
      >
        <Tag bg={C.red} size={36}>
          Chance de sobreviver: quase zero
        </Tag>
      </div>
    </SeaScene>
  );
};

/* ---------- Praia à noite (cenas 2 e 3) ---------- */
const NightBeach: React.FC<{lamps: number; children?: React.ReactNode}> = ({lamps, children}) => {
  const t = useSeconds();
  return (
    <Fill style={{background: `linear-gradient(${C.night1}, ${C.night2} 40%)`}}>
      {new Array(40).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: random(`sx${i}`) * 1080,
            top: random(`sy${i}`) * 520,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#fff',
            opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)),
          }}
        />
      ))}
      <div style={{position: 'absolute', right: 120, top: 300, width: 170, height: 170, borderRadius: '50%', background: '#f4f1d0', boxShadow: '0 0 90px 20px rgba(244,241,208,.35)'}} />
      <div style={{position: 'absolute', top: 560, left: 0, right: 0, height: 360, background: 'linear-gradient(#1b4f86, #123a63)'}} />
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 590 + i * 58,
            left: 790 - i * 10 + Math.sin(t * 3 + i) * 14,
            width: 140 - i * 14,
            height: 10,
            borderRadius: 6,
            background: 'rgba(244,241,208,.7)',
          }}
        />
      ))}
      <div style={{position: 'absolute', top: 900, left: 0, right: 0, bottom: 0, background: `linear-gradient(${C.sand}, ${C.sandDark})`}} />
      <svg width="1080" height="60" style={{position: 'absolute', top: 880}}>
        <path d={`M0 30 Q 135 ${10 + Math.sin(t * 2) * 10} 270 30 T 540 30 T 810 30 T 1080 30 V60 H0Z`} fill="#e9f4ff" opacity=".8" />
      </svg>
      {/* Postes da orla: acendem com intensidade `lamps` */}
      {[0, 1].map((i) => (
        <div key={i} style={{position: 'absolute', left: 40 + i * 190, top: 640 + i * 60, opacity: lamps}}>
          <div style={{position: 'absolute', left: -170, top: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(rgba(255,214,102,.75), rgba(255,214,102,0) 65%)'}} />
          <div style={{position: 'absolute', left: 20, top: 40, width: 18, height: 560 - i * 60, background: '#3b4252'}} />
          <div style={{position: 'absolute', left: -6, top: 10, width: 70, height: 36, borderRadius: 10, background: '#ffe08a', boxShadow: '0 0 60px 20px rgba(255,224,138,.8)'}} />
        </div>
      ))}
      {children}
    </Fill>
  );
};

// Filhote visto de cima, cabeça para cima. `phase` anima as nadadeiras.
const HatchTop: React.FC<{phase: number}> = ({phase}) => {
  const a = Math.sin(phase) * 28;
  return (
    <svg width="76" height="96" viewBox="0 0 76 96" style={{overflow: 'visible'}}>
      <g transform={`rotate(${-35 - a} 22 36)`}>
        <ellipse cx="8" cy="36" rx="17" ry="6.5" fill="#2e8a5c" />
      </g>
      <g transform={`rotate(${35 - a} 54 36)`}>
        <ellipse cx="68" cy="36" rx="17" ry="6.5" fill="#2e8a5c" />
      </g>
      <g transform={`rotate(${25 + a * 0.6} 26 70)`}>
        <ellipse cx="18" cy="76" rx="9" ry="5" fill="#2e8a5c" />
      </g>
      <g transform={`rotate(${-25 + a * 0.6} 50 70)`}>
        <ellipse cx="58" cy="76" rx="9" ry="5" fill="#2e8a5c" />
      </g>
      <ellipse cx="38" cy="15" rx="10" ry="11" fill="#5cc28d" />
      <circle cx="33" cy="11" r="2.4" fill="#10243a" />
      <circle cx="43" cy="11" r="2.4" fill="#10243a" />
      <ellipse cx="38" cy="52" rx="20" ry="26" fill="#2a7350" />
      <ellipse cx="38" cy="52" rx="13" ry="18" fill="#3f9e6c" />
      <path d="M38 34 V70 M27 44 L49 44 M27 60 L49 60" stroke="#2a7350" strokeWidth="2.5" />
    </svg>
  );
};

// Caminhada de cada filhote, calculada pelo tempo global da narração para
// continuar igual entre a cena do ninho e a cena dos postes.
const HATCH = 12;
const WATERLINE = 905;
const LAMP = {x: 130, y: 1000};
const T_BORN = wordTime('nasce');
const T_GO = wordTime('missao');
const T_TURN = wordTime('muitos');

type HatchState = {x: number; y: number; ang: number; opacity: number; phase: number; path: [number, number][]};

const hatchAt = (i: number, T: number): HatchState => {
  const r = (k: string) => random(`h${i}${k}`);
  const x0 = 400 + r('x') * 270;
  const y0 = 1100 + r('y') * 80;
  const tx = x0 + (r('tx') - 0.5) * 300;
  const L0 = Math.hypot(tx - x0, WATERLINE - y0);
  const dx = (tx - x0) / L0;
  const dy = (WATERLINE - y0) / L0;
  const v = 22 + r('v') * 14;
  const go = T_GO + r('g') * 0.9;
  const lost = i % 4 !== 0;
  const walked = (until: number) => v * Math.max(0, until - go);
  const appear = Math.min(1, Math.max(0, (T - T_BORN - i * 0.16) / 0.45));
  let x = x0 + dx * walked(T);
  let y = y0 + dy * walked(T);
  let ang = Math.atan2(dx, -dy);
  let moving = T > go;
  const path: [number, number][] = [[x0, y0]];
  if (lost && T > T_TURN) {
    const xt = x0 + dx * walked(T_TURN);
    const yt = y0 + dy * walked(T_TURN);
    const lx = LAMP.x + (r('lx') - 0.5) * 160;
    const ly = LAMP.y + (r('ly') - 0.3) * 160;
    const L = Math.hypot(lx - xt, ly - yt);
    const d = Math.min(L, (60 + r('lv') * 30) * (T - T_TURN));
    x = xt + ((lx - xt) / L) * d;
    y = yt + ((ly - yt) / L) * d;
    const target = Math.atan2((lx - xt) / L, -(ly - yt) / L);
    const k = Math.min(1, (T - T_TURN) / 0.7);
    ang = ang + (target - ang) * k;
    moving = d < L;
    path.push([xt, yt]);
  }
  path.push([x, y]);
  // Quem chega na água some aos poucos nas ondas.
  const sea = Math.min(1, Math.max(0, (y - WATERLINE) / 40));
  return {x, y: y + (1 - appear) * 30, ang, opacity: appear * sea, phase: moving ? T * 13 + i * 1.3 : 0, path};
};

const Hatchlings: React.FC<{s: Scene}> = ({s}) => {
  const t = useSeconds();
  const T = s.start + t;
  const all = new Array(HATCH).fill(0).map((_, i) => hatchAt(i, T));
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute', top: 0, left: 0}}>
        {all.map((h, i) => (
          <polyline
            key={i}
            points={h.path.map(([px, py]) => `${px + 38},${py + 60}`).join(' ')}
            fill="none"
            stroke="rgba(150,105,45,.45)"
            strokeWidth="10"
            strokeDasharray="4 12"
            strokeLinecap="round"
            opacity={Math.min(1, h.opacity * 2)}
          />
        ))}
      </svg>
      {all.map((h, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: h.x,
            top: h.y,
            opacity: h.opacity,
            transform: `rotate(${(h.ang * 180) / Math.PI + Math.sin(h.phase) * 6}deg)`,
            transformOrigin: '38px 48px',
            scale: '1.3',
          }}
        >
          <HatchTop phase={h.phase} />
        </div>
      ))}
    </>
  );
};

export const Ninho: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const moon = fadeIn(t, at(s, 'lua'));
  return (
    <NightBeach lamps={0}>
      <div style={{position: 'absolute', left: 390, top: 1150, width: 340, height: 110, borderRadius: '50%', background: C.sandDark}} />
      <Hatchlings s={s} />
      <div style={{position: 'absolute', top: 430, right: 60, opacity: moon, transform: `translateY(${(1 - moon) * 20}px)`}}>
        <Tag bg="#f4f1d0" color={C.ink} size={36}>
          Guia: luz da lua
        </Tag>
      </div>
    </NightBeach>
  );
};

export const Luzes: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const lamps = fadeIn(t, at(s, 'luz'), 0.25);
  const label = usePop(at(s, 'postes'));
  return (
    <NightBeach lamps={lamps}>
      <div style={{position: 'absolute', left: 390, top: 1150, width: 340, height: 110, borderRadius: '50%', background: C.sandDark}} />
      <Hatchlings s={s} />
      <div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', transform: `scale(${label})`}}>
        <Tag bg={C.red} size={44}>
          ✕ Luz artificial confunde
        </Tag>
      </div>
    </NightBeach>
  );
};

/* ---------- 4. Um em mil ---------- */
export const Mar: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const grid = fadeIn(t, at(s, 'mil'));
  const one = fadeIn(t, at(s, 'uma') - 0.1, 0.6);
  const cols = 40;
  const rows = 25;
  return (
    <Underwater>
      <Turtle
        width={420}
        flap={Math.sin(t * 6)}
        mood={moodAt(t, [[0, 'determinada'], [at(s, 'parabens'), 'orgulhosa'], [at(s, 'mil'), 'confusa'], [at(s, 'so'), 'assustada']])}
        style={{position: 'absolute', top: 1010 + Math.sin(t * 2) * 10, left: interpolate(t, [0, 2], [-400, 340], clamp)}}
      />
      <div style={{position: 'absolute', top: 300, left: 90, width: 900, opacity: grid}}>
        <div style={{textAlign: 'center', marginBottom: 24}}>
          <Tag bg={C.ink} size={40}>
            {one > 0.5 ? '1 chega à vida adulta' : '1.000 filhotes'}
          </Tag>
        </div>
        <svg width={900} height={560} viewBox={`0 0 ${cols * 22} ${rows * 22}`}>
          {new Array(cols * rows).fill(0).map((_, i) => {
            const hero = i === 517;
            const shown = (i / (cols * rows)) < grid * 1.2;
            return (
              <circle
                key={i}
                cx={(i % cols) * 22 + 11}
                cy={Math.floor(i / cols) * 22 + 11}
                r={hero ? 6 + one * 10 : 6}
                fill={hero ? (one > 0 ? C.yellow : '#9be7c4') : '#9be7c4'}
                opacity={shown ? (hero ? 1 : 1 - one * 0.8) : 0}
              />
            );
          })}
        </svg>
      </div>
    </Underwater>
  );
};

/* ---------- 5. Sacola ---------- */
const Jellyfish: React.FC<{t: number}> = ({t}) => (
  <svg width="260" height="360" viewBox="0 0 130 180">
    <path d="M10 70 Q65 -20 120 70 Z" fill="#f7a6d4" />
    {[25, 45, 65, 85, 105].map((x, i) => (
      <path key={i} d={`M${x} 70 q ${Math.sin(t * 3 + i) * 10} 50 0 100`} stroke="#f7a6d4" strokeWidth="6" fill="none" strokeLinecap="round" />
    ))}
  </svg>
);

// Sacola de supermercado boiando: translúcida, com alças, dobras e borda ondulando.
const Bag: React.FC<{t: number}> = ({t}) => {
  const w = Math.sin(t * 2.2) * 6;
  const v = Math.cos(t * 1.7) * 5;
  return (
    <svg width="300" height="400" viewBox="0 0 150 200" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="bagFill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="0.6" stopColor="#e3f1f8" stopOpacity="0.78" />
          <stop offset="1" stopColor="#b9d9ea" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d={`M32 56 C ${20 + v} 8, ${62 + v} 2, 58 54`} stroke="url(#bagFill)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d={`M92 54 C ${88 - v} 2, ${132 - v} 8, 118 56`} stroke="url(#bagFill)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path
        d={`M24 52 Q75 66 126 52 Q ${136 + w} 100 ${130 + w} 150
            Q ${118} ${176 + w} 102 168 Q 90 ${190 - w} 76 176
            Q 60 ${192 + w} 48 172 Q 28 ${182 - w} ${20 - w} 150 Q ${12 - w} 100 24 52 Z`}
        fill="url(#bagFill)"
        stroke="#a9cbe0"
        strokeWidth="2.5"
      />
      <path d={`M46 66 Q ${40 + w} 112 50 164`} stroke="#a9cbe0" strokeWidth="3" fill="none" opacity="0.8" />
      <path d={`M77 70 Q ${85 - w} 118 76 172`} stroke="#a9cbe0" strokeWidth="3" fill="none" opacity="0.8" />
      <path d={`M106 66 Q ${100 + w} 110 110 160`} stroke="#a9cbe0" strokeWidth="3" fill="none" opacity="0.8" />
      <path d="M34 74 Q 28 106 36 138" stroke="#ffffff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
      <rect x="56" y="98" width="42" height="26" rx="6" fill="none" stroke="#e05a5a" strokeWidth="4" opacity="0.5" />
      <path d="M62 111 H92" stroke="#e05a5a" strokeWidth="4" opacity="0.5" />
    </svg>
  );
};

export const Plastico: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const bite = at(s, 'morde');
  const reveal = fadeIn(t, at(s, 'nao'), 0.3);
  const lunge = interpolate(t, [bite - 0.3, bite, bite + 0.4], [0, 1, 0.6], clamp);
  const label = usePop(at(s, 'sacola'));
  return (
    <Underwater>
      <div style={{position: 'absolute', left: 620, top: 520 + Math.sin(t * 2) * 25}}>
        <div style={{position: 'absolute', opacity: 1 - reveal}}>
          <Jellyfish t={t} />
        </div>
        <div style={{position: 'absolute', opacity: reveal, transform: `scale(${0.9 + reveal * 0.1}) rotate(${Math.sin(t * 1.5) * 4}deg)`}}>
          <Bag t={t} />
        </div>
      </div>
      <Turtle
        width={460}
        mood={moodAt(t, [[0, 'feliz'], [at(s, 'fome'), 'determinada'], [bite, 'mastigando'], [at(s, 'nao'), 'chocada'], [at(s, 'sacola'), 'triste']])}
        look={0.7}
        flap={Math.sin(t * 5)}
        style={{position: 'absolute', left: 60 + lunge * 220, top: 640 - lunge * 60}}
      />
      <div style={{position: 'absolute', top: 330, width: '100%', textAlign: 'center', transform: `scale(${label})`}}>
        <Tag bg={C.red} size={44}>
          ✕ Sacola ≠ água-viva
        </Tag>
      </div>
    </Underwater>
  );
};

/* ---------- 6. Rede ---------- */
export const Rede: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const net = fadeIn(t, at(s, 'rede'), 0.5);
  const stuck = at(s, 'presa');
  const escape = at(s, 'escapa');
  const rise = interpolate(t, [0, at(s, 'rede')], [1000, 760], clamp);
  const free = interpolate(t, [escape, escape + 1.1], [0, 1], clamp);
  const shake = t > stuck && t < escape ? Math.sin(t * 50) * 10 : 0;
  const air = usePop(at(s, 'sim'));
  return (
    <Underwater tint="#1593c2">
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 250, background: 'linear-gradient(#bfe9ff, #5cc4ef)'}} />
      <svg width="1080" height="80" style={{position: 'absolute', top: 220}}>
        <path d={`M0 30 Q 135 ${10 + Math.sin(t * 2) * 12} 270 30 T 540 30 T 810 30 T 1080 30 V0 H0Z`} fill="#5cc4ef" />
      </svg>
      <div style={{position: 'absolute', top: 330, width: '100%', textAlign: 'center', transform: `scale(${air})`}}>
        <Tag bg={C.ink} size={40}>
          Tartaruga respira ar
        </Tag>
      </div>
      <Turtle
        width={420}
        mood={moodAt(t, [[0, 'determinada'], [at(s, 'sim'), 'feliz'], [at(s, 'rede'), 'assustada'], [escape, 'aliviada']])}
        flap={Math.sin(t * (t > stuck && t < escape ? 16 : 6))}
        style={{
          position: 'absolute',
          left: 330 + shake + free * 260,
          top: rise - free * 330,
          transform: `rotate(${-free * 15}deg)`,
        }}
      />
      <svg width="1080" height="700" style={{position: 'absolute', top: 560, opacity: net * (1 - free * 0.4)}}>
        {new Array(16).fill(0).map((_, i) => (
          <g key={i} stroke="#d9d2c3" strokeWidth="4">
            <line x1={-300 + i * 90} y1={0} x2={i * 90 + 200} y2={700} />
            <line x1={i * 90 + 200} y1={0} x2={-300 + i * 90} y2={700} />
          </g>
        ))}
      </svg>
      <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', opacity: net}}>
        <Tag bg={C.red} size={44}>
          ✕ Rede de pesca
        </Tag>
      </div>
    </Underwater>
  );
};

/* ---------- 7. Linha do tempo ---------- */
// Cada barra é uma pista: o personagem anda na ponta e a barra cresce atrás dele.
const LANE_DINO = 380;
const LANE_TURTLE = 720;

const Track: React.FC<{top: number; label: string; color: string; tip: number; show: number}> = ({top, label, color, tip, show}) => (
  <div style={{position: 'absolute', top, left: 0, width: 1080, height: 300, opacity: show}}>
    <div style={{position: 'absolute', left: X0, top: 0, fontFamily: FONT_UI, fontWeight: 800, fontSize: 38, color: '#e2ecff'}}>{label}</div>
    <div style={{position: 'absolute', left: X0, top: 210, width: X1 - X0, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.1)'}} />
    <div style={{position: 'absolute', left: X0, top: 210, width: Math.max(30, tip - X0), height: 30, borderRadius: 15, background: color}} />
  </div>
);

export const Dinos: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const tSua = at(s, 'sua');
  const tDino = at(s, 'dinossauros');
  const tImpact = tDino + 0.3;
  const tAnos = at(s, 'anos');
  const tPerigo = at(s, 'perigo');
  const tCoisas = at(s, 'coisas');
  const show = fadeIn(t, 0, 0.5);

  const dinoTip = interpolate(t, [tSua - 0.8, tImpact], [X0 + 175, X_EXT], clamp);
  const turtleTip = interpolate(t, [tSua - 0.8, tAnos], [X0 + 200, X1], clamp);
  const dinoWalking = t < tImpact;
  const turtleWalking = t < tAnos;
  const meteor = interpolate(t, [tDino - 0.35, tImpact], [0, 1], clamp);
  const fossil = fadeIn(t, tImpact, 0.25);
  const flash = t < tImpact ? 0 : interpolate(t, [tImpact, tImpact + 0.5], [1, 0], clamp);
  const extinct = usePop(tImpact + 0.1, 9);
  const stillHere = usePop(tAnos, 9);
  const items = usePop(tCoisas);
  const mood = moodAt(t, [
    [0, 'determinada'],
    [tImpact - 0.1, 'chocada'],
    [tImpact + 0.9, 'determinada'],
    [tAnos, 'orgulhosa'],
    [tPerigo, 'assustada'],
    [tCoisas, 'triste'],
  ]);
  const step = (on: boolean, speed: number) => (on ? Math.abs(Math.sin(t * speed)) * -8 : 0);

  return (
    <Fill style={{background: 'linear-gradient(#141e36, #1d2b4a 55%, #241f45)'}}>
      {new Array(30).fill(0).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: (i * 197) % 1080, top: (i * 131) % 1800, width: 4, height: 4, borderRadius: '50%', background: '#fff', opacity: 0.25 + 0.2 * Math.sin(t * 2 + i)}} />
      ))}
      <div style={{position: 'absolute', top: 270, width: '100%', textAlign: 'center', opacity: show}}>
        <Tag bg="#1f2a3d" color="#7ee2a8" size={36} style={{border: '3px solid #7ee2a8', boxShadow: 'none'}}>
          Linha do tempo
        </Tag>
      </div>

      <div style={{position: 'absolute', left: X_EXT - 2, top: 440, height: 210, borderLeft: '4px dashed rgba(251,146,60,.6)', opacity: fossil}} />
      <div style={{position: 'absolute', left: X_EXT - 2, top: 790, height: 280, borderLeft: '4px dashed rgba(251,146,60,.6)', opacity: fossil}} />

      {/* Pista dos dinossauros */}
      <Track top={LANE_DINO} label="Dinossauros" color="#f59e0b" tip={dinoTip} show={show} />
      <div style={{position: 'absolute', left: X0 - 10, top: LANE_DINO + 100, opacity: 0.3 * Math.min(1, (dinoTip - X0 - 175) / 120)}}>
        <Dino width={150} />
      </div>
      <div style={{position: 'absolute', left: dinoTip - 200, top: LANE_DINO + 64 + step(dinoWalking, 9), opacity: show * (1 - fossil)}}>
        <Dino width={200} />
      </div>
      <div style={{position: 'absolute', left: X_EXT - 225, top: LANE_DINO + 100, opacity: fossil}}>
        <Fossil width={230} />
      </div>
      {meteor > 0 && meteor < 1 && (
        <div style={{position: 'absolute', left: X_EXT - 30 + (1 - meteor) * 520, top: LANE_DINO + 70 - (1 - meteor) * 420}}>
          <Meteor />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: X_EXT - 160,
          top: LANE_DINO + 30,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(rgba(255,214,102,.9), rgba(251,146,60,.4) 45%, rgba(251,146,60,0) 70%)',
          opacity: flash,
          transform: `scale(${0.4 + (1 - flash) * 0.9})`,
        }}
      />
      <div style={{position: 'absolute', left: X_EXT + 24, top: LANE_DINO + 196, transform: `scale(${extinct})`, transformOrigin: 'left center'}}>
        <Tag bg={C.red} size={32}>
          ✕ Extintos
        </Tag>
      </div>

      {/* Pista das tartarugas */}
      <Track top={LANE_TURTLE} label="Tartarugas marinhas" color={C.green} tip={turtleTip} show={show} />
      <div style={{position: 'absolute', left: X0 + 40, top: LANE_TURTLE + 110, opacity: 0.25 * Math.min(1, (turtleTip - X0 - 200) / 120)}}>
        <Turtle width={150} flap={-0.4} mood="feliz" />
      </div>
      {turtleWalking &&
        [0, 1, 2].map((i) => {
          const k = (t * 2 + i / 3) % 1;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: turtleTip - 230 - k * 120,
                top: LANE_TURTLE + 186 - k * 20,
                width: 26 - k * 14,
                height: 26 - k * 14,
                borderRadius: '50%',
                background: 'rgba(255,255,255,.4)',
                opacity: 1 - k,
              }}
            />
          );
        })}
      <div style={{position: 'absolute', left: turtleTip - 220, top: LANE_TURTLE + 66 + step(turtleWalking, 8), opacity: show}}>
        <Turtle width={210} flap={turtleWalking ? Math.sin(t * 8) : 0.3} mood={mood} look={mood === 'chocada' ? -0.8 : 0.4} />
      </div>
      <div style={{position: 'absolute', right: 1080 - X1, top: LANE_TURTLE + 256, transform: `scale(${stillHere})`, transformOrigin: 'right center'}}>
        <Tag bg={C.greenDark} size={32}>
          ✓ Ainda aqui
        </Tag>
      </div>

      {/* Eixo do tempo */}
      <div style={{opacity: show}}>
        <div style={{position: 'absolute', top: 1070, left: X0, width: X1 - X0, height: 4, background: '#8aa0bf'}} />
        {[
          {x: X0, label: '110 mi anos atrás', align: 'left' as const, left: X0},
          {x: X_EXT, label: '66 mi', align: 'center' as const, left: X_EXT - 150},
          {x: X1, label: 'hoje', align: 'right' as const, left: X1 - 300},
        ].map((m) => (
          <div key={m.label}>
            <div style={{position: 'absolute', left: m.x - 2, top: 1058, width: 4, height: 28, background: '#8aa0bf'}} />
            <div style={{position: 'absolute', top: 1096, left: m.left, width: 300, textAlign: m.align, fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, color: '#cfe3ff'}}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', top: 1170, width: '100%', display: 'flex', justifyContent: 'center', gap: 22, transform: `scale(${items})`}}>
        {['Sacola', 'Canudo', 'Rede'].map((x) => (
          <Tag key={x} bg={C.red} size={34}>
            {x}
          </Tag>
        ))}
      </div>
    </Fill>
  );
};

/* ---------- 8. Solução ---------- */
const Card: React.FC<{text: string; p: number}> = ({text, p}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      background: C.white,
      borderRadius: 30,
      padding: '28px 34px',
      marginBottom: 26,
      boxShadow: '0 12px 0 rgba(13,27,42,.12)',
      opacity: p,
      transform: `translateX(${(1 - p) * 120}px)`,
    }}
  >
    <div style={{width: 64, height: 64, borderRadius: 20, background: C.greenDark, color: C.white, fontFamily: FONT_UI, fontWeight: 800, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      ✓
    </div>
    <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 46, color: C.ink}}>{text}</div>
  </div>
);

export const Solucao: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const a = usePop(at(s, 'apagar'));
  const b = usePop(at(s, 'recusar'));
  const c = usePop(at(s, 'deixar') - 0.15);
  const tamarAt = at(s, 'projeto');
  const tamar = usePop(tamarAt);
  const n = Math.round(interpolate(t, [tamarAt, at(s, 'milhoes') + 0.2], [0, 40], clamp));
  const head = usePop(0.1);
  return (
    <Fill style={{background: 'linear-gradient(#dff7ee, #b8ead7)'}}>
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', transform: `scale(${head})`}}>
        <Tag bg={C.greenDark} size={44}>
          A boa notícia
        </Tag>
      </div>
      <div style={{position: 'absolute', top: 430, left: 70, right: 70}}>
        <Card text="Apagar luzes perto da praia" p={a} />
        <Card text="Recusar sacola e canudo" p={b} />
        <Card text="Não deixar lixo na areia" p={c} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 980,
          left: 140,
          right: 140,
          background: C.ink,
          borderRadius: 34,
          padding: '28px 30px',
          textAlign: 'center',
          opacity: tamar,
          transform: `scale(${0.8 + tamar * 0.2})`,
        }}
      >
        <div style={{fontFamily: FONT_TITLE, fontSize: 120, color: C.yellow, lineHeight: 1}}>+{n} MILHÕES</div>
        <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 36, color: C.white, marginTop: 10}}>
          de filhotes no mar · Projeto Tamar
        </div>
      </div>
    </Fill>
  );
};

/* ---------- 9. Final ---------- */
export const Fim: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const q = usePop(at(s, 'que'));
  const tx = interpolate(t, [0, 5], [120, 420], clamp);
  const ty = 880 + Math.sin(t * 2) * 15;
  return (
    <SeaScene>
      <Trail x={tx + 40} y={ty + 140} />
      <Turtle
        width={500}
        flap={Math.sin(t * 5)}
        mood={moodAt(t, [[0, 'aliviada'], [at(s, 'acorda'), 'feliz'], [at(s, 'que'), 'confusa']])}
        style={{position: 'absolute', left: tx, top: ty}}
      />
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', transform: `scale(${q})`}}>
        <Tag bg={C.yellow} color={C.ink} size={48}>
          Comenta aqui ↓
        </Tag>
      </div>
    </SeaScene>
  );
};

/* ---------- 10. Créditos ---------- */
const NOMES = ['Bernardo Gomes', 'Gustavo', 'Bernardo Santana', 'Davi', 'Vinícius'];

export const Creditos: React.FC<P> = () => {
  const t = useSeconds();
  const title = usePop(0.15);
  return (
    <Underwater tint="#0b4f7d">
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', transform: `scale(${title})`}}>
        <div style={{fontFamily: FONT_TITLE, fontSize: 130, color: C.yellow, letterSpacing: 4, WebkitTextStroke: '12px #0d1b2a', paintOrder: 'stroke fill'}}>
          CRÉDITOS
        </div>
        <div style={{fontFamily: FONT_UI, fontWeight: 600, fontSize: 40, color: '#d7ecfa', marginTop: 6}}>Trabalho em grupo</div>
      </div>
      <div style={{position: 'absolute', top: 600, width: '100%', textAlign: 'center'}}>
        {NOMES.map((n, i) => {
          const p = fadeIn(t, 0.5 + i * 0.3, 0.4);
          return (
            <div
              key={n}
              style={{
                fontFamily: FONT_UI,
                fontWeight: 800,
                fontSize: 68,
                color: C.white,
                lineHeight: 1.6,
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px)`,
                textShadow: '0 6px 0 rgba(0,0,0,.3)',
              }}
            >
              {n}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1260, width: '100%', textAlign: 'center', opacity: fadeIn(t, 2.2), fontFamily: FONT_UI, fontWeight: 600, fontSize: 34, color: '#d7ecfa', lineHeight: 1.5}}>
        Narração: ElevenLabs (voz Gabriel)
        <br />
        Dados: Projeto Tamar
      </div>
      <Turtle
        width={260}
        flap={Math.sin(t * 6)}
        style={{position: 'absolute', top: 1420 + Math.sin(t * 2) * 10, left: interpolate(t, [0, 6], [-280, 1100])}}
      />
    </Underwater>
  );
};
