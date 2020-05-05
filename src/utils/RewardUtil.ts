import { UserDocument } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import { RewardDefinition } from 'global';
import { UserReward } from '../models/UserReward';
import { RewardStatus } from '../generated/graphql';

class RewardUtil {
  static async claim(user:UserDocument, id:string):Promise<UserReward> {
    const reward: RewardDefinition = InitialDataUtil.getReward(id);

    if (user.balance < reward.price) {
      throw new Error(`reward_insufficient_balance`);
    }

    // Check if reward is already claimed
    const numberClaimed = user.rewards.filter(i => i.rewardId = id).length

    if (numberClaimed >= reward.availablePerUser) {
      throw new Error(`reward_already_claimed`);
    }

    const userReward:UserReward = {
      rewardId: id,
      status: RewardStatus.Claimed,
      price: reward.price
    } as UserReward

    user.balance = user.balance - reward.price
    user.rewards.push(userReward)
    user.save()

    return userReward
  }
}

export default RewardUtil
