import React from 'react';
import {Ativista, Humor, Item} from './Ativista';

const HUMORES: Humor[] = ['feliz', 'orgulhoso', 'triste', 'assustado', 'chocado', 'aliviado', 'determinado', 'confuso', 'cansado'];
const POSES: {item: Item; bracoD: number}[] = [
  {item: 'saco', bracoD: 10},
  {item: 'muda', bracoD: 40},
  {item: 'placa', bracoD: 150},
  {item: 'celular', bracoD: 120},
];

export const TesteAtivista: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: '#e9f5ee', display: 'flex', flexWrap: 'wrap', gap: 10, padding: 30, alignContent: 'flex-start'}}>
    {HUMORES.map((h) => (
      <div key={h} style={{width: 320, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 28, marginTop: 40}}>
        <Ativista width={190} humor={h} />
        <div>{h}</div>
      </div>
    ))}
    {POSES.map((p) => (
      <div key={p.item} style={{width: 240, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: 28, marginTop: 140}}>
        <Ativista width={170} item={p.item} bracoD={p.bracoD} humor="determinado" />
        <div>{p.item}</div>
      </div>
    ))}
  </div>
);
