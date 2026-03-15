# Brevly (Web)

Frontend da aplicação de encurtador de URLs.

## O que faz

- Formulário para criar um link encurtado
- Lista de links já criados
- Redirecionamento via rota `/r/:shortUrl`
- Exporta CSV via API

## Como rodar

```bash
cd web
pnpm install
pnpm dev
```

Normalmente o app fica em `http://localhost:5173`.

## Configuração de ambiente

- `web/.env` pode ser usado para configurar a URL da API (se necessário).

## Estrutura principal

- `src/pages/Home.tsx` - página principal com lista e formulário
- `src/pages/Redirect.tsx` - rota de redirecionamento
- `src/http/` - cliente e chamadas HTTP para o backend

---

Projeto para fins educacionais.

