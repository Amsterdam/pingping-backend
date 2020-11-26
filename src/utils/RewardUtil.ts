import _ from 'lodash';
import { User, UserDocument } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import { RewardDefinition } from '../types/global';
import { UserReward } from '../models/UserReward';
import { RewardStatus, RewardType } from '../generated-models';
import TransactionUtil from './TransactionUtil';
import { RewardVoucher, RewardVoucherDocument } from 'models/RewardVoucher';

class RewardUtil {
  static assertBalance(reward: RewardDefinition, user: UserDocument) {
    if (user.balance < reward.price) {
      throw new Error(`reward_insufficient_balance ${user.balance} < ${reward.price}`);
    }
  }

  static assertNotAlreadyClaimedTooMany(reward: RewardDefinition, user: UserDocument) {
    const numberClaimed = user.rewards.filter((i) => (i.rewardId = reward.id)).length;

    if (numberClaimed >= reward.availablePerUser) {
      throw new Error(`reward_already_claimed`);
    }
  }

  static async assignVoucher(rewardId: string, user: UserDocument): Promise<RewardVoucherDocument> {
    const deviceId = _.get(user, 'devices.0.id', null);

    // Check if reward exist with the same device id.
    let voucherFound = await RewardVoucher.findOne({ deviceId, rewardId, userId: null });

    if (!voucherFound) {
      // If not, find one from the pool
      voucherFound = await RewardVoucher.findOne({ userId: null, deviceId: null, rewardId });
    }

    if (!voucherFound) {
      throw new Error('reward_not_available');
    }

    voucherFound.userId = user._id;
    voucherFound.deviceId = deviceId;
    await voucherFound.save();

    return voucherFound;
  }

  static async deleteVoucher(id: string) {
    await RewardVoucher.deleteOne({
      _id: id,
    });
    await User.update({}, { $pull: { rewards: { voucherId: id } } }, { multi: true });
  }

  static async claim(user: UserDocument, id: string): Promise<UserReward> {
    const reward: RewardDefinition = InitialDataUtil.getReward(id);
    let voucher = null;

    RewardUtil.assertBalance(reward, user);
    RewardUtil.assertNotAlreadyClaimedTooMany(reward, user);

    if (reward.type === RewardType.Voucher) {
      voucher = await RewardUtil.assignVoucher(id, user);
    } else if (reward.type === RewardType.SelfIssued) {
      // @todo, Generate barcode
    } else {
      throw new Error('Invalid reward type');
    }

    const userReward: UserReward = {
      rewardId: id,
      status: RewardStatus.Claimed,
      price: reward.price,
      voucherId: voucher ? voucher._id : null,
    } as UserReward;

    await TransactionUtil.addTransaction(user, `Beloning: ${reward.title}`, reward.price * -1, reward.id);
    const res = user.rewards.push(userReward);
    await user.save();

    return user.rewards[res - 1];
  }
}

export default RewardUtil;
