# Stage 1: Build app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN yarn build

# Stage 2: Run app (SSR server)
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000

CMD ["yarn", "start"]