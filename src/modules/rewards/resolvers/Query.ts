
import { QueryResolvers, RewardResponse, RewardStatus } from "../../../generated-models";
import { ModuleContext } from "@graphql-modules/core";
import InitialDataUtil from '../../../utils/InitialDataUtil';
import { RewardDefinition } from "../../../types/global";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import { RewardsProvider } from '../RewardsProvider';

export const Query: QueryResolvers = {
  getAvailableRewards(
    root: any,
    args: any,
    context: ModuleContext
  ): Array<RewardResponse> {
    // if (!context.user) {
    //   throw new UnauthorizedError();
    // }

    console.log('hi')

    const rewards: Array<RewardDefinition> = InitialDataUtil.getRewards();

    console.log('rew', rewards)

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
