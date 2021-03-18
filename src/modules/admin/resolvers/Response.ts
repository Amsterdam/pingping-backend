import { AuditLogDocument } from 'models/AuditLog';
import { User, UserDocument } from 'models/User';
import InitialDataUtil from 'utils/InitialDataUtil';
import { UserRoute } from 'models/UserRoute';
import StatisticsUtil from 'utils/StatisticsUtil';

import {
  AdminStatisticsResponseCompletedTasksArgs,
  AdminStatisticsResponseUsersPerYearOfBirthArgs,
  AdminStatisticsResponseUserPerMonthOfBirthArgs,
} from '@models';

export const AdminUserResponse: any = {
  userTasks: (doc: UserDocument) => doc.tasks,
};

export const AdminStatisticsResponse: any = {
  completedTasks: async (doc: any, args: AdminStatisticsResponseCompletedTasksArgs) => {
    return await StatisticsUtil.getCompletedTasks(args.week);
  },
  usersPerYearOfBirth: async (doc: any, args: AdminStatisticsResponseUsersPerYearOfBirthArgs) => {
    return await StatisticsUtil.getUsersPerYearOfBirth(args.week);
  },
  userPerMonthOfBirth: async (doc: any, args: AdminStatisticsResponseUserPerMonthOfBirthArgs) => {
    return await StatisticsUtil.getUsersPerMonthOfBirth(args.week, args.minAge, args.maxAge);
  },
  usersAccumulative: async (doc: any) => {
    return await StatisticsUtil.getUsersAccumulative();
  },
  usersPerWeek: async (doc: any) => {
    return await StatisticsUtil.getUsersPerWeek();
  },
  routes: async (doc: any) => {
    return await StatisticsUtil.getRoutes();
  },
  activeUsers: async (doc: any) => {
    return await StatisticsUtil.getActiveUsers();
  },
  totalUsers: async (doc: any) => {
    return await StatisticsUtil.getTotalUsers();
  },
  skippedOnboarding: async (doc: any) => {
    return await StatisticsUtil.getSkippedOnboarding();
  },
};

export const AuditLogResponse: any = {
  user: async (doc: AuditLogDocument) => {
    return await User.findOne({ _id: doc.user });
  },
};
