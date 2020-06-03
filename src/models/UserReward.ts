import { RewardStatus, UserRewardResponse } from "@models";
import { Document } from "mongoose";
import InitialDataUtil from "../utils/InitialDataUtil";

export type UserReward = Document & {
  rewardId: string;
  status: RewardStatus;
  price: number;
};

export const toResponse = (userReward: UserReward): UserRewardResponse => {
  let reward;

  try {
    reward = InitialDataUtil.getReward(userReward.rewardId);
  } catch {
    return null;
  }

  return {
    _id: userReward._id,
    rewardId: userReward.rewardId,
    status: userReward.status,
    title: reward.title,
    description: reward.description,
    imageUrl: reward.imageUrl,
    barcodeImageUrl: `https://barcodes.com/${userReward._id}`,
  };
};
