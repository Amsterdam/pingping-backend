FROM node:14

# Create app directory
WORKDIR /app
RUN npm install -g @vue/cli

ENV PORT=8000
COPY package.json /app/package.json
# COPY yarn.lock /app/yarn.lock

RUN npm install

# Bundle app source
COPY src /app/src
COPY public /app/public
COPY admin /app/admin
COPY tsconfig.json /app/tsconfig.json
COPY initialData.json /app/initialData.json

RUN npm run build

# Admin Part
WORKDIR /app/admin
RUN npm install
RUN npm run build
WORKDIR /app

EXPOSE 8000

CMD [ "npm", "run", "start:server" ]
