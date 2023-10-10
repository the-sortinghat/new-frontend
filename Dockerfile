FROM node:17.0.0-alpine

WORKDIR /home/node/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

USER node

CMD npm start
