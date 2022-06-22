import _ from 'lodash';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import boot from './boot';
import { AppModule } from 'modules/app';
import { getContext as context } from 'lib/Context';

import { ApolloServerPlugin } from 'apollo-server-plugin-base';

import { GraphQLRequestContext } from 'apollo-server-types';
import { GraphQLRequestListener } from 'apollo-server-plugin-base/src/index';
import { AuditLog } from 'models/AuditLog';
import { User } from 'models/User';

export const LogPlugin: ApolloServerPlugin = {
  async requestDidStart<TContext>(_: GraphQLRequestContext<TContext>): GraphQLRequestListener<TContext> {
    const user = await User.findOne({});
    await AuditLog.create({ user: user._id, type: 'requestDidStart', dataSet: 'none', description: JSON.stringify(_.query), linkId: 'log' });
    return {
      didEncounterErrors(context: any) {
        console.info('error:', context.errors);
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
