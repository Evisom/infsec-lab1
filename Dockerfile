FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

ENV HUSKY=0

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev

COPY . .

USER node

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["node", "src/server.js"]
