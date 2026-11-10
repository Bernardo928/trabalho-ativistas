import React from 'react';
import {OffthreadVideo, interpolate, random, staticFile} from 'remotion';
import {C, FONT_TITLE, FONT_UI, Fill, Tag, Underwater, fadeIn, usePop, useSeconds} from '../ui';
import {Turtle} from '../Turtle';
import {Ativista, humorEm} from './Ativista';
import {Cena, quando} from './linha';

type Props = {c: Cena};
// Momento de uma palavra contado a partir do início da cena.
const em = (c: Cena, palavra: string) => quando(palavra, c.inicio) - c.inicio;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const lerp = (t: number, ts: number[], vs: number[]) => interpolate(t, ts, vs, clamp);

/* ---------- peças de cenário ---------- */
const Sol: React.FC<{x: number; y: number; r?: number; cor?: string}> = ({x, y, r = 100, cor = '#ffd76a'}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: cor, boxShadow: `0 0 90px 30px ${cor}66`}} />
);

const Arvore: React.FC<{x: number; y: number; s: number; cor?: string}> = ({x, y, s, cor = '#3f9e5b'}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${s})`, transformOrigin: '50% 100%'}}>
    <svg width="120" height="170" viewBox="0 0 120 170">
      <rect x="52" y="100" width="16" height="70" rx="6" fill="#8b5a2b" />
      <circle cx="60" cy="70" r="46" fill={cor} />
      <circle cx="32" cy="92" r="28" fill={cor} />
      <circle cx="88" cy="92" r="28" fill={cor} />
      <circle cx="46" cy="54" r="14" fill="#ffffff" opacity="0.15" />
    </svg>
  </div>
);

const Terra: React.FC<{x: number; y: number; r: number; giro: number}> = ({x, y, r, giro}) => (
  <svg width={r * 2} height={r * 2} viewBox="0 0 200 200" style={{position: 'absolute', left: x - r, top: y - r, overflow: 'visible'}}>
    <defs>
      <clipPath id="globo">
        <circle cx="100" cy="100" r="96" />
      </clipPath>
    </defs>
    <circle cx="100" cy="100" r="100" fill="#cfe9ff" opacity="0.35" />
    <circle cx="100" cy="100" r="96" fill="#2f86d6" />
    <g clipPath="url(#globo)">
      {[0, 220].map((dx) => (
        <g key={dx} transform={`translate(${((giro * 30) % 220) - 220 + dx} 0)`}>
          <path d="M30 40 Q60 22 82 44 Q96 66 74 80 Q60 96 44 84 Q24 70 30 40Z" fill="#4caf50" />
          <path d="M70 100 Q90 96 96 120 Q100 150 84 170 Q70 160 66 136 Q60 114 70 100Z" fill="#4caf50" />
          <path d="M120 36 Q160 30 184 52 Q196 74 170 86 Q150 92 134 80 Q114 62 120 36Z" fill="#4caf50" />
          <path d="M150 110 Q176 108 182 128 Q176 146 156 142 Q140 130 150 110Z" fill="#4caf50" />
        </g>
      ))}
      <ellipse cx="100" cy="190" rx="90" ry="20" fill="#eef7ff" opacity="0.8" />
    </g>
    <circle cx="70" cy="60" r="36" fill="#ffffff" opacity="0.12" />
  </svg>
);

// Pessoinha simples para multidão, com plaquinha.
const Pessoa: React.FC<{x: number; y: number; cor: string; s: number; t: number; i: number}> = ({x, y, cor, s, t, i}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -100%) scale(${s}) translateY(${Math.abs(Math.sin(t * 6 + i)) * -6}px)`, transformOrigin: '50% 100%'}}>
    <svg width="80" height="190" viewBox="0 0 80 190">
      <rect x="37" y="0" width="5" height="70" fill="#8b5a2b" />
      <rect x="10" y="0" width="60" height="36" rx="5" fill="#fff8e1" stroke={C.ink} strokeWidth="3" />
      <rect x="18" y="12" width="44" height="10" rx="4" fill={i % 2 ? '#2f9e5b' : '#dc2626'} />
      <circle cx="40" cy="96" r="20" fill={['#b97a4f', '#e0ac69', '#8d5524', '#f1c27d'][i % 4]} />
      <rect x="18" y="118" width="44" height="64" rx="18" fill={cor} />
    </svg>
  </div>
);

