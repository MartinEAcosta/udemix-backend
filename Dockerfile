FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . . 

RUN npm run build

# ETAPA 2 : RUNNER 

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist 

EXPOSE 4201

USER node 

CMD ["node", "dist/app.js"]