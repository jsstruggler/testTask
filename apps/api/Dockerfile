FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json yarn.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-types/src ./packages/shared-types/src
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/tsconfig/*.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/
RUN yarn install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn workspace @kb/api prisma:generate
RUN yarn workspace @kb/api build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy the entire workspace to preserve symlinks and unhoisted node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/packages ./packages

# Create data directory and set permissions so the named volume inherits them
RUN mkdir -p /app/apps/api/prisma/data && chown -R nestjs:nodejs /app/apps/api/prisma

USER nestjs

EXPOSE 3001

WORKDIR /app/apps/api
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && yarn run prisma:seed && node dist/main"]
