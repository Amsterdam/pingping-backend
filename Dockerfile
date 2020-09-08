FROM node:10

# Create app directory
WORKDIR /app

ENV PORT=8000

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install

# Bundle app source
COPY .env /app/.env
COPY src /app/src
COPY tsconfig.json /app/tsconfig.json
COPY initialData.json /app/initialData.json

RUN yarn run build

EXPOSE 8000

CMD [ "npm", "run", "start:server" ]