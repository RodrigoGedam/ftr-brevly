# Brevly

**Brevly** é uma aplicação de encurtador de URL com frontend em React (Vite) e backend em Fastify + Postgres.

## 🚀 O que o projeto faz

- Cria links encurtados a partir de URLs originais
- Redireciona a partir da URL encurtada para a original
- Lista todas as URLs cadastradas
- Deleta URLs
- Conta e atualiza acessos de cada link
- Exporta um relatório CSV com as URLs e contagem de acessos
- Gera e hospeda o CSV em uma storage (Cloudflare R2 no código atual)

---

## 📁 Estrutura principal

- `server/` — API (Fastify + Postgres + Drizzle ORM)
- `web/` — Frontend (React + Vite)

---

## ▶️ Como rodar (local)

### 1) Dependências

- Node.js 20+ (recomendado)
- pnpm (usado no projeto)
- Docker (para o Postgres local)

### 2) Iniciar banco de dados

```bash
cd server
docker compose up -d
```

### 3) Configurar variáveis de ambiente (backend)

Copie o arquivo `.env.example` para `.env` e preencha:

- `DATABASE_URL` (Postgres, ex: `postgres://docker:docker@localhost:5432/shortener`)
- `CLOUDFLARE_*` (para exportar o CSV via Cloudflare R2)

### 4) Rodar o servidor

```bash
cd server
pnpm install
pnpm dev
```

O servidor estará em `http://localhost:3333`.

### 5) Rodar o frontend

```bash
cd web
pnpm install
pnpm dev
```

O frontend costuma rodar em `http://localhost:5173`.

---

## 🧩 Endpoints principais (API)

| Método | Rota              | Descrição                                    |
| ------ | ----------------- | -------------------------------------------- |
| POST   | `/urls`           | Cria uma URL encurtada                       |
| GET    | `/urls`           | Lista todas as URLs                          |
| GET    | `/urls/:shortUrl` | Retorna a URL original e incrementa contador |
| DELETE | `/urls/:urlId`    | Deleta uma URL                               |
| POST   | `/urls/export`    | Gera e retorna URL do CSV                    |

> O projeto também expõe documentação Swagger (via Fastify) em runtime.

---

## 🧪 Testes

No backend há testes com Vitest:

```bash
cd server
pnpm test
```

---

## ⚙️ Observações

- O CSV exportado é enviado para o Cloudflare R2 (configurado via variáveis de ambiente).
- O banco é gerenciado via Drizzle ORM e migrations (pasta `server/src/infra/db/migrations`).

---

## 📌 Licença

Projeto para fins educacionais.
