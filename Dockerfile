FROM node:alpine

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm i

COPY src src
COPY public public
RUN npm run build

CMD [ "npm", "start" ]