/* ---------- 1. Abertura ---------- */
export const Abertura: React.FC<Props> = ({c}) => {
  const t = useSeconds();
  const pop = usePop(0.1);
  const zero = usePop(em(c, 'aplaude'), 9);
  return (
    <Fill style={{background: 'linear-gradient(#7cc6ff, #c9ecff 55%, #e9f7ee)'}}>
      <Terra x={540} y={560} r={300} giro={t} />
      <div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center', transform: `scale(${pop})`}}>
        <Tag bg={C.ink} size={40}>
          1 dia · 24 horas
        </Tag>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 860, height: 400, background: '#7bc47f', borderRadius: '50% 50% 0 0 / 30% 30% 0 0'}} />
      <Ativista
        width={290}
        humor={humorEm(t, [
          [0, 'feliz'],
          [em(c, 'descobrir'), 'confuso'],
          [em(c, 'trabalho'), 'cansado'],
          [em(c, 'ninguem'), 'triste'],
        ])}
        bracoD={t < em(c, 'descobrir') ? 150 + Math.sin(t * 9) * 12 : 8}
        style={{position: 'absolute', left: 540 - 145, top: 760}}
      />
      <div style={{position: 'absolute', top: 1140, right: 70, opacity: zero, transform: `scale(${1.4 - zero * 0.4}) rotate(-4deg)`}}>
        <Tag bg={C.red} size={38}>
          Aplausos: 0
        </Tag>
      </div>
    </Fill>
  );
};

/* ---------- 2. Praia (06:00) ---------- */
const Tampinha: React.FC<{cor: string}> = ({cor}) => (
  <svg width="46" height="24" viewBox="0 0 46 24">
    <ellipse cx="23" cy="14" rx="20" ry="9" fill={cor} />
    <ellipse cx="23" cy="10" rx="20" ry="8" fill={cor} stroke="#00000033" strokeWidth="2" />
  </svg>
);
const Canudo: React.FC = () => (
  <svg width="120" height="30" viewBox="0 0 120 30">
    <g transform="rotate(-12 60 15)">
      <rect x="4" y="10" width="112" height="10" rx="5" fill="#fff" />
      {[10, 30, 50, 70, 90].map((x) => (
        <rect key={x} x={x} y="10" width="9" height="10" fill="#ef4444" />
      ))}
    </g>
  </svg>
);
const Bituca: React.FC = () => (
  <svg width="70" height="26" viewBox="0 0 70 26">
    <g transform="rotate(8 35 13)">
      <rect x="4" y="8" width="34" height="11" rx="3" fill="#e8a33d" />
      <rect x="36" y="8" width="26" height="11" rx="3" fill="#f5f5f4" />
      <rect x="60" y="8" width="5" height="11" rx="2" fill="#57534e" />
    </g>
  </svg>
);

const LIXO: {x: number; y: number; tipo: 'tampinha' | 'canudo' | 'bituca'; cor?: string}[] = [
  {x: 300, y: 1040, tipo: 'tampinha', cor: '#3b82f6'},
  {x: 360, y: 1090, tipo: 'tampinha', cor: '#ef4444'},
  {x: 560, y: 1060, tipo: 'canudo'},
  {x: 770, y: 1050, tipo: 'bituca'},
  {x: 820, y: 1110, tipo: 'bituca'},
];

const SacoIcone: React.FC<{cheio: number}> = ({cheio}) => (
  <svg width="56" height="64" viewBox="0 0 56 64" style={{opacity: 0.25 + cheio * 0.75, transform: `scale(${0.6 + cheio * 0.4})`}}>
    <path d="M22 4 L34 4 L32 12 L24 12 Z" fill="#14532d" />
    <path d="M24 12 Q2 18 4 40 Q6 62 28 62 Q50 62 52 40 Q54 18 32 12 Z" fill="#1f2937" />
  </svg>
);

