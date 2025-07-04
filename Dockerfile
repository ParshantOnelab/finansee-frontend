# Use official Node image (LTS version)
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and lock file separately for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build the Vite app
RUN npm run build

# Install a lightweight static file server
RUN npm install -g serve

# Cloud Run assigns a port to the container, passed via $PORT
ENV PORT=8080

# Expose that port (not required by Cloud Run but good for local)
EXPOSE 8080

# Use serve to serve the static build
CMD ["serve", "-s", "dist", "-l", "8080"]
