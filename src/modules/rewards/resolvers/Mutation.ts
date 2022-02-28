import { ModuleContext } from '@graphql-modules/core';
import { MutationResolvers, MutationClaimRewardArgs, MutationAdminUpdateRewardArgs } from '@models';
import { RewardVoucher } from 'models/RewardVoucher';
import { UserReward } from 'models/UserReward';
import InitialDataUtil from 'utils/InitialDataUtil';
import RewardUtil from 'utils/RewardUtil';

export const Mutation: MutationResolvers = {
  async claimReward(root: any, args: MutationClaimRewardArgs, context: ModuleContext): Promise<any> {
    const userReward: UserReward = await RewardUtil.claim(context.user, args.rewardId);

    return userReward;
  },

  async adminUpdateReward(root: any, args: MutationAdminUpdateRewardArgs, context: ModuleContext): Promise<any> {
    const reward = InitialDataUtil.getReward(args.id, context.user.dataSet);

    for (var v in args.vouchers) {
      let voucher: any = args.vouchers[v];

      if (voucher.id) {
        // Do nothing for now
        await RewardVoucher.updateOne({ _id: voucher.id }, { $set: voucher });
      } else {
        await RewardVoucher.create({
          rewardId: reward.id,
          userId: null,
          deviceId: null,
          data: voucher.data,
        });
      }
    }

    return reward;
  },
};
