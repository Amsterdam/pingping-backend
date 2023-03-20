FROM node:14

# Create app directory
WORKDIR /app
COPY . /app/.
COPY init.sh /usr/local/bin/
RUN chmod u+x /usr/local/bin/init.sh
RUN yarn config set "strict-ssl" false -g
RUN yarn install
RUN yarn global add @vue/cli

ENV NODE_ENV=production

ENV PORT=8000

# Admin Part
WORKDIR /app/admin
RUN yarn install
RUN yarn build --base=/admin/.
WORKDIR /app

EXPOSE 8000

ENTRYPOINT ["init.sh"]
