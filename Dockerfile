FROM node:12

# Create app directory
WORKDIR /app
COPY . /app/.
RUN yarn config set "strict-ssl" false -g
RUN yarn install
RUN yarn global add @vue/cli

ENV PORT=8000

# Admin Part
WORKDIR /app/admin
RUN yarn install
RUN yarn run build
WORKDIR /app

EXPOSE 8000

ENTRYPOINT ["init.sh"]
