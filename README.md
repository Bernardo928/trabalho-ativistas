# Se você passasse um dia como uma tartaruga

Vídeo vertical (1080x1920, 83 s, com créditos no final) para o trabalho de ciências sobre meio ambiente.

- **Vídeo pronto:** `entrega/dia-de-tartaruga.mp4`
- **Legendas separadas:** `entrega/dia-de-tartaruga.srt`
- **Roteiro e voz:** narração gerada no ElevenLabs com a voz "Gabriel - Shorts & Reels"
- **Revisões:** `docs/critica-design.md` e `docs/acessibilidade.md`

## Como o vídeo é feito

| Etapa | Ferramenta | Arquivo |
|---|---|---|
| Narração | ElevenLabs (voz Gabriel, modelo eleven_v4) | `public/narracao.mp3` |
| Tempo de cada palavra | ElevenLabs Scribe | `src/words.json` |
| Cenas e animação | Remotion (React) | `src/` |
| Legenda `.srt` | Python | `scripts/gerar-srt.py` |
| Volume e exportação final | FFmpeg | comando abaixo |

## Gerar de novo

```bash
npm install
npx remotion studio                      # abre o editor para ver as cenas
npx remotion render DiaDeTartaruga out/render.mp4
ffmpeg -i out/render.mp4 -c:v libx264 -crf 20 -pix_fmt yuv420p \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart entrega/dia-de-tartaruga.mp4
python3 scripts/gerar-srt.py
```

O `remotion.config.ts` aponta para o Chromium em `/opt/pw-browsers`.
Em outro computador, defina `REMOTION_CHROME` com o caminho do Chrome ou apague essa linha.

## Fontes dos dados citados

- Filhotes seguem o brilho da lua no mar; luz artificial na praia desorienta (Projeto Tamar).
- Cerca de 1 em cada 1.000 filhotes chega à vida adulta (estimativa usada pelo Projeto Tamar).
- Tartarugas confundem sacolas plásticas com águas-vivas.
- Tartarugas marinhas existem há mais de 100 milhões de anos.
- Projeto Tamar: mais de 40 milhões de filhotes protegidos até o mar desde 1980.
