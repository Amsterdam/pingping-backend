import _ from 'lodash';
import moment from 'moment';
import { QueryResolvers, UserRole } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import { RewardsProvider } from '../RewardsProvider';

const MOCK_DATE = '2019-02-29';

export const Query: QueryResolvers = {
  getAvailableRewards(root: any, args: any, context: ModuleContext): Array<any> {
    // Since mobile app certification needs to be done on production there is a custom
    // birthdate that only provides access to mocked rewards. These rewards will be claimed by
    // apple / google testers.
    if (moment(_.get(context, 'user.profile.dateOfBirth', new Date())).format('YYYY-MM-DD') === MOCK_DATE) {
      return context.injector.get(RewardsProvider).getInactive();
    }

    return context.injector.get(RewardsProvider).getActive();
  },

  getRewards(root: any, args: any, context: ModuleContext): Array<any> {
    return context.injector.get(RewardsProvider).getAll();
  },
};