export const Praia: React.FC<Props> = ({c}) => {
  const t = useSeconds();
  const tT = em(c, 'tampinha');
  const tC = em(c, 'canudo');
  const tB = em(c, 'bituca');
  const tVai = em(c, 'voce');
  const fimAnda = em(c, 'em');
  const cx = lerp(t, [tVai, tT, tC, tB, fimAnda], [-160, 330, 560, 790, 830]);
  const andando = t > tVai && t < fimAnda;
  const coletado = (tipo: string) => (tipo === 'tampinha' ? tT : tipo === 'canudo' ? tC : tB) + 0.35;
  const tSacos = em(c, 'em');
  const tVinte = em(c, 'vinte');
  const sacos = Math.floor(lerp(t, [tSacos, tVinte + 0.2], [0, 20]));
  const vinte = usePop(tVinte, 9);
  const placar = usePop(tSacos);
  return (
    <Fill style={{background: 'linear-gradient(#ffd9a8, #ffeccf 30%, #bfe6ff 46%)'}}>
      <Sol x={860} y={lerp(t, [0, 6], [470, 380])} r={90} />
      <div style={{position: 'absolute', top: 540, left: 0, right: 0, height: 260, background: 'linear-gradient(#4ba3e3, #2b7fc4)'}} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', top: 580 + i * 60, left: 80 + i * 140 + Math.sin(t * 2 + i) * 30, width: 220, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.5)'}} />
      ))}
      <svg width="1080" height="60" style={{position: 'absolute', top: 770}}>
        <path d={`M0 30 Q 135 ${12 + Math.sin(t * 2) * 10} 270 30 T 540 30 T 810 30 T 1080 30 V60 H0Z`} fill="#f7f3e8" />
      </svg>
      <div style={{position: 'absolute', top: 800, left: 0, right: 0, bottom: 0, background: 'linear-gradient(#f2d39a, #e2b873)'}} />
      {LIXO.map((l, i) => {
        const tc = coletado(l.tipo);
        const sai = lerp(t, [tc, tc + 0.3], [1, 0]);
        return (
          <div key={i} style={{position: 'absolute', left: l.x, top: l.y, transform: `translate(-50%, -50%) scale(${1.7 * sai}) translateY(${(1 - sai) * -80}px)`, opacity: sai}}>
            {l.tipo === 'tampinha' ? <Tampinha cor={l.cor!} /> : l.tipo === 'canudo' ? <Canudo /> : <Bituca />}
          </div>
        );
      })}
      {(
        [
          ['Tampinha', 'tampinha', 330],
          ['Canudo', 'canudo', 560],
          ['Bituca', 'bituca', 790],
        ] as const
      ).map(([rotulo, palavra, x]) => {
        const p = usePop(em(c, palavra), 10);
        const tc = coletado(palavra) + 0.6;
        return (
          <div key={rotulo} style={{position: 'absolute', left: x, top: 650, zIndex: 2, transform: `translate(-50%, 0) scale(${p})`, opacity: t > tc + 0.4 ? lerp(t, [tc + 0.4, tc + 0.8], [1, 0]) : 1}}>
            <Tag bg={C.red} size={30}>
              {rotulo}
            </Tag>
          </div>
        );
      })}
      <Ativista
        width={260}
        item="saco"
        bracoD={10}
        passo={andando ? t * 9 : 0}
        humor={humorEm(t, [
          [0, 'determinado'],
          [em(c, 'nadar'), 'confuso'],
          [em(c, 'recolher'), 'determinado'],
          [em(c, 'sacos'), 'orgulhoso'],
        ])}
        olhar={0.5}
        style={{position: 'absolute', left: cx - 130, top: 730}}
      />
      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 120,
          right: 120,
          background: '#fff',
          borderRadius: 30,
          padding: '24px 26px',
          boxShadow: '0 12px 0 rgba(13,27,42,.15)',
          opacity: placar,
          transform: `scale(${0.85 + placar * 0.15})`,
        }}
      >
        <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 34, color: C.ink, textAlign: 'center', marginBottom: 12}}>EM 1 HORA DE MUTIRÃO</div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6}}>
          {new Array(20).fill(0).map((_, i) => (
            <SacoIcone key={i} cheio={i < sacos ? 1 : 0} />
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: 10, transform: `scale(${0.6 + vinte * 0.4})`, opacity: vinte}}>
          <span style={{fontFamily: FONT_TITLE, fontSize: 90, color: '#2f9e5b', lineHeight: 1}}>20 SACOS</span>
        </div>
      </div>
    </Fill>
  );
};

/* ---------- 3. Plantar (09:00) ---------- */
const MUDAS = [140, 290, 440, 600, 760, 910];

export const Plantar: React.FC<Props> = ({c}) => {
  const t = useSeconds();
  const t0 = em(c, 'hora') - 0.3;
  const t1 = em(c, 'vez') + 0.2;
  const cx = lerp(t, [t0, t1], [-150, 980]);
  const andando = t > t0 && t < t1;
  const quandoPassa = (x: number) => t0 + ((x + 150) / 1130) * (t1 - t0);
  const card = usePop(em(c, 'wangari'));
  const tTrinta = em(c, 'trinta');
  const n = Math.round(lerp(t, [tTrinta - 0.3, em(c, 'arvores')], [0, 30]));
  const contador = usePop(tTrinta - 0.3);
  const floresta = lerp(t, [tTrinta - 0.6, tTrinta + 1.4], [0, 1]);
  return (
    <Fill style={{background: 'linear-gradient(#8fd3ff, #d8f1ff 60%)'}}>
      <Sol x={180} y={420} r={80} />
      {new Array(26).fill(0).map((_, i) => {
        const p = Math.min(1, Math.max(0, floresta * 1.4 - (i / 26) * 0.4));
        return <Arvore key={i} x={40 + (i % 13) * 82 + (i > 12 ? 40 : 0)} y={(i > 12 ? 860 : 820) + random(`fy${i}`) * 20} s={0.55 * p} cor={i % 3 ? '#4f9d55' : '#2e7d3b'} />;
      })}
      <div style={{position: 'absolute', left: -200, right: -200, top: 840, bottom: 0, background: '#6cbf62', borderRadius: '50% 50% 0 0 / 18% 18% 0 0'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, bottom: 0, background: '#5aab52'}} />
      {MUDAS.map((x, i) => {
        const tp = quandoPassa(x);
        const cresce = lerp(t, [tp, tp + 0.3, tp + 4], [0, 0.35, 0.95]);
        return cresce > 0 ? <Arvore key={i} x={x} y={1010} s={cresce} cor={i % 2 ? '#3f9e5b' : '#2e8b4e'} /> : null;
      })}
      <Ativista
        width={250}
        item="muda"
        bracoD={40}
        passo={andando ? t * 9 : 0}
        olhar={0.5}
        humor={humorEm(t, [
          [0, 'determinado'],
          [em(c, 'plantar'), 'feliz'],
          [tTrinta, 'chocado'],
          [em(c, 'arvores'), 'orgulhoso'],
        ])}
        style={{position: 'absolute', left: Math.min(cx, 840) - 125, top: 700}}
      />
      <div style={{position: 'absolute', top: 260, left: 110, right: 110, background: '#fff', borderRadius: 28, overflow: 'hidden', boxShadow: '0 12px 0 rgba(13,27,42,.15)', opacity: card, transform: `translateY(${(1 - card) * -40}px)`}}>
        <div style={{height: 16, background: 'linear-gradient(90deg, #000 33%, #bb0000 33% 66%, #006600 66%)'}} />
        <div style={{padding: '20px 28px', textAlign: 'center'}}>
          <div style={{fontFamily: FONT_TITLE, fontSize: 64, color: C.ink, lineHeight: 1}}>WANGARI MAATHAI</div>
          <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, color: '#4b5563', marginTop: 8}}>Quênia · Movimento Cinturão Verde</div>
          <div style={{marginTop: 12}}>
            <Tag bg={C.greenDark} size={26}>
              Nobel da Paz 2004
            </Tag>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', opacity: contador, transform: `scale(${0.7 + contador * 0.3})`}}>
        <div style={{display: 'inline-block', background: C.ink, borderRadius: 26, padding: '14px 34px'}}>
          <div style={{fontFamily: FONT_TITLE, fontSize: 92, color: C.yellow, lineHeight: 1}}>+{n} MILHÕES</div>
          <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 32, color: '#fff'}}>de árvores plantadas</div>
        </div>
      </div>
    </Fill>
  );
};

