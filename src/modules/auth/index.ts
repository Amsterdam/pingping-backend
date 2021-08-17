import { GraphQLModule } from '@graphql-modules/core';
import { CommonModule } from '../common';
import { UserModule } from 'modules/user';
import { RoutesModule } from 'modules/routes';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const resolvers = loadFilesSync(`${__dirname}/resolvers`);
const loadedFiles = loadFilesSync(`${__dirname}/schema/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);

export const AuthModule = new GraphQLModule({
  imports: [CommonModule, UserModule, RoutesModule],
  typeDefs,
  resolvers: mergeResolvers(resolvers) as any,
});
