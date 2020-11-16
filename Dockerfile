FROM node:13.14.0-alpine

RUN apt-get -y install openssh-client
RUN ssh-keygen -q -t rsa -N '' -f /id_rsa

# Create app directory
WORKDIR /app
RUN npm install -g @vue/cli


ENV PORT=8000
ENV NODE_ENV=production

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
RUN NODE_ENV=development npm install
RUN npm run build
WORKDIR /app

EXPOSE 8000

CMD [ "npm", "run", "start:server" ]
