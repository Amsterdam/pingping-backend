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
  completedTasks: async (doc: any, args: AdminStatisticsResponseCompletedTasksArgs) => {
    return await StatisticsUtil.getCompletedTasks(args.week);
  },
  usersPerYearOfBirth: async (doc: any, args: AdminStatisticsResponseUsersPerYearOfBirthArgs) => {
    return await StatisticsUtil.getUsersPerYearOfBirth(args.week);
  },
  userPerMonthOfBirth: async (doc: any, args: AdminStatisticsResponseUserPerMonthOfBirthArgs) => {
    return await StatisticsUtil.getUsersPerMonthOfBirth(args.week, args.minAge, args.maxAge);
  },
  usersCumulative: async (doc: any) => {
    return await StatisticsUtil.getUsersCumulative();
  },
  routesPerMonth: async (doc: any) => {
    return await StatisticsUtil.getRoutesPerMonth();
  },
  routesCompletedPerMonth: async (doc: any) => {
    return await StatisticsUtil.getRoutesCompletedPerMonth();
  },
  usersPerWeek: async (doc: any) => {
    return await StatisticsUtil.getUsersPerWeek();
  },
  activeUsersPerWeek: async (doc: any) => {
    return await StatisticsUtil.getActiveUsersPerWeek();
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
