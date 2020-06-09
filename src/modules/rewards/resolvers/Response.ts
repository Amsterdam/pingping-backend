import { RewardStatus } from '@models';
import { RewardDefinition } from 'types/global';
import { UserReward } from 'models/UserReward';
import InitialDataUtil from 'utils/InitialDataUtil';

export const RewardResponse: any = {
  rewardId: (doc: RewardDefinition) => doc.id,
  title: (doc: RewardDefinition) => doc.title,
  description: (doc: RewardDefinition) => doc.description,
  imageUrl: (doc: RewardDefinition) => doc.imageUrl,
  price: (doc: RewardDefinition) => doc.price,
  status: (doc: RewardDefinition) => RewardStatus.AvailableToClaim, // @todo Mani, fix
};

export const UserRewardResponse: any = {
  id: (doc: UserReward) => doc._id,
  status: (doc: UserReward) => doc.status,
  barcodeImageUrl: (doc: UserReward) => `https://barcodes.com/${doc._id}`,
  reward: (doc: UserReward) => InitialDataUtil.getReward(doc.rewardId),
};
