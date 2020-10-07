import { UserDocument } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import { RewardDefinition } from '../types/global';
import { UserReward } from '../models/UserReward';
import { RewardStatus, RewardType } from '../generated-models';
import TransactionUtil from './TransactionUtil';
import { RewardVoucher } from 'models/RewardVoucher';

class RewardUtil {
  static async claim(user: UserDocument, id: string): Promise<UserReward> {
    const reward: RewardDefinition = InitialDataUtil.getReward(id);

    if (user.balance < reward.price) {
      throw new Error(`reward_insufficient_balance ${user.balance} < ${reward.price}`);
    }

    // Check if reward is already claimed
    const numberClaimed = user.rewards.filter((i) => (i.rewardId = id)).length;
    if (numberClaimed >= reward.availablePerUser) {
      throw new Error(`reward_already_claimed`);
    }

    if (reward.type === RewardType.Voucher) {
      // Get voucher from the pool
      const voucher = await RewardVoucher.findOne({ userId: null, rewardId: reward.id });

      if (!voucher) {
        throw new Error('reward_not_available');
      }

      voucher.userId = user._id;
      voucher.save();
    } else if (reward.type === RewardType.SelfIssued) {
    } else {
      throw new Error('Invalid reward type');
    }

    const userReward: UserReward = {
      rewardId: id,
      status: RewardStatus.Claimed,
      price: reward.price,
    } as UserReward;

    await TransactionUtil.addTransaction(user, `Beloning: ${reward.title}`, reward.price * -1, reward.id);
    const res = user.rewards.push(userReward);
    await user.save();

    return user.rewards[res - 1];
  }
}

export default RewardUtil;