/* ---------- 4. Protesto (12:00) ---------- */
const Prefeitura: React.FC = () => (
  <svg width="820" height="620" viewBox="0 0 820 620" style={{position: 'absolute', left: 130, top: 390}}>
    <rect x="404" y="0" width="6" height="90" fill="#6b7280" />
    <path d="M410 6 L470 22 L410 38 Z" fill="#2f9e5b" />
    <path d="M60 210 L410 90 L760 210 Z" fill="#e7e1d6" stroke="#b8ae9c" strokeWidth="6" />
    <rect x="60" y="210" width="700" height="44" fill="#d9d1c3" />
    <text x="410" y="242" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="34" fill="#5b5245" letterSpacing="6">
      PREFEITURA
    </text>
    <rect x="80" y="254" width="660" height="300" fill="#f1ece3" />
    {[110, 230, 350, 470, 590, 690].map((x) => (
      <rect key={x} x={x} y="254" width="40" height="300" fill="#ddd5c6" />
    ))}
    <rect x="370" y="410" width="80" height="144" rx="40" fill="#8b5a2b" />
    <rect x="40" y="554" width="740" height="26" fill="#cfc6b6" />
    <rect x="10" y="580" width="800" height="40" fill="#bfb5a3" />
  </svg>
);

export const Protesto: React.FC<Props> = ({c}) => {
  const t = useSeconds();
  const card = usePop(em(c, 'greta'));
  const sozinha = usePop(em(c, 'sozinha'), 9);
  const tGreve = em(c, 'greve') - 0.6;
  const cores = ['#f97316', '#3b82f6', '#a855f7', '#ef4444', '#14b8a6', '#eab308', '#ec4899', '#22c55e'];
  return (
    <Fill style={{background: 'linear-gradient(#9fd8ff, #e3f4ff 60%)'}}>
      <Prefeitura />
      <div style={{position: 'absolute', left: 0, right: 0, top: 980, bottom: 0, background: '#b7b0a4'}} />
      {new Array(12).fill(0).map((_, i) => {
        const p = lerp(t, [tGreve + i * 0.12, tGreve + i * 0.12 + 0.3], [0, 1]);
        const x = i < 6 ? 470 + i * 95 : 520 + (i - 6) * 95;
        return p > 0 ? <Pessoa key={i} x={x} y={i < 6 ? 1150 : 1240} cor={cores[i % cores.length]} s={(i < 6 ? 0.95 : 1.05) * p} t={t} i={i} /> : null;
      })}
      <Ativista
        width={250}
        item="placa"
        placa="PELO|CLIMA!"
        bracoD={150 + Math.sin(t * 5) * 6}
        humor={humorEm(t, [
          [0, 'determinado'],
          [em(c, 'sozinha'), 'triste'],
          [tGreve + 0.6, 'feliz'],
          [em(c, 'clima'), 'orgulhoso'],
        ])}
        olhar={0.4}
        style={{position: 'absolute', left: 90, top: 760}}
      />
      <div style={{position: 'absolute', top: 210, left: 380, right: 50, background: '#fff', borderRadius: 26, overflow: 'hidden', boxShadow: '0 12px 0 rgba(13,27,42,.15)', opacity: card, transform: `translateX(${(1 - card) * 120}px)`}}>
        <div style={{height: 14, background: 'linear-gradient(#006aa7 50%, #fecc00 50%)'}} />
        <div style={{padding: '16px 22px'}}>
          <div style={{fontFamily: FONT_TITLE, fontSize: 52, color: C.ink, lineHeight: 1}}>GRETA THUNBERG</div>
          <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, color: '#4b5563', marginTop: 6}}>Suécia · 15 anos · 2018</div>
          <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, color: C.greenDark, marginTop: 4}}>Greve escolar pelo clima</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1130, left: 120, opacity: sozinha * (1 - lerp(t, [tGreve + 0.6, tGreve + 1], [0, 1])), transform: `scale(${sozinha}) rotate(-3deg)`}}>
        <Tag bg={C.ink} size={30}>
          Começou sozinha
        </Tag>
      </div>
    </Fill>
  );
};

