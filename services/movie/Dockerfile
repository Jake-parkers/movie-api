FROM node:18-alpine3.15

WORKDIR /app

COPY ./package.json ./package-lock.json ./tsconfig.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

RUN npm run build

CMD [ "pm2-runtime", "/app/dist/server.js"]