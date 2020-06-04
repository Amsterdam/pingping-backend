import 'graphql-import-node';
import { GraphQLServer } from 'graphql-yoga';
import { AppModule } from './modules/app';
import { ModuleContext } from '@graphql-modules/core';
import InitialDataUtil from './utils/InitialDataUtil';

const context = async ({ request }: any): Promise<ModuleContext> => {
  return { req: request, user: null, injector: null } as ModuleContext;
};

const { schema } = AppModule.forRoot({
  rewards: InitialDataUtil.getRewards(),
});

function createServer() {
  return new GraphQLServer({
    schema,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context,
  });
}

export default createServer;
