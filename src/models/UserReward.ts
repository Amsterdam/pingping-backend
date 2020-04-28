import { RewardStatus } from '../generated/graphql';
import { Document } from 'mongoose';

export class UserReward extends Document {
  rewardId: string
  status: RewardStatus
  createdAt: Date

  constructor(rewardId:string, status:RewardStatus) {
    super ()
    this.rewardId = rewardId
    this.status = status
  }
}
