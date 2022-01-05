import { AuditLogDocument } from 'models/AuditLog';
import { User, UserDocument } from 'models/User';
import StatisticsUtil from 'utils/StatisticsUtil';
import moment from 'moment';
import { AdminUserRouteResponseCompletedAtArgs, AdminUserRouteResponseCreatedAtArgs } from '@models';

import {
  AdminStatisticsResponseCompletedTasksArgs,
  AdminStatisticsResponseUsersPerYearOfBirthArgs,
  AdminStatisticsResponseUserPerMonthOfBirthArgs,
} from '@models';

export const AdminUserResponse: any = {
  userTasks: (doc: UserDocument) => doc.tasks,
};

export const AdminStatisticsResponse: any = {
  completedTasks: async (doc: any, args: AdminStatisticsResponseCompletedTasksArgs, { user }: any) => {
    return await StatisticsUtil.getCompletedTasks(args.week, user.dataSet);
  },
  usersPerYearOfBirth: async (doc: any, args: AdminStatisticsResponseUsersPerYearOfBirthArgs, { user }: any) => {
    return await StatisticsUtil.getUsersPerYearOfBirth(args.week, user.dataSet);
  },
  userPerMonthOfBirth: async (doc: any, args: AdminStatisticsResponseUserPerMonthOfBirthArgs, { user }: any) => {
    return await StatisticsUtil.getUsersPerMonthOfBirth(args.week, args.minAge, args.maxAge, user.dataSet);
  },
  usersCumulative: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getUsersCumulative(user.dataSet);
  },
  routesPerMonth: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getRoutesPerMonth(user.dataSet);
  },
  routesCompletedPerMonth: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getRoutesCompletedPerMonth(user.dataSet);
  },
  usersPerWeek: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getUsersPerWeek(user.dataSet);
  },
  activeUsersPerWeek: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getActiveUsersPerWeek(user.dataSet);
  },
  routes: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getRoutes(user.dataSet);
  },
  activeUsers: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getActiveUsers(user.dataSet);
  },
  totalUsers: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getTotalUsers(user.dataSet);
  },
  skippedOnboarding: async (doc: any, args: any, { user }: any) => {
    return await StatisticsUtil.getSkippedOnboarding(user.dataSet);
  },
};

export const AuditLogResponse: any = {
  user: async (doc: AuditLogDocument) => {
    return await User.findOne({ _id: doc.user });
  },
};

export const AdminUserRouteResponse: any = {
  createdAt: async (doc: any, args: AdminUserRouteResponseCreatedAtArgs) => {
    if (args.format && doc.createdAt) {
      return moment(doc.createdAt).format(args.format);
    }

    return doc.createdAt;
  },
  completedAt: async (doc: any, args: AdminUserRouteResponseCompletedAtArgs) => {
    if (args.format && doc.completedAt) {
      return moment(doc.completedAt).format(args.format);
    }

    return doc.completedAt;
  },
};
