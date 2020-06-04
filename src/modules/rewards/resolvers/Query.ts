import { QueryResolvers, RewardResponse, RewardStatus } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import InitialDataUtil from 'utils/InitialDataUtil';
import { RewardDefinition } from 'types/global';

export const Query: QueryResolvers = {
  getAvailableRewards(root: any, args: any, context: ModuleContext): Array<RewardResponse> {
    const rewards: Array<RewardDefinition> = InitialDataUtil.getRewards();

    return rewards.map((reward: RewardDefinition) => {
      return {
        rewardId: reward.id,
        title: reward.title,
        description: reward.description,
        imageUrl: reward.imageUrl,
        price: reward.price,
        status: RewardStatus.AvailableToClaim,
      };
    });
  },
};
