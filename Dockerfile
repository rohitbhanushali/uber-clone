# Build stage
FROM node:lts-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy source code
COPY . .

# Create .env file with Firebase configuration
RUN echo "NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD8S6cXohln1R9Ru8BeB_okavtC3HtlTeU" > .env && \
    echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=uber-clone-4491b.firebaseapp.com" >> .env && \
    echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=uber-clone-4491b" >> .env && \
    echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=uber-clone-4491b.firebasestorage.ap" >> .env && \
    echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=870236846499" >> .env && \
    echo "NEXT_PUBLIC_FIREBASE_APP_ID=1:870236846499:web:15c2e61152915eb2d58216" >> .env && \
    echo "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-5QE8XMNGH0" >> .env && \
    echo "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoicm9oaXRiaGFudXNoYWxpMTEiLCJhIjoiY21heWVtMmdnMDBlODJrczdjbW5vZGg0NCJ9.TroIJ0zK2eT9N6RHSXOevQ" >> .env

# Build the application
RUN npm run build

# Production stage
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production --legacy-peer-deps --ignore-scripts

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]

