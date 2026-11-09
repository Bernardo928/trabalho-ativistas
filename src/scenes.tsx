import React from 'react';
import {interpolate, random} from 'remotion';
import {Scene, wordTime} from './timeline';
import {Turtle} from './Turtle';
import {C, FONT_TITLE, FONT_UI, Fill, Tag, Underwater, fadeIn, usePop, useSeconds} from './ui';

type P = {s: Scene};
// Time of a word relative to the start of the scene.
const at = (s: Scene, word: string) => wordTime(word, s.start) - s.start;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ---------- 1. Gancho ---------- */
export const Hook: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const pop = usePop(0.1);
  const stamp = usePop(at(s, 'impossivel'), 9);
  return (
    <Fill style={{background: 'linear-gradient(#ffb66b, #ff7e6b 30%, #2a7fb8 46%, #0b3c63)'}}>
      <div style={{position: 'absolute', left: 540 - 170, top: 520, width: 340, height: 340, borderRadius: '50%', background: '#ffe39a'}} />
      <div style={{position: 'absolute', top: 870, left: 0, right: 0, bottom: 0, background: 'linear-gradient(#1f8ac2, #08385b)'}} />
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', transform: `scale(${pop})`}}>
        <Tag bg={C.ink} size={44}>
          1 dia · 24 horas
        </Tag>
      </div>
      <Turtle
        width={700}
        flap={Math.sin(t * 5)}
        style={{position: 'absolute', left: 190 + Math.sin(t * 1.3) * 30, top: 640 + Math.sin(t * 2) * 18}}
      />
      <div
        style={{
          position: 'absolute',
          top: 1450,
          width: '100%',
          textAlign: 'center',
          opacity: stamp,
          transform: `scale(${1.6 - stamp * 0.6}) rotate(-4deg)`,
        }}
      >
        <Tag bg={C.red} size={56}>
          Chance de sobreviver: quase zero
        </Tag>
      </div>
    </Fill>
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

const Hatchling: React.FC<{x: number; y: number; dir: number; t: number; i: number}> = ({x, y, dir, t, i}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scaleX(${dir}) rotate(${Math.sin(t * 14 + i) * 6}deg)`}}>
    <Turtle width={110} flap={Math.sin(t * 14 + i)} />
  </div>
);

const NEST = {x: 520, y: 1120};
const HATCH = 9;

export const Ninho: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const born = at(s, 'nasce');
  const go = at(s, 'missao');
  const moon = fadeIn(t, at(s, 'lua'));
  return (
    <NightBeach lamps={0}>
      <div style={{position: 'absolute', left: NEST.x - 140, top: NEST.y + 40, width: 360, height: 110, borderRadius: '50%', background: C.sandDark}} />
      {new Array(HATCH).fill(0).map((_, i) => {
        const appear = fadeIn(t, born + i * 0.2);
        const walk = Math.max(0, t - go - i * 0.12);
        const x = NEST.x - 120 + (i % 3) * 90 + walk * (i % 2 ? 14 : -10);
        const y = NEST.y + 30 - Math.floor(i / 3) * 40 - appear * 60 - walk * 32;
        return (
          <div key={i} style={{opacity: appear}}>
            <Hatchling x={x} y={Math.max(y, 860)} dir={1} t={t} i={i} />
          </div>
        );
      })}
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
  const turn = at(s, 'muitos');
  const label = usePop(at(s, 'postes'));
  return (
    <NightBeach lamps={lamps}>
      {new Array(HATCH).fill(0).map((_, i) => {
        const lost = i % 3 !== 0;
        const k = Math.max(0, t - turn);
        const baseX = 340 + (i % 3) * 140;
        const baseY = 1000 + Math.floor(i / 3) * 70;
        const x = lost ? baseX - k * (70 + i * 8) : baseX + k * 10;
        const y = lost ? baseY + k * 25 : baseY - k * 30;
        return <Hatchling key={i} x={x} y={Math.min(Math.max(y, 860), 1180)} dir={lost && k > 0 ? -1 : 1} t={t} i={i} />;
      })}
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
        width={380}
        flap={Math.sin(t * 6)}
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

const Bag: React.FC = () => (
  <svg width="260" height="360" viewBox="0 0 130 180">
    <path d="M20 40 Q20 20 40 22 L40 40 M110 40 Q110 20 90 22 L90 40" stroke="#eef6fb" strokeWidth="8" fill="none" />
    <path d="M14 40 L116 40 L106 150 Q65 175 24 150 Z" fill="rgba(238,246,251,.85)" />
    <path d="M30 60 L40 140 M65 55 L65 150 M100 60 L90 140" stroke="rgba(180,200,215,.8)" strokeWidth="3" />
  </svg>
);

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
        <div style={{position: 'absolute', opacity: reveal}}>
          <Bag />
        </div>
      </div>
      <Turtle
        width={460}
        sad={reveal > 0.5}
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
        sad={t > stuck && t < escape}
        flap={Math.sin(t * (t > stuck && t < escape ? 16 : 6))}
        style={{
          position: 'absolute',
          left: 330 + shake + free * 700,
          top: rise - free * 380,
          transform: `rotate(${-free * 25}deg)`,
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
export const Dinos: React.FC<P> = ({s}) => {
  const t = useSeconds();
  const turtleBar = interpolate(t, [at(s, 'sua'), at(s, 'anos')], [0, 1], clamp);
  const dinoBar = interpolate(t, [at(s, 'sobreviveu'), at(s, 'dinossauros') + 0.6], [0, 1], clamp);
  const items = usePop(at(s, 'coisas'));
  const row = (label: string, color: string, w: number, p: number, note: string) => (
    <div style={{marginBottom: 48}}>
      <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 38, color: '#cfe3ff', marginBottom: 14}}>{label}</div>
      <div style={{position: 'relative', height: 70, background: 'rgba(255,255,255,.08)', borderRadius: 16}}>
        <div style={{width: w * p, height: 70, background: color, borderRadius: 16}} />
        <div style={{position: 'absolute', left: Math.min(w * p, 860) - 6, top: 82, fontFamily: FONT_UI, fontWeight: 800, fontSize: 34, color, opacity: p > 0.95 ? 1 : 0, transform: 'translateX(-100%)', whiteSpace: 'nowrap'}}>
          {note}
        </div>
      </div>
    </div>
  );
  return (
    <Fill style={{background: '#0f1726'}}>
      <div style={{position: 'absolute', top: 330, left: 90, width: 900}}>
        <div style={{textAlign: 'center', marginBottom: 50}}>
          <Tag bg="#1f2a3d" color="#7ee2a8" size={36} style={{border: '3px solid #7ee2a8', boxShadow: 'none'}}>
            Linha do tempo
          </Tag>
        </div>
        {row('Tartarugas marinhas', C.green, 900, turtleBar, '+100 milhões de anos · ainda aqui')}
        {row('Dinossauros', '#f59e0b', 470, dinoBar, 'extintos')}
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT_UI, fontWeight: 600, fontSize: 28, color: '#8aa0bf', marginTop: 10}}>
          <span>passado</span>
          <span>hoje</span>
        </div>
      </div>
      <div style={{position: 'absolute', top: 960, width: '100%', display: 'flex', justifyContent: 'center', gap: 26, transform: `scale(${items})`}}>
        {['Sacola', 'Canudo', 'Rede'].map((x) => (
          <Tag key={x} bg={C.red} size={38}>
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
  return (
    <Fill style={{background: 'linear-gradient(#ffd59a, #ff9f7a 32%, #2a86bf 46%, #0b3c63)'}}>
      <div style={{position: 'absolute', left: 540 - 220, top: 560, width: 440, height: 440, borderRadius: '50%', background: '#ffe9a8'}} />
      <div style={{position: 'absolute', top: 880, left: 0, right: 0, bottom: 0, background: 'linear-gradient(#1f8ac2, #08385b)'}} />
      <Turtle width={520} flap={Math.sin(t * 5)} style={{position: 'absolute', left: interpolate(t, [0, 5], [200, 760]), top: 900 + Math.sin(t * 2) * 15}} />
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', transform: `scale(${q})`}}>
        <Tag bg={C.yellow} color={C.ink} size={48}>
          Comenta aqui ↓
        </Tag>
      </div>
    </Fill>
  );
};
