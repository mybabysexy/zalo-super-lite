# Build stage
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Prune unnecessary files
RUN npm prune --production && \
    rm -rf node_modules/.cache && \
    rm -rf node_modules/.npm

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV production

# Create non-root user and set ownership
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    mkdir -p /usr/src/app && \
    chown -R nodejs:nodejs /usr/src/app

# Copy only necessary files from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/bin ./bin
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/public ./public
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/routes ./routes
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/views ./views
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/app.js ./

# Expose application port
EXPOSE 3000

# Switch to non-root user
USER nodejs

# Run the application
CMD [ "node", "./bin/www" ]