/* ---------- 5. Denúncia (15:00) ---------- */
const Icone: React.FC<{tipo: 'foto' | 'mapa' | 'prova'}> = ({tipo}) => (
  <svg width="56" height="56" viewBox="0 0 56 56">
    {tipo === 'foto' && (
      <>
        <rect x="4" y="14" width="48" height="34" rx="7" fill="#334155" />
        <rect x="18" y="8" width="20" height="10" rx="3" fill="#334155" />
        <circle cx="28" cy="31" r="10" fill="#7dd3fc" stroke="#fff" strokeWidth="3" />
      </>
    )}
    {tipo === 'mapa' && (
      <>
        <path d="M4 12 L20 6 L36 12 L52 6 L52 46 L36 52 L20 46 L4 52 Z" fill="#86efac" stroke="#166534" strokeWidth="3" />
        <path d="M20 6 L20 46 M36 12 L36 52" stroke="#166534" strokeWidth="3" />
        <circle cx="30" cy="26" r="6" fill="#dc2626" />
      </>
    )}
    {tipo === 'prova' && (
      <>
        <rect x="10" y="4" width="36" height="48" rx="5" fill="#fff" stroke="#334155" strokeWidth="3" />
        <path d="M18 18 H38 M18 26 H38 M18 34 H30" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        <circle cx="38" cy="42" r="9" fill="#2f9e5b" />
        <path d="M34 42 l3 3 l5 -6" stroke="#fff" strokeWidth="2.5" fill="none" />
      </>
    )}
  </svg>
);

