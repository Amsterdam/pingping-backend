import { GraphQLModule } from '@graphql-modules/core';
import _ from 'lodash';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { RouteDefinition, RewardDefinition } from 'types/global';

export const REWARDS = Symbol.for('REWARDS');
export const ROUTES = Symbol.for('ROUTES');

export interface CommonModuleConfig {
  routes: RouteDefinition[];
  rewards: RewardDefinition[];
}

const loadedFiles = loadFilesSync(`${__dirname}/schema/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);

export const CommonModule: any = new GraphQLModule<CommonModuleConfig, {}, {}>({
  providers: ({ config: { routes, rewards } }) => [
    { provide: ROUTES, useValue: routes },
    { provide: REWARDS, useValue: rewards },
  ],
  typeDefs,
  configRequired: true,
});
