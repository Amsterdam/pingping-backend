import { ModuleContext } from '@graphql-modules/core';
import { MutationResolvers, MutationClaimRewardArgs } from '@models';
import { UserReward } from 'models/UserReward';
import RewardUtil from 'utils/RewardUtil';

export const Mutation: MutationResolvers = {
  async claimReward(root: any, args: MutationClaimRewardArgs, context: ModuleContext): Promise<any> {
    const userReward: UserReward = await RewardUtil.claim(context.user, args.rewardId);

    return userReward;
  },
};
