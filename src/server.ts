import 'graphql-import-node';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { AppModule } from './modules/app';
import { ModuleContext } from '@graphql-modules/core';
import InitialDataUtil from './utils/InitialDataUtil';

const context = async (context: any): Promise<ModuleContext> => {
  return context as ModuleContext;
};

const { schema } = AppModule.forRoot({
  rewards: InitialDataUtil.getRewards(),
  routes: InitialDataUtil.getRoutes(),
});

function createServer() {
  const server = new ApolloServer({
    schema,
    // resolverValidationOptions: {
    //   requireResolversForResolveType: false,
    // },
    context,
  });

  const app = express();
  server.applyMiddleware({ app, path: '/' });

  return app;
}

export default createServer;
