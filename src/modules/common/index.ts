import { GraphQLModule } from '@graphql-modules/core';
import { loadResolversFiles, loadSchemaFiles } from 'graphql-toolkit';
// import { UserRewardDbObject } from "@models";
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { UserDocument } from '../../models/User';
import auth from '../../lib/auth';
import _ from 'lodash'

export const REWARDS = Symbol.for('REWARDS');
export const ROUTES = Symbol.for('ROUTES');

export interface CommonModuleConfig {
  // rewards: UserRewardDbObject[];
  // routes: RouteDbObject[];
}

export const CommonModule:any = new GraphQLModule<CommonModuleConfig, {}, {}>({
  providers: ({ config: { } }) => [
    // { provide: REWARDS, useValue: rewards },
    // { provide: ROUTES, useValue: routes },
  ],
  typeDefs: [
    ...loadSchemaFiles(__dirname + '/schema/'),
  ],
  configRequired: true
});