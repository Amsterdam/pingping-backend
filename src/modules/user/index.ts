import { GraphQLModule } from '@graphql-modules/core';
import { loadSchemaFiles } from 'graphql-toolkit';
import { CommonModule } from '../common'
import { RoutesModule } from '../routes/index';
import { RewardsModule } from '../rewards/index';
import AuthMiddleware from '../../middleware/AuthMiddleware';

export const UserModule = new GraphQLModule({
  imports: [
    CommonModule,
    RoutesModule,
    RewardsModule
  ],
  providers: [
  ],
  resolversComposition: {
    'Query.getStatus': [AuthMiddleware.isAuthenticated()]
  },
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
});