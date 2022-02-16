FROM node:12

# Create app directory
WORKDIR /app
COPY . /app/.
# RUN yarn config set "strict-ssl" false -g
RUN npm install
RUN npm install -g @vue/cli

ENV PORT=8000

# Admin Part
WORKDIR /app/admin
RUN yarn install
RUN yarn run build
WORKDIR /app

EXPOSE 8000

CMD [ "yarn", "start:server" ]
