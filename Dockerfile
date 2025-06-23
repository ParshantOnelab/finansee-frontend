# --- Frontend Stage: Build React App ---
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve using `serve`
FROM node:20

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

# Use $PORT for Google Cloud compatibility
ENV PORT=8080

CMD ["serve", "-s", "dist", "-l", "8080"]
