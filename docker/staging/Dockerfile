# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base
LABEL maintainer="Your Name <your.email@example.com>"
LABEL description="Staging image for Next.js application"

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json yarn.lock* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then \
  echo "Installing dependencies with yarn..." && \
  yarn install --frozen-lockfile --production=true; \
  elif [ -f package-lock.json ]; then \
  echo "Installing dependencies with npm..." && \
  npm ci --only=production; \
  elif [ -f pnpm-lock.yaml ]; then \
  echo "Installing dependencies with pnpm..." && \
  corepack enable pnpm && pnpm i --frozen-lockfile --prod; \
  else \
  echo "No lock file found. Please provide yarn.lock, package-lock.json, or pnpm-lock.yaml" && \
  exit 1; \
  fi


# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set default environment variables for build time
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME=$NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME
ENV NODE_ENV=production

# Create env file during build
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.staging
RUN echo "NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME=$NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME" >> .env.staging

# Build the application
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Set default environment variables for runtime
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME=$NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
