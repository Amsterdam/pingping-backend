import { RewardStatus } from '@models';
import { RewardDefinition } from 'types/global';

export const RewardResponse = () => {
  return {
    rewardId: (reward: RewardDefinition) => reward.id,
    title: (reward: RewardDefinition) => reward.title,
    description: (reward: RewardDefinition) => reward.description,
    imageUrl: (reward: RewardDefinition) => reward.imageUrl,
    price: (reward: RewardDefinition) => reward.price,
    status: RewardStatus.AvailableToClaim, // @todo Mani, fix
  };
};
