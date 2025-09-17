- Jéssica Flauzino - RM562973
- Davi Duarte – RM 566316
- Kauã Carvalho – RM 566371
- Leonardo Lopes – RM 561349
- Matheus Brasil – RM 561456

# Passa a Bola — Frontend (Vite + React + HeroUI + Tailwind)

Aplicação web para inscrição e gerenciamento de campeonatos. Usuários entram em campeonatos, veem seus jogos; administradores criam campeonatos, fecham inscrições, agendam partidas e lançam placares.

## Visão Geral

- Frontend SPA com Vite + React + TypeScript.
- UI com HeroUI e Tailwind CSS.
- Autenticação por JWT (token salvo no `localStorage` como `access_token`).
- Proteção de rotas:
  - Usuários autenticados: páginas de campeonatos e jogos.
  - Administradores: páginas de administração (campeonatos, jogos).
- Integração com backend (FastAPI), via `VITE_API_URL`.

## Requisitos

- Node.js 18+ (recomendado LTS).
- npm 9+.
- Backend HTTP disponível em /server
- Navegador moderno.

## Comece Rápido

1) Instalar dependências:
```
npm install
```
2) Configurar variáveis de ambiente (crie `.env` na raiz do projeto):
```
# URL do backend (FastAPI). http://localhost:8000
VITE_API_URL=http://localhost:8000
```
3) Rodar em desenvolvimento:
```
npm run dev
```
- Acesse: http://localhost:5173

4) Build de produção:
```
npm run build
npm run preview
```
- Preview em: http://localhost:4173

## Scripts úteis

- `npm run dev` — ambiente de desenvolvimento.
- `npm run build` — build de produção.
- `npm run preview` — servidor local para testar o build.
- `npm run lint` — lint (ESLint).
- `npm run format` — formatação (Prettier).

## Configuração de Autenticação

- O frontend espera um JWT salvo em `localStorage` como `access_token` após login.
- Para exibir ações de admin no UI, define-se `role` no `localStorage` (valor `"admin"`). As rotas são protegidas de qualquer forma (guards no frontend e no backend).
- A navegação para rotas protegidas sem token redireciona para `/login` (implemente o fluxo de login conforme seu backend).

Exemplos de chaves no `localStorage`:
```
access_token = <jwt>
role = admin | user
```
## Rotas da Aplicação (Frontend)

- Públicas:
  - `/` — Landing page.
- Autenticadas (usuário):
  - `/dashboard` — Hub principal com links rápidos.
  - `/championships` — Lista campeonatos abertos e permite entrar.
  - `/me/games/upcoming` — Próximos jogos do usuário.
  - `/me/games/completed` — Jogos concluídos do usuário.
- Admin:
  - `/admin/championships` — Lista/criação de campeonatos.
  - `/admin/championships/:id` — Detalhe do campeonato; fechar inscrições/gerar jogos.
  - `/admin/games/:id` — Agendar data/local e lançar placar.

## Fluxos Principais

- Usuário:
  1. Acessa `/championships`, encontra campeonatos abertos.
  2. Clica em “Entrar” para participar.
  3. Vê jogos em `/me/games/upcoming` e resultados em `/me/games/completed`.

- Admin:
  1. Cria campeonato em `/admin/championships` definindo “jogadores por time”.
  2. Quando desejar, fecha inscrições em `/admin/championships/:id` (backend gera jogos).
  3. Agenda partidas em `/admin/games/:id` (data/local).
  4. Lança placares em `/admin/games/:id` (partida é concluída e o sistema avança a chave).
  5. Ao finalizar todas as partidas, o campeonato fica “completed”.

## Integração com Backend

O front chama as seguintes rotas no backend, após cadastro e login (FastAPI) (resumo):

- Autenticados (usuário/admin):
  - `POST /championships/{id}/join`
  - `GET /me/games?status=upcoming|completed&page=&page_size=`

- Admin:
  - `POST /championships` (body: `{ players_per_team, name? }`)
  - `POST /championships/{id}/close_signups`
  - `PATCH /games/{id}/schedule` (body: `{ date, location }`)
  - `PATCH /games/{id}/score` (body: `{ home_score, away_score }`)
  - `GET /championships/{id}/games`, `GET /games/{id}`

O frontend envia `Authorization: Bearer <token>` quando `access_token`.

## Variáveis de Ambiente

- `VITE_API_URL` — URL base do backend (ex.: `http://localhost:8000`).