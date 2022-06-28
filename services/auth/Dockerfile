FROM node:18-alpine3.15

WORKDIR /app

COPY ./package*.json ./tsconfig.json ./

RUN npm install

RUN npm install pm2 -g

COPY ./src .src

RUN npm run build

CMD [ "pm2-runtime", "dist/src/server.js" ]