FROM node:24-alpine AS base

RUN npm install -g pnpm

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN ./node_modules/.bin/esbuild src/infra/http/server.ts \
    --bundle \
    --platform=node \
    --format=esm \
    --outfile=dist/server.js \
    --external:postgres \
    --external:@aws-sdk/client-s3 \
    --external:@aws-sdk/lib-storage

FROM node:24-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

EXPOSE 3333

CMD ["node", "dist/server.js"]