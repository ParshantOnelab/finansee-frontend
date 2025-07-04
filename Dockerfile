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
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
