# Brevly (Server)

API do encurtador de URLs (Fastify + Postgres + Drizzle ORM).

## O que faz

- Cria links encurtados
- Retorna a URL original ao acessar o short URL
- Lista e deleta URLs
- Contabiliza acessos
- Exporta um CSV com as URLs e contagem de acessos

## Como rodar

```bash
cd server
pnpm install
pnpm dev
```

O servidor roda em `http://localhost:3333` (configurável via `PORT`).

## Variáveis de ambiente

Baseie-se em `server/.env.example` e configure:

- `DATABASE_URL` (Postgres)
- `CLOUDFLARE_*` (para exportar CSV via Cloudflare R2)

## Endpoints principais

- `POST /urls` — cria um link encurtado
- `GET /urls` — lista todas as URLs
- `GET /urls/:shortUrl` — retorna a URL original e incrementa contador
- `DELETE /urls/:urlId` — deleta uma URL
- `POST /urls/export` — gera e retorna a URL do CSV

## Testes

```bash
pnpm test
```
