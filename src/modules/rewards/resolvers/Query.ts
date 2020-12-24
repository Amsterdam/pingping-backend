import _ from 'lodash';
import { QueryResolvers, UserRole } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import { RewardsProvider } from '../RewardsProvider';

const MOCK_DATE = '2020-02-02';

export const Query: QueryResolvers = {
  getAvailableRewards(root: any, args: any, context: ModuleContext): Array<any> {
    // Since mobile app certification needs to be done on production there is a custom
    // birthdate that only provides access to mocked rewards. These rewards will be claimed by
    // apple / google testers.
    if (_.get(context, 'user.profile.dateOfBirth') === MOCK_DATE) {
      return context.injector.get(RewardsProvider).getInactive();
    }

    return context.injector.get(RewardsProvider).getActive();
  },

  getRewards(root: any, args: any, context: ModuleContext): Array<any> {
    return context.injector.get(RewardsProvider).getAll();
  },
};
