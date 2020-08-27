import 'graphql-import-node';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { AppModule } from './modules/app';
import InitialDataUtil from './utils/InitialDataUtil';
import { getContext as context } from 'lib/Context';

const { schema } = AppModule.forRoot({
  rewards: InitialDataUtil.getRewards(),
  routes: InitialDataUtil.getRoutes(),
});

function createServer() {
  const server = new ApolloServer({
    schema,
    context,
  });

  const app = express();
  server.applyMiddleware({ app, path: '/api' });

  return app;
}

export default createServer;
