import { GraphQLModule } from '@graphql-modules/core';
import { loadSchemaFiles } from 'graphql-toolkit';
import _ from 'lodash'

export const REWARDS = Symbol.for('REWARDS');
export const ROUTES = Symbol.for('ROUTES');

export interface CommonModuleConfig {
}

export const CommonModule:any = new GraphQLModule<CommonModuleConfig, {}, {}>({
  providers: ({ config: { } }) => [
  ],
  typeDefs: [
    ...loadSchemaFiles(__dirname + '/schema/'),
  ],
  configRequired: true
});