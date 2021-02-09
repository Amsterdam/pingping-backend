import { QueryAdminStatisticsArgs, QueryResolvers, QueryAdminGetUsersArgs } from '@models';
import { ContextType } from 'lib/Context';
import { AuditLog } from 'models/AuditLog';
import { User } from 'models/User';
import { RouteFeedback } from 'models/RouteFeedback';
import StatisticsUtil from 'utils/StatisticsUtil';

export const Query: QueryResolvers = {
  async adminStatistics(root: any, args: QueryAdminStatisticsArgs, context: ContextType): Promise<any> {
    const usersPerDay = await StatisticsUtil.getUsersPerDay();
    const completedTasks = await StatisticsUtil.getCompletedTasks(args.week);
    const routes = await StatisticsUtil.getRoutes();
    const totalUsers = await StatisticsUtil.getTotalUsers();
    const activeUsers = await StatisticsUtil.getActiveUsers();
    const skippedOnboarding = await StatisticsUtil.getSkippedOnboarding();
    const usersPerYearOfBirth = await StatisticsUtil.getUsersPerYearOfBirth(args.week);
    const userPerMonthOfBirth = await StatisticsUtil.getUsersPerMonthOfBirth(args.week, 14, 22);

    return {
      usersPerDay,
      completedTasks,
      routes,
      totalUsers,
      activeUsers,
      skippedOnboarding,
      usersPerYearOfBirth,
      userPerMonthOfBirth,
    };
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
