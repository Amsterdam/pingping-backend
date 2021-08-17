import { GraphQLModule } from '@graphql-modules/core';
import AuthMiddleware from 'middleware/AuthMiddleware';
import { RewardsModule } from 'modules/rewards/index';
import { RoutesModule } from 'modules/routes/index';
import { CommonModule } from 'modules/common/index';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const resolvers = loadFilesSync(`${__dirname}/resolvers`);
const loadedFiles = loadFilesSync(`${__dirname}/schema/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);

export const UserModule = new GraphQLModule({
  imports: [CommonModule, RoutesModule, RewardsModule],
  providers: [],
  resolversComposition: {
    'Query.getStatus': [AuthMiddleware.isAuthenticated()],
    'Query.whoAmI': [AuthMiddleware.isAdminOrReporer()],
    'Query.getAchievements': [AuthMiddleware.isAuthenticated()],
    'Mutation.sendPushNotifications': [AuthMiddleware.isAdmin()],
    'Mutation.adminAction': [AuthMiddleware.isAdmin()],
    'Mutation.createGoal': [AuthMiddleware.isAuthenticated()],
    'Mutation.deleteUser': [AuthMiddleware.isAuthenticated()],
    'Mutation.registerNotifications': [AuthMiddleware.isAuthenticated()],
  },
  typeDefs,
  resolvers: mergeResolvers(resolvers) as any,
});
