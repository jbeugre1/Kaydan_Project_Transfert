# Stage 1: Build the React app
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (ci = déterministe, fait pour CI/CD)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy build output to Nginx html folder (Vite → dist, CRA → build)
COPY --from=build /app/dist /usr/share/nginx/html

# Config Nginx pour le routing SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]