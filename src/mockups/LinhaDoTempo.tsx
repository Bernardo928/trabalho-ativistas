import React from 'react';
import {Turtle} from '../Turtle';
import {C, FONT_TITLE, FONT_UI, Tag} from '../ui';

// Prévia estática da cena 22:00 redesenhada: cada barra vira uma "pista"
// e o personagem anda na ponta dela. Mostra o momento em que as duas
// barras já cresceram (dinossauro virou fóssil, tartaruga chegou a hoje).

const X0 = 90; // 110 milhões de anos atrás
const X1 = 990; // hoje
const xOf = (ma: number) => X0 + ((110 - ma) / 110) * (X1 - X0);
const X_EXT = xOf(66);

const Dino: React.FC<{width?: number}> = ({width = 210}) => (
  <svg width={width} height={width * 0.73} viewBox="0 0 220 160">
    <path d="M62 88 Q24 92 0 124 Q34 112 72 106 Z" fill="#f59e0b" />
    <rect x="62" y="108" width="17" height="42" rx="7" fill="#d97706" />
    <rect x="84" y="110" width="17" height="40" rx="7" fill="#b45309" />
    <rect x="108" y="110" width="17" height="40" rx="7" fill="#d97706" />
    <rect x="128" y="108" width="17" height="42" rx="7" fill="#b45309" />
    <ellipse cx="98" cy="92" rx="52" ry="33" fill="#f59e0b" />
    <ellipse cx="98" cy="106" rx="38" ry="13" fill="#fcd34d" />
    <path d="M128 82 Q152 42 166 18 L182 24 Q166 52 142 98 Z" fill="#f59e0b" />
    <ellipse cx="184" cy="21" rx="19" ry="12" fill="#f59e0b" />
    <circle cx="190" cy="16" r="3.4" fill="#10243a" />
    <path d="M188 27 q6 3 12 -1" stroke="#10243a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <circle cx="84" cy="78" r="6" fill="#d97706" />
    <circle cx="106" cy="70" r="5" fill="#d97706" />
    <circle cx="118" cy="86" r="4" fill="#d97706" />
  </svg>
);

const Fossil: React.FC<{width?: number}> = ({width = 230}) => (
  <svg width={width} height={width * 0.5} viewBox="0 0 230 115">
    <ellipse cx="115" cy="104" rx="112" ry="11" fill="#2a3a5a" />
    <path d="M8 84 Q60 64 110 72 Q150 78 178 62" stroke="#cbd5e1" strokeWidth="7" fill="none" strokeLinecap="round" />
    {[70, 84, 98, 112, 126].map((x, i) => (
      <path key={x} d={`M${x} ${71 + (i % 2)} q -6 14 2 26`} stroke="#cbd5e1" strokeWidth="5" fill="none" strokeLinecap="round" />
    ))}
    <path d="M60 80 L48 100 M140 76 L152 98" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="196" cy="56" rx="22" ry="13" fill="#cbd5e1" />
    <circle cx="202" cy="52" r="4.5" fill="#1d2b4a" />
    <path d="M190 64 l4 6 l4 -6 l4 6 l4 -6" stroke="#1d2b4a" strokeWidth="2.4" fill="none" />
  </svg>
);

const Meteor: React.FC = () => (
  <svg width="220" height="160" viewBox="0 0 220 160">
    <defs>
      <linearGradient id="trail" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fde68a" stopOpacity="0" />
        <stop offset="1" stopColor="#fb923c" stopOpacity="0.95" />
      </linearGradient>
    </defs>
    <path d="M214 4 L60 118 L46 98 Z" fill="url(#trail)" />
    <circle cx="48" cy="118" r="26" fill="#9a3412" />
    <circle cx="40" cy="110" r="7" fill="#7c2d12" />
    <circle cx="58" cy="126" r="5" fill="#7c2d12" />
  </svg>
);

