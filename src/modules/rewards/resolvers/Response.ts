import _ from 'lodash';
import { RewardStatus, RewardType, UserRole } from '@models';
import { RewardDefinition } from 'types/global';
import { UserReward } from 'models/UserReward';
import InitialDataUtil from 'utils/InitialDataUtil';
import { ContextType } from 'lib/Context';
import { RewardVoucher, RewardVoucherDocument } from 'models/RewardVoucher';

export const RewardResponse: any = {
  rewardId: (doc: RewardDefinition) => doc.id,
  status: async (doc: RewardDefinition) => {
    if (doc.type === RewardType.Voucher) {
      const remaining = await RewardVoucher.countDocuments({ rewardId: doc.id, userId: null });

      if (remaining > 0) {
        return RewardStatus.AvailableToClaim;
      } else {
        return RewardStatus.NotAvailable;
      }
    } else {
      return RewardStatus.AvailableToClaim;
    }
  },
  vouchers: async (doc: RewardDefinition, args: any, context: ContextType) => {
    if (context.user && context.user.role === UserRole.Admin) {
      return await RewardVoucher.find({ rewardId: doc.id });
    }

    return [];
  },
};

export const RewardVoucherInput: any = {
  id: (doc: UserReward) => doc._id,
};

export const UserRewardResponse: any = {
  id: (doc: UserReward) => doc._id,
  status: (doc: UserReward) => doc.status,
  barcodeImageUrl: (doc: UserReward, args: any, context: ContextType) => {
    const def = InitialDataUtil.getReward(doc.rewardId, context.user.dataSet);
    if (def.type === RewardType.SelfIssued) {
      // return `https://barcodes.com/${doc._id}`;
      return '';
    } else {
      return null;
    }
  },
  reward: (doc: UserReward, args: any, context: ContextType) =>
    InitialDataUtil.getReward(doc.rewardId, context.user.dataSet),
  data: async (doc: UserReward, args: any, context: ContextType) => {
    const voucher: RewardVoucherDocument = await RewardVoucher.findOne({
      userId: context.user._id,
      rewardId: doc.rewardId,
    });

    return voucher ? voucher.data : null;
  },
};
