import React from 'react';
import {Composition} from 'remotion';
import '@fontsource/anton/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import {DiaDeTartaruga} from './DiaDeTartaruga';
import {FPS, totalSeconds} from './timeline';
import {LinhaDoTempoMock} from './mockups/LinhaDoTempo';

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
  <Composition id="MockLinhaDoTempo" component={LinhaDoTempoMock} width={1080} height={1920} fps={FPS} durationInFrames={1} />
  </>
);
