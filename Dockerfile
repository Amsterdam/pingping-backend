FROM node:lts-alpine

# Create app directory
WORKDIR /app
COPY . /app/.
# RUN yarn config set "strict-ssl" false -g
RUN npm install
RUN npm install -g @vue/cli

ENV PORT=8000
COPY package.json /app/package.json

# Admin Part
WORKDIR /app/admin
RUN npm install
RUN npm run build
WORKDIR /app

EXPOSE 8000

CMD [ "npm", "run", "start:server" ]