FROM node:12

# Create app directory
WORKDIR /app
COPY . /app/.
RUN yarn config set "strict-ssl" false -g
RUN yarn install
RUN npm install -g @vue/cli

ENV PORT=8000
COPY package.json /app/package.json

# Admin Part
WORKDIR /app/admin
RUN yarn install
RUN yarn build
WORKDIR /app

EXPOSE 8000

CMD [ "yarn", "start:server" ]