# Build stage
FROM node:18.19-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with exact versions for reproducibility
RUN npm ci --legacy-peer-deps

# Copy prisma schema for generation
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copy Prisma client and schema
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Set the environment variable for the port
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server.js"]
