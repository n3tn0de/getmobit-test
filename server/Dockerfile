FROM node:9
WORKDIR /usr/src/app
COPY . .
RUN npm i -g npm
RUN npm i -g nodemon
RUN npm i
CMD [ "npm", "run", "${SERVER_NPM_CMD:-start}" ]
