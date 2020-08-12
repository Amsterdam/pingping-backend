import { GraphQLModule } from '@graphql-modules/core';
import { loadResolversFiles, loadSchemaFiles } from 'graphql-toolkit';
import { CommonModule } from '../common';
import { context } from 'lib/Context';
import AuthMiddleware from 'middleware/AuthMiddleware';
import { RouteProvider } from './RouteProvider';
import * as Resolvers from './resolvers/Response';

export const RoutesModule = new GraphQLModule({
  imports: [CommonModule],
  providers: [RouteProvider],
  resolversComposition: {
    'Mutation.updateTask': [AuthMiddleware.isAuthenticated()],
    'Mutation.createRouteFeedback': [AuthMiddleware.isAuthenticated()],
  },
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/'),
  context,
});
