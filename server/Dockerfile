FROM node:9
WORKDIR /usr/src/app
COPY . .
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm i
CMD [ "npm", "run", "${SERVER_NPM_CMD:-start}" ]
