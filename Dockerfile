# Stage 1: Build the React App
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .
# Build the application
RUN npm run build

# Stage 2: Serve the App using Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from Stage 1 to Nginx default folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
