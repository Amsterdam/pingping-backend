import { QueryResolvers } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import InitialDataUtil from 'utils/InitialDataUtil';
import { RewardDefinition } from 'types/global';

export const Query: QueryResolvers = {
  getAvailableRewards(root: any, args: any, context: ModuleContext): Array<any> {
    const rewards: Array<RewardDefinition> = InitialDataUtil.getRewards();

    return rewards;
  },
};
