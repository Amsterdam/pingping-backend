import { QueryAdminStatisticsArgs, QueryResolvers, QueryAdminGetUsersArgs } from '@models';
import { ContextType } from 'lib/Context';
import { AuditLog } from 'models/AuditLog';
import { User } from 'models/User';
import { RouteFeedback } from 'models/RouteFeedback';

export const Query: QueryResolvers = {
  adminStatistics(root: any, args: QueryAdminStatisticsArgs, context: ContextType): any {
    return true;
  },

  async adminGetUsers(root: any, args: QueryAdminGetUsersArgs, context: ContextType): Promise<Array<any>> {
    return await User.find({ role: args.role });
  },

  async adminGetAuditLog(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await AuditLog.find({});
  },

  async adminGetFeedback(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await RouteFeedback.find({});
  },
};
