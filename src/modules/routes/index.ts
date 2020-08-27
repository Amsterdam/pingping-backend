import { GraphQLModule } from '@graphql-modules/core';
import { CommonModule } from '../common';
import AuthMiddleware from 'middleware/AuthMiddleware';
import { RouteProvider } from './RouteProvider';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

const resolvers = loadFilesSync(`${__dirname}/resolvers`);
const loadedFiles = loadFilesSync(`${__dirname}/schema/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);

export const RoutesModule = new GraphQLModule({
  imports: [CommonModule],
  providers: [RouteProvider],
  resolversComposition: {
    'Mutation.updateTask': [AuthMiddleware.isAuthenticated()],
    'Mutation.completeTask': [AuthMiddleware.isAuthenticated()],
    'Mutation.createRouteFeedback': [AuthMiddleware.isAuthenticated()],
    'Query.getRoutes': [AuthMiddleware.isAuthenticated()],
    'Query.getRoute': [AuthMiddleware.isAuthenticated()],
  },
  typeDefs,
  resolvers: mergeResolvers(resolvers),
});
