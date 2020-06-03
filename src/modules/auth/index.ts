import { GraphQLModule } from '@graphql-modules/core';
import { loadResolversFiles, loadSchemaFiles } from 'graphql-toolkit';
import { CommonModule } from '../common'
import { UserModule } from '../user/index';
import { RoutesModule } from '../routes/index';
import { context } from '../../lib/Context'
import AuthMiddleware from '../../middleware/AuthMiddleware';

export const AuthModule = new GraphQLModule({
  imports: [
    CommonModule,
    UserModule,
    RoutesModule
  ],
  providers: [
  ],
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/'),
  context
});