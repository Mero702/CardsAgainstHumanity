FROM node:16-alpine

WORKDIR /usr/src/app

ENV PORT=8080

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "server.js" ]

EXPOSE 8080
