# ==============================================================================
# STAGE 1: Build Stage
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency configuration files first for efficient Docker layer caching
COPY package.json ./

# Install all dependencies (including devDependencies required for compilation)
RUN npm install

# Copy all source files
COPY . .

# Run production build (compiles Vite frontend assets and bundles server.ts)
RUN npm run build

# ==============================================================================
# STAGE 2: Production Runtime Stage
# ==============================================================================
FROM node:20-alpine AS runner

# Use production environment
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Copy package.json to manage production-only dependencies
COPY package.json ./

# Install only production dependencies to keep the image slim and secure
RUN npm install --omit=dev

# Copy compiled frontend assets and backend bundle from builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root group and user, change file ownership for safety
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose the application port
EXPOSE 3000

# Start the application using the production script
CMD ["npm", "start"]
