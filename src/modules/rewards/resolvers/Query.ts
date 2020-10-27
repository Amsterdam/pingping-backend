import { QueryResolvers } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import { RewardsProvider } from '../RewardsProvider';

export const Query: QueryResolvers = {
  getAvailableRewards(root: any, args: any, context: ModuleContext): Array<any> {
    return context.injector.get(RewardsProvider).getAvailable();
  },

  getRewards(root: any, args: any, context: ModuleContext): Array<any> {
    return context.injector.get(RewardsProvider).getAll();
  },
};
