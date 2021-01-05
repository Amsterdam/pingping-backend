import { QueryResolvers } from '@models';
import { ContextType } from 'lib/Context';
import { AuditLog } from 'models/AuditLog';
import { User } from 'models/User';
import { RouteFeedback } from 'models/RouteFeedback';
import StatisticsUtil from 'utils/StatisticsUtil';

export const Query: QueryResolvers = {
  async adminStatistics(root: any, args: any, context: ContextType): Promise<any> {
    const usersPerDay = await StatisticsUtil.getUsersPerDay();

    return {
      usersPerDay,
    };
  },

  async adminGetUsers(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await User.find({});
  },

  async adminGetAuditLog(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await AuditLog.find({});
  },

  async adminGetFeedback(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await RouteFeedback.find({});
  },
};
