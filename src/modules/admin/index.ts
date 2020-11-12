import { GraphQLModule } from '@graphql-modules/core';
import AuthMiddleware from 'middleware/AuthMiddleware';
import { RewardsModule } from 'modules/rewards/index';
import { RoutesModule } from 'modules/routes/index';
import { CommonModule } from 'modules/common/index';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { UserModule } from 'modules/user/index';

const resolvers = loadFilesSync(`${__dirname}/resolvers`);
const loadedFiles = loadFilesSync(`${__dirname}/schema/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);

export const AdminModule = new GraphQLModule({
  imports: [CommonModule, RoutesModule, RewardsModule, UserModule],
  providers: [],
  resolversComposition: {
    'Mutation.adminAction': [AuthMiddleware.isAdmin()],
    'Mutation.adminSendNotifications': [AuthMiddleware.isAdmin()],
    'Mutation.adminCreateUser': [AuthMiddleware.isAdmin()],
    'Mutation.adminDeleteUser': [AuthMiddleware.isAdmin()],
    'Query.adminGetUsers': [AuthMiddleware.isAdmin()],
    'Query.adminGetAuditLog': [AuthMiddleware.isAdmin()],
  },
  typeDefs,
  resolvers: mergeResolvers(resolvers),
});
