import { Injectable, Inject } from '@graphql-modules/di';
import { RewardDefinition } from 'types/global';
import InitialDataUtil from 'utils/InitialDataUtil';
import { REWARDS } from 'modules/common/index';

@Injectable()
export class RewardsProvider {
  @Inject(REWARDS) private routes: RewardDefinition[];

  getAll(): RewardDefinition[] {
    return this.routes;
  }

  getById(id: string): RewardDefinition {
    return InitialDataUtil.getReward(id);
  }
}
