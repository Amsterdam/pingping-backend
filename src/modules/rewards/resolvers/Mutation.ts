import { ModuleContext } from '@graphql-modules/core';
import { MutationResolvers, MutationClaimRewardArgs, UserRewardResponse } from '@models';
import { UserReward, toResponse as getUserRewardResponse } from 'models/UserReward';
import RewardUtil from 'utils/RewardUtil';

export const Query: MutationResolvers = {
  async claimReward(root: any, args: MutationClaimRewardArgs, context: ModuleContext): Promise<UserRewardResponse> {
    const userReward: UserReward = await RewardUtil.claim(context.user, args.rewardId);

    return getUserRewardResponse(userReward);
  },
};
