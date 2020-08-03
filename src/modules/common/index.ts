import { GraphQLModule } from '@graphql-modules/core';
import { loadSchemaFiles } from 'graphql-toolkit';
import _ from 'lodash';
import { RouteDefinition, RewardDefinition } from 'types/global';

export const REWARDS = Symbol.for('REWARDS');
export const ROUTES = Symbol.for('ROUTES');

export interface CommonModuleConfig {
  routes: RouteDefinition[];
  rewards: RewardDefinition[];
}

export const CommonModule: any = new GraphQLModule<CommonModuleConfig, {}, {}>({
  providers: ({ config: { routes, rewards } }) => [
    { provide: ROUTES, useValue: routes },
    { provide: REWARDS, useValue: rewards },
  ],
  typeDefs: [...loadSchemaFiles(__dirname + '/schema/')],
  configRequired: true,
});