export const Denuncia: React.FC<Props> = ({c}) => {
  const t = useSeconds();
  const alerta = usePop(em(c, 'denuncia'), 10);
  const desmate = lerp(t, [em(c, 'desmatamento') - 0.2, em(c, 'ilegal') + 0.4], [0, 1]);
  const itens: ['foto' | 'mapa' | 'prova', string, string][] = [
    ['foto', 'Fotos', 'fotos'],
    ['mapa', 'Mapas', 'mapas'],
    ['prova', 'Provas', 'provas'],
  ];
  const tManda = em(c, 'manda');
  const enviado = t >= tManda + 0.3;
  const aviao = lerp(t, [tManda + 0.2, tManda + 1.2], [0, 1]);
  const ok = usePop(em(c, 'ambientais'), 9);
  return (
    <Fill style={{background: 'linear-gradient(#e7eef8, #cfdcee)'}}>
      <div style={{position: 'absolute', left: 340, top: 230, width: 560, height: 980, background: C.ink, borderRadius: 64, boxShadow: '0 16px 0 rgba(13,27,42,.2)'}}>
        <div style={{position: 'absolute', left: 24, right: 24, top: 24, bottom: 24, background: '#f8fafc', borderRadius: 44, overflow: 'hidden'}}>
          <div style={{background: '#2f9e5b', color: '#fff', fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, padding: '30px 28px 18px'}}>Rede de Alertas Verdes</div>
          <div style={{margin: 20, background: '#fee2e2', border: '4px solid #dc2626', borderRadius: 22, padding: '14px 18px', transform: `scale(${alerta})`, opacity: alerta}}>
            <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, color: '#b91c1c'}}>⚠ NOVA DENÚNCIA</div>
            <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, color: C.ink}}>Desmatamento ilegal</div>
          </div>
          <div style={{margin: '0 20px', height: 300, borderRadius: 22, background: '#2e7d3b', position: 'relative', overflow: 'hidden', opacity: alerta}}>
            {new Array(40).fill(0).map((_, i) => (
              <div key={i} style={{position: 'absolute', left: (i % 8) * 62 + (Math.floor(i / 8) % 2) * 30, top: Math.floor(i / 8) * 60 + 6, width: 46, height: 46, borderRadius: '50%', background: i % 3 ? '#3f9e5b' : '#4caf50'}} />
            ))}
            <svg width="472" height="300" style={{position: 'absolute', left: 0, top: 0}}>
              <path d="M180 60 L320 80 L350 190 L250 240 L150 200 Z" fill="#c8a06a" stroke="#dc2626" strokeWidth="6" strokeDasharray="14 8" transform={`translate(250 150) scale(${desmate}) translate(-250 -150)`} />
            </svg>
            <div style={{position: 'absolute', bottom: 12, left: 12, opacity: desmate}}>
              <Tag bg={C.red} size={22}>
                Área desmatada
              </Tag>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around', margin: '24px 20px'}}>
            {itens.map(([tipo, rotulo, palavra]) => {
              const p = usePop(em(c, palavra), 10);
              return (
                <div key={tipo} style={{textAlign: 'center', transform: `scale(${p})`, opacity: p}}>
                  <div style={{background: '#fff', borderRadius: 18, padding: 12, boxShadow: '0 6px 0 rgba(13,27,42,.12)'}}>
                    <Icone tipo={tipo} />
                  </div>
                  <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 24, color: C.ink, marginTop: 6}}>{rotulo}</div>
                </div>
              );
            })}
          </div>
          <div style={{margin: '0 40px', textAlign: 'center', background: enviado ? C.greenDark : '#2563eb', color: '#fff', fontFamily: FONT_UI, fontWeight: 800, fontSize: 32, borderRadius: 999, padding: '18px 0', transform: `scale(${t > tManda && t < tManda + 0.3 ? 0.92 : 1})`, opacity: usePop(em(c, 'provas') + 0.3)}}>
            {enviado ? 'ENVIADO ✓' : 'ENVIAR DENÚNCIA'}
          </div>
        </div>
      </div>
      {aviao > 0 && aviao < 1 && (
        <svg width="90" height="90" viewBox="0 0 90 90" style={{position: 'absolute', left: 600 + aviao * 420, top: 980 - aviao * 900, transform: `rotate(-35deg)`}}>
          <path d="M5 45 L85 10 L60 85 L45 55 Z" fill="#fff" stroke={C.ink} strokeWidth="4" />
          <path d="M45 55 L85 10" stroke={C.ink} strokeWidth="3" />
        </svg>
      )}
      <div style={{position: 'absolute', top: 1110, left: 0, right: 0, textAlign: 'center', opacity: ok, transform: `scale(${ok})`}}>
        <Tag bg={C.greenDark} size={30}>
          ✓ Órgãos ambientais avisados
        </Tag>
      </div>
      <Ativista
        width={250}
        item="celular"
        bracoD={115}
        olhar={0.8}
        humor={humorEm(t, [
          [0, 'confuso'],
          [em(c, 'desmatamento'), 'chocado'],
          [em(c, 'junta'), 'determinado'],
          [em(c, 'ambientais'), 'orgulhoso'],
        ])}
        style={{position: 'absolute', left: 20, top: 700}}
      />
    </Fill>
  );
};

/* ---------- 6. Perigo (18:00) ---------- */
const Seringueira: React.FC = () => (
  <svg width="150" height="190" viewBox="0 0 150 190">
    <rect x="58" y="40" width="34" height="150" rx="10" fill="#7c5a3a" />
    {[70, 92, 114].map((y) => (
      <path key={y} d={`M60 ${y} L90 ${y + 12}`} stroke="#f5f5f4" strokeWidth="4" />
    ))}
    <path d="M90 128 q 10 6 10 14" stroke="#f5f5f4" strokeWidth="4" fill="none" />
    <path d="M92 142 L116 142 L112 162 L96 162 Z" fill="#a8a29e" />
    <ellipse cx="104" cy="143" rx="12" ry="3" fill="#fafaf9" />
    <circle cx="75" cy="36" r="40" fill="#2e7d3b" />
    <circle cx="44" cy="52" r="24" fill="#2e7d3b" />
    <circle cx="106" cy="52" r="24" fill="#2e7d3b" />
  </svg>
);

export const Perigo: React.FC<Props> = ({c}) => {
  const t = useSeconds();
  const lado = usePop(em(c, 'lado'), 9);
  const card = usePop(em(c, 'chico'));
  const tAssassinado = em(c, 'assassinado');
  const cinza = lerp(t, [tAssassinado, tAssassinado + 0.8], [0, 1]);
  const amazonia = usePop(em(c, 'amazonia'), 10);
  return (
    <Fill style={{background: 'linear-gradient(#3a2950, #a5486a 45%, #f08a4b 70%)'}}>
      <Sol x={540} y={860} r={130} cor="#ffb35c" />
      {new Array(9).fill(0).map((_, i) => (
        <Arvore key={i} x={i * 135} y={1000 + (i % 2) * 20} s={1.3} cor="#1f3d2b" />
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 990, bottom: 0, background: '#173022'}} />
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center', transform: `scale(${lado})`}}>
        <Tag bg={C.red} size={40}>
          ⚠ O lado perigoso
        </Tag>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 380,
          left: 120,
          right: 120,
          background: '#fff',
          borderRadius: 28,
          padding: '22px 26px',
          display: 'flex',
          gap: 22,
          alignItems: 'center',
          boxShadow: '0 12px 0 rgba(0,0,0,.25)',
          opacity: card,
          transform: `translateY(${(1 - card) * -40}px)`,
          filter: `grayscale(${cinza * 0.85})`,
        }}
      >
        <Seringueira />
        <div>
          <div style={{fontFamily: FONT_TITLE, fontSize: 64, color: C.ink, lineHeight: 1}}>CHICO MENDES</div>
          <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 28, color: '#4b5563', marginTop: 8}}>Seringueiro · Acre</div>
          <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 34, color: C.ink, marginTop: 6}}>1944 – 1988</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 680, width: '100%', textAlign: 'center', transform: `scale(${amazonia})`}}>
        <Tag bg={C.greenDark} size={32}>
          Ele defendia a Amazônia
        </Tag>
      </div>
      <Ativista
        width={250}
        humor={humorEm(t, [
          [0, 'determinado'],
          [em(c, 'perigoso'), 'assustado'],
          [tAssassinado, 'triste'],
        ])}
        olhar={-0.3}
        style={{position: 'absolute', left: 540 - 125, top: 790}}
      />
    </Fill>
  );
};

