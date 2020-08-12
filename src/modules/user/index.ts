import { GraphQLModule } from '@graphql-modules/core';
import { loadSchemaFiles, loadResolversFiles } from 'graphql-toolkit';
import AuthMiddleware from 'middleware/AuthMiddleware';
import { RewardsModule } from 'modules/rewards/index';
import { RoutesModule } from 'modules/routes/index';
import { CommonModule } from 'modules/common/index';

export const UserModule = new GraphQLModule({
  imports: [CommonModule, RoutesModule, RewardsModule],
  providers: [],
  resolversComposition: {
    'Query.getStatus': [AuthMiddleware.isAuthenticated()],
    'Mutation.createGoal': [AuthMiddleware.isAuthenticated()],
    'Mutation.deleteUser': [AuthMiddleware.isAuthenticated()],
  },
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/'),
});
