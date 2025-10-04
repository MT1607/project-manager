# Frontend Dockerfile using Nginx 
FROM node:20-alpine AS build 
WORKDIR /app 
# Copy package files 
COPY package.json ./ 
# Install dependencies (including dev dependencies for build) 
RUN yarn install --frozen-lockfile
# Copy source code 
COPY . . 
# Build the application 
RUN yarn build 
# Production stage 
FROM nginx:alpine 
# Copy built application from build stage 
# React Router builds to build/client for static assets 
COPY --from=build /app/build/client /usr/share/nginx/html
# Create nginx user 
RUN addgroup -g 101 -S nginx || true 
RUN adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true 
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]