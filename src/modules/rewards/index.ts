import { GraphQLModule } from '@graphql-modules/core';
import { loadSchemaFiles, loadResolversFiles } from 'graphql-toolkit';
import { CommonModule } from '../common'
import AuthMiddleware from '../../middleware/AuthMiddleware';
import _ from 'lodash'
import { context } from '../../lib/Context'

export const RewardsModule = new GraphQLModule({
  imports: [
    CommonModule
  ],
  providers: [
    // RewardsProvider
  ],
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/'),
  resolversComposition: {
    'Query.getAvailableRewards': [AuthMiddleware.isAuthenticated()],
    'Mutation.claimReward': [AuthMiddleware.isAuthenticated()]
  },
  context
});