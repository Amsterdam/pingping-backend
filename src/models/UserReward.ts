import { RewardStatus } from '../generated/graphql';
import { Document } from 'mongoose';

export type UserReward = Document & {
  rewardId: string
  status: RewardStatus
  price: number
}
