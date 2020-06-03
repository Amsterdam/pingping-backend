import { GraphQLModule } from '@graphql-modules/core';
import { loadResolversFiles, loadSchemaFiles } from 'graphql-toolkit';
import { CommonModule } from '../common'
import { context } from '../../lib/Context';

export const RoutesModule = new GraphQLModule({
  imports: [
    CommonModule
  ],
  providers: [
  ],
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/'),
  context
});