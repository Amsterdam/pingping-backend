import { Injectable } from '@graphql-modules/di';
import InitialDataUtil from 'utils/InitialDataUtil';

@Injectable()
export class RewardsProvider {
  rewards = InitialDataUtil.getRewards();
}