const Lane: React.FC<{
  top: number;
  label: string;
  color: string;
  progressX: number;
  children: React.ReactNode;
  note: React.ReactNode;
}> = ({top, label, color, progressX, children, note}) => (
  <div style={{position: 'absolute', top, left: 0, width: 1080, height: 300}}>
    <div style={{position: 'absolute', left: X0, top: 0, fontFamily: FONT_UI, fontWeight: 800, fontSize: 38, color: '#e2ecff'}}>
      {label}
    </div>
    {children}
    <div style={{position: 'absolute', left: X0, top: 210, width: X1 - X0, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.1)'}} />
    <div style={{position: 'absolute', left: X0, top: 210, width: progressX - X0, height: 30, borderRadius: 15, background: color}} />
    {note}
  </div>
);

export const LinhaDoTempoMock: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(#141e36, #1d2b4a 55%, #241f45)'}}>
    {new Array(30).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: (i * 197) % 1080,
          top: (i * 131) % 1800,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#fff',
          opacity: 0.25,
        }}
      />
    ))}

    {/* Relógio da história, igual ao vídeo */}
    <div style={{position: 'absolute', top: 120, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, background: C.white, color: C.ink, borderRadius: 999, padding: '14px 30px', fontFamily: FONT_UI, fontWeight: 800, fontSize: 38, boxShadow: '0 8px 0 rgba(0,0,0,.25)'}}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="17" fill="none" stroke={C.ink} strokeWidth="4" />
          <path d="M20 10 V20 L27 24" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
        <span>DIA DE TARTARUGA</span>
        <span style={{background: C.ink, color: C.yellow, borderRadius: 999, padding: '4px 16px'}}>22:00</span>
      </div>
    </div>

    <div style={{position: 'absolute', top: 270, width: '100%', textAlign: 'center'}}>
      <Tag bg="#1f2a3d" color="#7ee2a8" size={36} style={{border: '3px solid #7ee2a8', boxShadow: 'none'}}>
        Linha do tempo
      </Tag>
    </div>

    {/* Linha tracejada: fim dos dinossauros */}
    <div style={{position: 'absolute', left: X_EXT - 2, top: 440, width: 0, height: 210, borderLeft: '4px dashed rgba(251,146,60,.6)'}} />
    <div style={{position: 'absolute', left: X_EXT - 2, top: 790, width: 0, height: 280, borderLeft: '4px dashed rgba(251,146,60,.6)'}} />

    <Lane
      top={380}
      label="Dinossauros"
      color="#f59e0b"
      progressX={X_EXT}
      note={
        <div style={{position: 'absolute', left: X_EXT + 24, top: 196}}>
          <Tag bg={C.red} size={32}>
            ✕ Extintos
          </Tag>
        </div>
      }
    >
      <div style={{position: 'absolute', left: X_EXT - 225, top: 100}}>
        <Fossil width={230} />
      </div>
      <div style={{position: 'absolute', left: X_EXT - 10, top: -40, opacity: 0.95}}>
        <Meteor />
      </div>
      <div style={{position: 'absolute', left: X0 - 10, top: 100, opacity: 0.3}}>
        <Dino width={150} />
      </div>
    </Lane>

    <Lane
      top={720}
      label="Tartarugas marinhas"
      color={C.green}
      progressX={X1}
      note={
        <div style={{position: 'absolute', right: 1080 - X1, top: 256}}>
          <Tag bg={C.greenDark} size={32}>
            ✓ Ainda aqui
          </Tag>
        </div>
      }
    >
      {/* Poeira atrás da tartaruga = está andando */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: X1 - 250 - i * 46, top: 186 - i * 6, width: 26 - i * 6, height: 26 - i * 6, borderRadius: '50%', background: 'rgba(255,255,255,.35)'}} />
      ))}
      <div style={{position: 'absolute', left: X1 - 220, top: 66}}>
        <Turtle width={210} flap={0.6} />
      </div>
      <div style={{position: 'absolute', left: X0 + 40, top: 110, opacity: 0.22}}>
        <Turtle width={150} flap={-0.4} />
      </div>
    </Lane>

    {/* Eixo do tempo */}
    <div style={{position: 'absolute', top: 1070, left: X0, width: X1 - X0, height: 4, background: '#8aa0bf'}} />
    {[
      {x: X0, t: '110 mi anos atrás', a: 'left' as const},
      {x: X_EXT, t: '66 mi', a: 'center' as const},
      {x: X1, t: 'hoje', a: 'right' as const},
    ].map(({x, t, a}) => (
      <div key={t}>
        <div style={{position: 'absolute', left: x - 2, top: 1058, width: 4, height: 28, background: '#8aa0bf'}} />
        <div
          style={{
            position: 'absolute',
            top: 1096,
            left: a === 'left' ? x : a === 'center' ? x - 150 : x - 300,
            width: a === 'center' ? 300 : 300,
            textAlign: a,
            fontFamily: FONT_UI,
            fontWeight: 800,
            fontSize: 30,
            color: '#cfe3ff',
          }}
        >
          {t}
        </div>
      </div>
    ))}

    {/* Legenda no mesmo estilo do vídeo */}
    <div style={{position: 'absolute', top: 1300, left: 60, right: 60, textAlign: 'center', fontFamily: FONT_TITLE, fontSize: 98, lineHeight: 1.08, textTransform: 'uppercase'}}>
      <span style={{color: C.white, WebkitTextStroke: '16px #0d1b2a', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,.35)'}}>Sobreviveu aos</span>{' '}
      <span style={{color: C.yellow, WebkitTextStroke: '16px #0d1b2a', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,.35)'}}>dinossauros:</span>
    </div>
  </div>
);
