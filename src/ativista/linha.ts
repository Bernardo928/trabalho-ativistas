import palavras from './palavras.json';
import {norm} from '../timeline';

export type Palavra = {text: string; start: number; end: number};
export const PALAVRAS = palavras as Palavra[];
export const FPS = 30;
export const CREDITOS_ESPACO = 1.4;
export const CREDITOS_SEGUNDOS = 8;

export const inicioCreditos = () => PALAVRAS[PALAVRAS.length - 1].end + CREDITOS_ESPACO;
export const duracaoTotal = () => inicioCreditos() + CREDITOS_SEGUNDOS;

export type CenaId =
  | 'abertura'
  | 'praia'
  | 'plantar'
  | 'protesto'
  | 'denuncia'
  | 'perigo'
  | 'legado'
  | 'solucao'
  | 'fim'
  | 'creditos';

export type Cena = {id: CenaId; relogio: string | null; inicio: number; fim: number};

// Cada cena começa na primeira palavra que bate com a âncora, procurando
// sempre depois da cena anterior. O relógio mostra a hora da história.
const ROTEIRO: {id: CenaId; ancora: string; relogio: string | null; voltaUma?: boolean}[] = [
  {id: 'abertura', ancora: 'se', relogio: null},
  {id: 'praia', ancora: 'seis', relogio: '06:00'},
  {id: 'plantar', ancora: 'nove', relogio: '09:00'},
  {id: 'protesto', ancora: 'meiodia', relogio: '12:00'},
  {id: 'denuncia', ancora: 'tres', relogio: '15:00'},
  {id: 'perigo', ancora: 'seis', relogio: '18:00'},
  {id: 'legado', ancora: 'dez', relogio: '22:00'},
  {id: 'solucao', ancora: 'boa', relogio: '22:30', voltaUma: true},
  {id: 'fim', ancora: 'amanha', relogio: '23:59'},
];

export const cenas: Cena[] = (() => {
  const out: Cena[] = [];
  let de = 0;
  for (const c of ROTEIRO) {
    let idx = PALAVRAS.findIndex((w, i) => i >= de && norm(w.text) === c.ancora);
    if (idx < 0) idx = de;
    const comeco = c.voltaUma ? Math.max(idx - 1, 0) : idx;
    out.push({id: c.id, relogio: c.relogio, inicio: c.id === 'abertura' ? 0 : PALAVRAS[comeco].start, fim: 0});
    de = idx + 1;
  }
  out.push({id: 'creditos', relogio: null, inicio: inicioCreditos(), fim: 0});
  for (let i = 0; i < out.length; i++) out[i].fim = i + 1 < out.length ? out[i + 1].inicio : duracaoTotal();
  return out;
})();

/** Momento (s) em que uma palavra é dita, procurando a partir de `depois`. */
export const quando = (palavra: string, depois = 0): number => {
  const w = PALAVRAS.find((x) => x.start >= depois && norm(x.text) === norm(palavra));
  return w ? w.start : depois;
};

export type Bloco = {palavras: Palavra[]; inicio: number; fim: number};

// Blocos de legenda: até 3 palavras, quebra depois de pontuação.
export const blocos: Bloco[] = (() => {
  const out: Bloco[] = [];
  let cur: Palavra[] = [];
  const fecha = () => {
    if (cur.length) out.push({palavras: cur, inicio: cur[0].start, fim: cur[cur.length - 1].end});
    cur = [];
  };
  for (const w of PALAVRAS) {
    cur.push(w);
    if (cur.length >= 3 || /[.,!?:]$/.test(w.text)) fecha();
  }
  fecha();
  return out;
})();
