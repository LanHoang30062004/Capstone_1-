# ------------------------------------
# STAGE 1: Build React App
# ------------------------------------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production version
RUN npm run build

# ------------------------------------
# STAGE 2: Serve app with Nginx
# ------------------------------------
FROM nginx:alpine

# Copy build output to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config (for React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
