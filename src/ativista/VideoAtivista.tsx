import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_TITLE, FONT_UI} from '../ui';
import {Abertura, Creditos, Denuncia, Fim, Legado, Perigo, Plantar, Praia, Protesto, Solucao} from './cenas';
import {Cena, CenaId, FPS, blocos, cenas} from './linha';

const COMPONENTES: Record<CenaId, React.FC<{c: Cena}>> = {
  abertura: Abertura,
  praia: Praia,
  plantar: Plantar,
  protesto: Protesto,
  denuncia: Denuncia,
  perigo: Perigo,
  legado: Legado,
  solucao: Solucao,
  fim: Fim,
  creditos: Creditos,
};

const cenaEm = (t: number) => cenas.find((c) => t >= c.inicio && t < c.fim) ?? cenas[cenas.length - 1];

// Relógio da história preso no topo.
const Relogio: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const c = cenaEm(t);
  if (!c.relogio) return null;
  const pop = spring({frame: frame - c.inicio * fps, fps, config: {damping: 10, mass: 0.5}});
  return (
    <div style={{position: 'absolute', top: 110, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: C.white,
          color: C.ink,
          borderRadius: 999,
          padding: '14px 30px',
          fontFamily: FONT_UI,
          fontWeight: 800,
          fontSize: 38,
          boxShadow: '0 8px 0 rgba(0,0,0,.25)',
          transform: `scale(${0.85 + pop * 0.15})`,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="17" fill="none" stroke={C.ink} strokeWidth="4" />
          <path d="M20 10 V20 L27 24" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
        <span>DIA DE ATIVISTA</span>
        <span style={{background: C.ink, color: C.yellow, borderRadius: 999, padding: '4px 16px'}}>{c.relogio}</span>
      </div>
    </div>
  );
};

// Frases longas encolhem para caber em até duas linhas.
const tamanho = (texto: string) => (texto.length <= 16 ? 112 : texto.length <= 22 ? 98 : 86);

// Legenda karaokê: 1 a 3 palavras, a palavra falada em amarelo.
const Legendas: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const idx = blocos.findIndex((b, i) => t >= b.inicio && t < (blocos[i + 1]?.inicio ?? b.fim + 1.2));
  if (idx < 0) return null;
  const b = blocos[idx];
  const pop = spring({frame: frame - b.inicio * fps, fps, config: {damping: 14, mass: 0.4}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 1300,
        left: 60,
        right: 60,
        textAlign: 'center',
        fontFamily: FONT_TITLE,
        fontSize: tamanho(b.palavras.map((w) => w.text).join(' ')),
        lineHeight: 1.08,
        textTransform: 'uppercase',
        transform: `scale(${0.9 + pop * 0.1}) translateY(${(1 - pop) * 20}px)`,
      }}
    >
      {b.palavras.map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 ? ' ' : null}
          <span
            style={{
              color: t >= w.start && t < w.end + 0.15 ? C.yellow : C.white,
              WebkitTextStroke: '16px #0d1b2a',
              paintOrder: 'stroke fill',
              textShadow: '0 8px 0 rgba(0,0,0,.35)',
            }}
          >
            {w.text}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export const VideoAtivista: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fim = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.ink, opacity: fim}}>
      <Audio src={staticFile('narracao-ativista.mp3')} />
      {cenas.map((c) => {
        const Comp = COMPONENTES[c.id];
        const de = Math.round(c.inicio * FPS);
        const dur = Math.max(1, Math.round(c.fim * FPS) - de);
        return (
          <Sequence key={c.id} from={de} durationInFrames={dur} name={c.id}>
            <Comp c={c} />
          </Sequence>
        );
      })}
      <Relogio />
      <Legendas />
    </AbsoluteFill>
  );
};
