import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Dinos, Fim, Hook, Luzes, Mar, Ninho, Plastico, Rede, Solucao} from './scenes';
import {FPS, Scene, SceneId, chunks, scenes} from './timeline';
import {C, FONT_TITLE, FONT_UI} from './ui';

const SCENE_COMPONENTS: Record<SceneId, React.FC<{s: Scene}>> = {
  hook: Hook,
  ninho: Ninho,
  luzes: Luzes,
  mar: Mar,
  plastico: Plastico,
  rede: Rede,
  dinos: Dinos,
  solucao: Solucao,
  fim: Fim,
};

const sceneAt = (t: number) => scenes.find((s) => t >= s.start && t < s.end) ?? scenes[scenes.length - 1];

// In-story clock pinned to the top, like a timestamp overlay.
const ClockBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const s = sceneAt(t);
  if (!s.clock) return null;
  const pop = spring({frame: frame - s.start * fps, fps, config: {damping: 10, mass: 0.5}});
  return (
    <div style={{position: 'absolute', top: 120, width: '100%', display: 'flex', justifyContent: 'center'}}>
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
        <span>DIA DE TARTARUGA</span>
        <span style={{background: C.ink, color: C.yellow, borderRadius: 999, padding: '4px 16px'}}>{s.clock}</span>
      </div>
    </div>
  );
};

// Karaoke captions: 1-3 words at a time, current word in yellow.
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const idx = chunks.findIndex((c, i) => t >= c.start && t < (chunks[i + 1]?.start ?? c.end + 1.2));
  if (idx < 0) return null;
  const c = chunks[idx];
  const pop = spring({frame: frame - c.start * fps, fps, config: {damping: 14, mass: 0.4}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 1300,
        left: 60,
        right: 60,
        textAlign: 'center',
        fontFamily: FONT_TITLE,
        fontSize: 112,
        lineHeight: 1.08,
        textTransform: 'uppercase',
        transform: `scale(${0.9 + pop * 0.1}) translateY(${(1 - pop) * 20}px)`,
      }}
    >
      {c.words.map((w, i) => {
        const active = t >= w.start;
        return (
          <span
            key={i}
            style={{
              color: active && t < w.end + 0.15 ? C.yellow : C.white,
              WebkitTextStroke: '16px #0d1b2a',
              paintOrder: 'stroke fill',
              textShadow: '0 8px 0 rgba(0,0,0,.35)',
              marginRight: 26,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const DiaDeTartaruga: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.ink, opacity: fadeOut}}>
      <Audio src={staticFile('narracao.mp3')} />
      {scenes.map((s) => {
        const Comp = SCENE_COMPONENTS[s.id];
        const from = Math.round(s.start * FPS);
        const dur = Math.max(1, Math.round(s.end * FPS) - from);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <Comp s={s} />
          </Sequence>
        );
      })}
      <ClockBadge />
      <Captions />
    </AbsoluteFill>
  );
};
