# Base image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies and build
RUN npm install && npm run build

# Serve the app with a lightweight static server
FROM nginx:alpine

# ✅ Replace default nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# ✅ Copy built files to web root
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Must expose port 8080 for Cloud Run
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
