# Revisão de acessibilidade — "Se você passasse um dia como uma tartaruga"

**Padrão:** WCAG 2.1 AA, adaptado para vídeo · **Data:** 09/11/2026 · Skill `design:accessibility-review`

Vídeo não tem teclado, foco nem formulários. Os critérios de "Operável" e "Robusto" não se aplicam.
Os que importam aqui: legendas, contraste, flashes e texto legível no celular.

## Resumo
**Problemas encontrados:** 3 · **Críticos:** 1 · **Maiores:** 1 · **Menores:** 1 — todos corrigidos.

## Achados
| # | Problema | Critério | Gravidade | Correção |
|---|---|---|---|---|
| 1 | Texto branco sobre verde `#22c55e` ("A boa notícia" e ✓) com 2,28:1 | 1.4.3 Contraste | 🔴 Crítico | Verde do fundo virou `#15803d` (5,02:1) |
| 2 | Legenda só gravada na imagem: não dá para ligar/desligar nem ler em leitor de tela | 1.2.2 Legendas | 🟡 Maior | Arquivo `entrega/dia-de-tartaruga.srt` gerado dos tempos por palavra |
| 3 | Branco sobre vermelho `#ef3e36` com 3,88:1 (passa só como texto grande) | 1.4.3 Contraste | 🟢 Menor | Vermelho virou `#dc2626` (4,83:1) |

## Contraste (calculado)
| Elemento | Texto | Fundo | Razão | Mínimo | Passa? |
|---|---|---|---|---|---|
| Legenda branca | `#ffffff` | contorno `#0d1b2a` | 17,39:1 | 4,5:1 | ✅ |
| Palavra falada (amarela) | `#ffd23f` | contorno `#0d1b2a` | 12,05:1 | 4,5:1 | ✅ |
| Selos de ameaça | `#ffffff` | `#dc2626` | 4,83:1 | 4,5:1 | ✅ |
| Selos de solução | `#ffffff` | `#15803d` | 5,02:1 | 4,5:1 | ✅ |
| Relógio | `#0d1b2a` | `#ffffff` | 17,39:1 | 4,5:1 | ✅ |
| Linha do tempo (rótulos) | `#cfe3ff` | `#0f1726` | 13,74:1 | 4,5:1 | ✅ |
| "passado / hoje" | `#8aa0bf` | `#0f1726` | 6,71:1 | 4,5:1 | ✅ |

A legenda usa contorno escuro de 16 px. Por isso o contraste vale sobre qualquer cenário (praia, mar, céu).

## Outros critérios
- **2.3.1 Três flashes:** nenhum flash. Os postes acendem uma única vez em 0,25 s.
- **1.2.5 Audiodescrição:** a narração já descreve a ação de cada cena.
- **Tamanho de texto:** legenda com 112 px e selos de 36 a 56 px numa tela de 1080 px. No celular, isso fica acima de 16 pt.
- **Área segura:** legenda termina por volta de y=1560. A faixa de baixo fica livre para a descrição e os botões do TikTok.
