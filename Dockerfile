FROM node:10

# Create app directory
WORKDIR /app

ENV PORT=8000
ENV NODE_ENV=production

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install

# Bundle app source
COPY src /app/src
COPY public /app/public
COPY admin /app/admin
COPY tsconfig.json /app/tsconfig.json
COPY initialData.json /app/initialData.json

RUN yarn run build

WORKDIR /app/admin
RUN yarn run build
WORKDIR /app

EXPOSE 8000

CMD [ "npm", "run", "start:server" ]