FROM node:12

# Create app directory
WORKDIR /app
COPY . /app/.
RUN yarn install
RUN npm install -g @vue/cli

ENV PORT=8000
COPY package.json /app/package.json

RUN yarn build

# Admin Part
WORKDIR /app/admin
RUN npm install
WORKDIR /app

EXPOSE 8000

CMD [ "yarn", "start:server" ]