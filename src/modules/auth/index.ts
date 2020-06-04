import { GraphQLModule } from '@graphql-modules/core';
import { loadResolversFiles, loadSchemaFiles } from 'graphql-toolkit';
import { CommonModule } from '../common';
import { context } from 'lib/Context';
import { UserModule } from 'modules/user';
import { RoutesModule } from 'modules/routes';

export const AuthModule = new GraphQLModule({
  imports: [CommonModule, UserModule, RoutesModule],
  providers: [],
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/'),
  context,
});
