import { RewardStatus } from '@models';
import { Document } from 'mongoose';

export type UserReward = Document & {
  rewardId: string;
  status: RewardStatus;
  price: number;
};
