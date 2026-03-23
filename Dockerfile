FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json

RUN npm install

COPY . .

RUN npm run build -w @kq/web

EXPOSE 3000
CMD ["npm", "run", "start", "-w", "@kq/web"]
