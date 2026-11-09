import words from './words.json';

export type Word = {text: string; start: number; end: number};
export const WORDS = words as Word[];
export const FPS = 30;
export const CREDITS_GAP = 1.4;
export const CREDITS_SECONDS = 5.5;

export const creditsStart = () => WORDS[WORDS.length - 1].end + CREDITS_GAP;
export const totalSeconds = () => creditsStart() + CREDITS_SECONDS;

export type SceneId =
  | 'hook'
  | 'ninho'
  | 'luzes'
  | 'mar'
  | 'plastico'
  | 'rede'
  | 'dinos'
  | 'solucao'
  | 'fim'
  | 'creditos';

// Each scene starts on the first spoken word that matches its anchor,
// searching forward from the previous scene. Time on the badge is the
// turtle's in-story clock.
const SCENES: {id: SceneId; anchor: string; clock: string | null}[] = [
  {id: 'hook', anchor: 'se', clock: null},
  {id: 'ninho', anchor: 'cinco', clock: '05:00'},
  {id: 'luzes', anchor: 'so', clock: '05:20'},
  {id: 'mar', anchor: 'sete', clock: '07:00'},
  {id: 'plastico', anchor: 'meiodia', clock: '12:00'},
  {id: 'rede', anchor: 'tres', clock: '15:00'},
  {id: 'dinos', anchor: 'dez', clock: '22:00'},
  {id: 'solucao', anchor: 'boa', clock: '22:30'},
  {id: 'fim', anchor: 'amanha', clock: '23:59'},
];

export const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export type Scene = {
  id: SceneId;
  clock: string | null;
  start: number;
  end: number;
};

export const scenes: Scene[] = (() => {
  const out: Scene[] = [];
  let from = 0;
  for (const s of SCENES) {
    let idx = WORDS.findIndex((w, i) => i >= from && norm(w.text) === s.anchor);
    if (idx < 0) idx = from;
    // "A boa notícia" starts on "A", one word before the anchor.
    const startIdx = s.id === 'solucao' ? Math.max(idx - 1, 0) : idx;
    out.push({id: s.id, clock: s.clock, start: s.id === 'hook' ? 0 : WORDS[startIdx].start, end: 0});
    from = idx + 1;
  }
  out.push({id: 'creditos', clock: null, start: creditsStart(), end: 0});
  for (let i = 0; i < out.length; i++) {
    out[i].end = i + 1 < out.length ? out[i + 1].start : totalSeconds();
  }
  return out;
})();

// Time (seconds) when a given word is spoken, searching from a scene start.
export const wordTime = (word: string, after = 0): number => {
  const w = WORDS.find((x) => x.start >= after && norm(x.text) === norm(word));
  return w ? w.start : after;
};

export type Chunk = {words: Word[]; start: number; end: number};

// Caption chunks: at most 3 words, break after sentence punctuation.
export const chunks: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
    cur = [];
  };
  for (const w of WORDS) {
    cur.push(w);
    if (cur.length >= 3 || /[.,!?:]$/.test(w.text)) flush();
  }
  flush();
  return out;
})();
