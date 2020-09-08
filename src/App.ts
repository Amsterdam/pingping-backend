import _ from 'lodash';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import boot from './boot';
import { AppModule } from 'modules/app';
import { getContext as context } from 'lib/Context';

import { ApolloServerPlugin } from 'apollo-server-plugin-base';

import { GraphQLRequestContext } from 'apollo-server-types';
import { GraphQLRequestListener } from 'apollo-server-plugin-base/src/index';

export const LogPlugin: ApolloServerPlugin = {
  requestDidStart<TContext>(_: GraphQLRequestContext<TContext>): GraphQLRequestListener<TContext> {
    return {
      didEncounterErrors(context) {
        console.log('error:', context.errors);
      },
    };
  },
};

export class App {
  public app: any;
  public server: any;

  constructor() {
    this.app = express();
    boot.start();

    const { schema } = AppModule.forRoot({ layouts: [] });
    this.server = new ApolloServer({
      schema,
      context,
      plugins: [LogPlugin],
    });

    this.app.use(express.static('public'));
    this.registerStatusHealthRoute();
    this.server.applyMiddleware({ app: this.app, path: '/api' });
  }

  registerStatusHealthRoute() {
    this.app.get('/status/health', (req: any, res: any) => {
      res.send('OK');
    });
  }
}

export default new App().app;
