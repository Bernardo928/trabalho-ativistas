import React from 'react';
import {Composition} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import {DiaDeTartaruga} from './DiaDeTartaruga';
import {FPS, totalSeconds} from './timeline';
import {LinhaDoTempoMock} from './mockups/LinhaDoTempo';
import {TesteAtivista} from './ativista/Teste';
import {VideoAtivista} from './ativista/VideoAtivista';
import {duracaoTotal} from './ativista/linha';

export const Root: React.FC = () => (
  <>
  <Composition
    id="DiaDeTartaruga"
    component={DiaDeTartaruga}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={Math.ceil(totalSeconds() * FPS)}
  />
  <Composition id="DiaDeAtivista" component={VideoAtivista} width={1080} height={1920} fps={FPS} durationInFrames={Math.ceil(duracaoTotal() * FPS)} />
  <Composition id="TesteAtivista" component={TesteAtivista} width={1080} height={1920} fps={FPS} durationInFrames={1} />
  <Composition id="MockLinhaDoTempo" component={LinhaDoTempoMock} width={1080} height={1920} fps={FPS} durationInFrames={1} />
  </>
);