/* ---------- 7. Legado (22:00) ---------- */
const X0 = 110;
const X1 = 970;
const BARRA = 1000;

export const Legado: React.FC<Props> = ({c}) => {
  const t = useSeconds();
  const tMas = em(c, 'mas');
  const tHoje = em(c, 'hoje');
  const ponta = lerp(t, [tMas, tHoje], [X0, X1]);
  const andando = t > tMas && t < tHoje;
  const mostra = fadeIn(t, tMas - 0.4, 0.5);
  const reserva = usePop(em(c, 'reservas'), 9);
  const hoje = usePop(tHoje, 9);
  const marcos: {x: number; ano: string; texto: string; p: number}[] = [
    {x: X0, ano: '1988', texto: 'Chico Mendes', p: mostra},
    {x: X0 + 430, ano: '1990', texto: 'Primeiras reservas extrativistas', p: reserva},
    {x: X1, ano: 'HOJE', texto: 'Milhões de hectares protegidos', p: hoje},
  ];
  return (
    <Fill style={{background: 'linear-gradient(#0b1630, #1d2f5c 60%, #24406e)'}}>
      {new Array(40).fill(0).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: random(`st${i}`) * 1080, top: random(`sy${i}`) * 900, width: 5, height: 5, borderRadius: '50%', background: '#fff', opacity: 0.3 + 0.6 * Math.abs(Math.sin(t * 2 + i))}} />
      ))}
      <div style={{position: 'absolute', right: 140, top: 230, width: 130, height: 130, borderRadius: '50%', background: '#f4f1d0', boxShadow: '0 0 80px 20px rgba(244,241,208,.3)'}} />
      <div style={{position: 'absolute', top: 260, left: 110, opacity: mostra}}>
        <Tag bg="#1f2a3d" color="#7ee2a8" size={34} style={{border: '3px solid #7ee2a8', boxShadow: 'none'}}>
          Linha do tempo
        </Tag>
      </div>
      {new Array(13).fill(0).map((_, i) => {
        const x = X0 + 40 + i * 64;
        const p = lerp(ponta - x, [0, 120], [0, 1]);
        return p > 0 ? <Arvore key={i} x={x} y={BARRA} s={0.35 + p * 0.35 + (i % 2) * 0.08} cor={i % 2 ? '#3f9e5b' : '#2e8b4e'} /> : null;
      })}
      <div style={{position: 'absolute', left: X0, top: BARRA, width: X1 - X0, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.12)', opacity: mostra}} />
      <div style={{position: 'absolute', left: X0, top: BARRA, width: Math.max(30, ponta - X0), height: 30, borderRadius: 15, background: '#22c55e', opacity: mostra}} />
      {marcos.map((m, i) => (
        <div key={m.ano} style={{position: 'absolute', left: i === 0 ? m.x : i === 2 ? m.x - 270 : m.x - 135, top: BARRA + 50, transform: `scale(${m.p})`, opacity: m.p, textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center', width: 270}}>
          <div style={{fontFamily: FONT_TITLE, fontSize: 52, color: C.yellow, lineHeight: 1}}>{m.ano}</div>
          <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, color: '#e2ecff', marginTop: 4}}>{m.texto}</div>
        </div>
      ))}
      <Ativista
        width={210}
        passo={andando ? t * 9 : 0}
        humor={humorEm(t, [
          [0, 'cansado'],
          [tMas, 'determinado'],
          [em(c, 'reservas'), 'feliz'],
          [tHoje, 'orgulhoso'],
        ])}
        olhar={0.5}
        style={{position: 'absolute', left: Math.min(ponta, X1 - 60) - 105, top: BARRA - 316}}
      />
    </Fill>
  );
};

/* ---------- 8. Solução (22:30) ---------- */
const Cartao: React.FC<{texto: string; p: number}> = ({texto, p}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      background: '#fff',
      borderRadius: 28,
      padding: '24px 30px',
      marginBottom: 22,
      boxShadow: '0 10px 0 rgba(13,27,42,.12)',
      opacity: p,
      transform: `translateX(${(1 - p) * 120}px)`,
    }}
  >
    <div style={{width: 60, height: 60, borderRadius: 18, background: C.greenDark, color: '#fff', fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
    <div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 44, color: C.ink}}>{texto}</div>
  </div>
);

