import { GraphQLModule } from '@graphql-modules/core';
import { loadResolversFiles, loadSchemaFiles } from 'graphql-toolkit';
import { CommonModule } from '../common';
import { context } from 'lib/Context';
import AuthMiddleware from 'middleware/AuthMiddleware';

export const RoutesModule = new GraphQLModule({
  imports: [CommonModule],
  providers: [],
  resolversComposition: {
    'Mutation.updateTask': [AuthMiddleware.isAuthenticated()],
  },
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/'),
  context,
});
