import { QueryResolvers } from '@models';
import { ContextType } from 'lib/Context';
import { AuditLog } from 'models/AuditLog';
import { User } from 'models/User';
import { RouteFeedback } from 'models/RouteFeedback';
import StatisticsUtil from 'utils/StatisticsUtil';

export const Query: QueryResolvers = {
  async adminStatistics(root: any, args: any, context: ContextType): Promise<any> {
    const usersPerDay = await StatisticsUtil.getUsersPerDay();
    const completedTasks = await StatisticsUtil.getCompletedTasks();
    const routes = await StatisticsUtil.getRoutes();
    const totalUsers = await StatisticsUtil.getTotalUsers();
    const activeUsers = await StatisticsUtil.getActiveUsers();

    return {
      usersPerDay,
      completedTasks,
      routes,
      totalUsers,
      activeUsers,
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
