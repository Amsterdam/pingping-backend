import { ModuleContext } from '@graphql-modules/core';
import { MutationResolvers, MutationClaimRewardArgs, MutationUpdateRewardArgs, RewardVoucherInput } from '@models';
import { RewardVoucher } from 'models/RewardVoucher';
import { UserReward } from 'models/UserReward';
import InitialDataUtil from 'utils/InitialDataUtil';
import RewardUtil from 'utils/RewardUtil';
import { Types } from 'mongoose';

export const Mutation: MutationResolvers = {
  async claimReward(root: any, args: MutationClaimRewardArgs, context: ModuleContext): Promise<any> {
    const userReward: UserReward = await RewardUtil.claim(context.user, args.rewardId);

    return userReward;
  },

  async updateReward(root: any, args: MutationUpdateRewardArgs, context: ModuleContext): Promise<any> {
    const reward = InitialDataUtil.getReward(args.id);

    for (var v in args.vouchers) {
      let voucher: any = args.vouchers[v];

      if (voucher.id) {
        // Do nothing foe now
      } else {
        await RewardVoucher.create({
          rewardId: reward.id,
          userId: null,
          data: voucher.data,
        });
      }
    }

    return reward;
  },
};
