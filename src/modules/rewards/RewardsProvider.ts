import { Injectable, Inject } from '@graphql-modules/di';
import { RewardDefinition } from 'types/global';
import InitialDataUtil from 'utils/InitialDataUtil';
import { RewardType } from '@models';
import { RewardVoucher } from 'models/RewardVoucher';
import filterAsync from 'node-filter-async';

@Injectable()
export class RewardsProvider {
  getAll(): RewardDefinition[] {
    return InitialDataUtil.getRewards();
  }

  getAllForDataSet(dataSet: string): RewardDefinition[] {
    return InitialDataUtil.getRewards().filter((r: RewardDefinition) => r.dataSet === dataSet);
  }

  getInactive(dataSet: string): RewardDefinition[] {
    return InitialDataUtil.getRewards().filter((r: RewardDefinition) => r.active === false && r.dataSet === dataSet);
  }

  getActive(dataSet: string): RewardDefinition[] {
    return InitialDataUtil.getRewards().filter((r: RewardDefinition) => r.active === true && r.dataSet === dataSet);
  }

  async getAvailable(dataSet: string): Promise<RewardDefinition[]> {
    const rewards = InitialDataUtil.getRewards().filter((r: RewardDefinition) => r.dataSet === dataSet);

    return await filterAsync(rewards, async (val: RewardDefinition, i) => {
      if (val.type === RewardType.SelfIssued) {
        return true;
      } else if (val.type === RewardType.Voucher) {
        let available = await RewardVoucher.countDocuments({ rewardId: val.id, userId: null, deviceId: null });

        return available > 0;
      }
    });
  }
}