export const Solucao: React.FC<Props> = ({c}) => {
  const cab = usePop(0.1);
  const a = usePop(em(c, 'separar'));
  const b = usePop(em(c, 'economizar'));
  const d = usePop(em(c, 'cobrar'));
  const e = usePop(em(c, 'entrar'));
  const todo = usePop(em(c, 'todo'));
  return (
    <Fill style={{background: 'linear-gradient(#dff7ee, #b8ead7)'}}>
      <div style={{position: 'absolute', top: 270, width: '100%', textAlign: 'center', transform: `scale(${cab})`}}>
        <Tag bg={C.greenDark} size={42}>
          A boa notícia
        </Tag>
      </div>
      <div style={{position: 'absolute', top: 390, left: 80, right: 80}}>
        <Cartao texto="Separar o lixo" p={a} />
        <Cartao texto="Economizar água" p={b} />
        <Cartao texto="Cobrar os políticos" p={d} />
        <Cartao texto="Entrar num mutirão" p={e} />
      </div>
      <div style={{position: 'absolute', top: 1000, left: 150, right: 150, background: C.ink, borderRadius: 30, padding: '22px 26px', textAlign: 'center', opacity: todo, transform: `scale(${0.8 + todo * 0.2})`}}>
        <div style={{fontFamily: FONT_TITLE, fontSize: 64, color: C.yellow, lineHeight: 1.05}}>TODO ATIVISTA COMEÇOU PEQUENO</div>
      </div>
    </Fill>
  );
};

/* ---------- 9. Final (23:59) ---------- */
export const Fim: React.FC<Props> = ({c}) => {
  const t = useSeconds();
  const q = usePop(em(c, 'qual'));
  return (
    <Fill style={{background: 'linear-gradient(#ffcf8f, #ffe9c7 40%, #c9ecff 70%)'}}>
      <Terra x={540} y={1500} r={560} giro={t * 0.6} />
      <Sol x={540} y={520} r={150} />
      <Ativista
        width={300}
        bracoD={150 + Math.sin(t * 10) * 18}
        humor={humorEm(t, [
          [0, 'feliz'],
          [em(c, 'qual'), 'confuso'],
        ])}
        style={{position: 'absolute', left: 540 - 150, top: 650}}
      />
      <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', transform: `scale(${q})`}}>
        <Tag bg={C.yellow} color={C.ink} size={48}>
          Comenta aqui ↓
        </Tag>
      </div>
    </Fill>
  );
};

/* ---------- 10. Créditos ---------- */
const NOMES = ['Bernardo Gomes', 'Gustavo', 'Bernardo Santana', 'Davi', 'Vinícius'];

export const Creditos: React.FC<Props> = () => {
  const t = useSeconds();
  const titulo = usePop(0.15);
  const rato = usePop(0.3, 10);
  return (
    <Underwater tint="#0b4f7d">
      <div style={{position: 'absolute', top: 230, width: '100%', textAlign: 'center', transform: `scale(${titulo})`}}>
        <div style={{fontFamily: FONT_TITLE, fontSize: 130, color: C.yellow, letterSpacing: 4, WebkitTextStroke: '12px #0d1b2a', paintOrder: 'stroke fill'}}>CRÉDITOS</div>
        <div style={{fontFamily: FONT_UI, fontWeight: 600, fontSize: 40, color: '#d7ecfa', marginTop: 6}}>Trabalho em grupo</div>
      </div>
      <div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center'}}>
        {NOMES.map((n, i) => {
          const p = fadeIn(t, 0.5 + i * 0.3, 0.4);
          return (
            <div key={n} style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 62, color: C.white, lineHeight: 1.45, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, textShadow: '0 6px 0 rgba(0,0,0,.3)'}}>
              {n}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 980, width: '100%', textAlign: 'center', opacity: fadeIn(t, 2.2), fontFamily: FONT_UI, fontWeight: 600, fontSize: 30, color: '#d7ecfa', lineHeight: 1.5}}>
        Narração: ElevenLabs (voz Gabriel)
        <br />
        Fontes: Green Belt Movement, Fridays for Future, ICMBio
      </div>
      <div style={{position: 'absolute', left: 540 - 270, top: 1110, width: 540, height: 661, opacity: rato, transform: `scale(${0.6 + rato * 0.4})`, transformOrigin: '50% 100%'}}>
        <OffthreadVideo src={staticFile('ratinho.webm')} transparent muted style={{width: 540, height: 661}} />
      </div>
      <Turtle width={220} flap={Math.sin(t * 6)} style={{position: 'absolute', top: 1690 + Math.sin(t * 2) * 10, left: interpolate(t, [0, 8], [-260, 1100])}} />
    </Underwater>
  );
};
