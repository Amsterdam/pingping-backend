import 'graphql-import-node';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { AppModule } from './modules/app';
import InitialDataUtil from './utils/InitialDataUtil';
import { getContext as context } from 'lib/Context';
import path from 'path';

import { ApolloServerPlugin } from 'apollo-server-plugin-base';

import { GraphQLRequestContext } from 'apollo-server-types';
import { GraphQLRequestListener } from 'apollo-server-plugin-base/src/index';

export const LogPlugin: ApolloServerPlugin = {
  requestDidStart<TContext>(_: GraphQLRequestContext<TContext>): GraphQLRequestListener<TContext> {
    return {
      didEncounterErrors(context) {
        console.log('didEncounterErrors', context.errors);
      },
    };
  },
};

const { schema } = AppModule.forRoot({
  rewards: InitialDataUtil.getRewards(),
  routes: InitialDataUtil.getRoutes(),
});

function createServer() {
  const server = new ApolloServer({
    schema,
    context,
    plugins: [LogPlugin],
  });

  const app = express();
  server.applyMiddleware({ app, path: '/api' });
  app.use(express.static(__dirname + '/../public'));

  return app;
}

export default createServer;
