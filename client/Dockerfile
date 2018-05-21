FROM node:9
WORKDIR /usr/src/app
RUN ln -s /usr/bin/nodejs /usr/bin/node
COPY package.json .
COPY package-lock.json .
RUN npm i
COPY . .
CMD [ "npm", "run", "${CLIENT_NPM_CMD:-start}" ]
