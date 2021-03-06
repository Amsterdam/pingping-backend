import { Injectable, Inject } from '@graphql-modules/di';
import { RewardDefinition } from 'types/global';
import InitialDataUtil from 'utils/InitialDataUtil';
import { REWARDS } from 'modules/common/index';
import { RewardType } from '@models';
import { RewardVoucher } from 'models/RewardVoucher';
import filterAsync from 'node-filter-async';

@Injectable()
export class RewardsProvider {
  @Inject(REWARDS) private rewards: RewardDefinition[];

  getAll(): RewardDefinition[] {
    return this.rewards;
  }

  getInactive(): RewardDefinition[] {
    return this.rewards.filter((r: RewardDefinition) => r.active === false);
  }

  getActive(): RewardDefinition[] {
    return this.rewards.filter((r: RewardDefinition) => r.active === true);
  }

  async getAvailable(): Promise<RewardDefinition[]> {
    return await filterAsync(this.rewards, async (val: RewardDefinition, i) => {
      if (val.type === RewardType.SelfIssued) {
        return true;
      } else if (val.type === RewardType.Voucher) {
        let available = await RewardVoucher.countDocuments({ rewardId: val.id, userId: null, deviceId: null });

        return available > 0;
      }
    });
  }

  getById(id: string): RewardDefinition {
    return InitialDataUtil.getReward(id);
  }
}
