import { GraphQLModule } from '@graphql-modules/core';
import AuthMiddleware from 'middleware/AuthMiddleware';
import _ from 'lodash';
import { getContext as context } from '../../lib/Context';
import { CommonModule } from 'modules/common';
import { RewardsProvider } from './RewardsProvider';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

const resolvers = loadFilesSync(`${__dirname}/resolvers`);
const loadedFiles = loadFilesSync(`${__dirname}/schema/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);

export const RewardsModule = new GraphQLModule({
  imports: [CommonModule],
  providers: [RewardsProvider],
  typeDefs,
  resolvers: mergeResolvers(resolvers),
  resolversComposition: {
    'Query.getAvailableRewards': [AuthMiddleware.isAuthenticated()],
    'Query.adminGetRewards': [AuthMiddleware.isAdmin()],
    'Mutation.claimReward': [AuthMiddleware.isAuthenticated()],
    'Mutation.adminUpdateReward': [AuthMiddleware.isAdmin()],
  },
  context,
});
