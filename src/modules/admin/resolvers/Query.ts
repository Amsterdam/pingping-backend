import {
  QueryAdminStatisticsArgs,
  QueryResolvers,
  QueryAdminGetUsersArgs,
  QueryGetDraftNotificationArgs,
  NotificationType,
  UserRole,
  TaskStatus,
  NotificationStatus,
} from '@models';
import { ContextType } from 'lib/Context';
import { AuditLog } from 'models/AuditLog';
import { User } from 'models/User';
import { RouteFeedback } from 'models/RouteFeedback';
import { NotificationModel } from 'models/Notification';
import moment from 'moment';

// Base query applies to all notifications
const BASE_QUERY: any = {
  $and: [
    {
      $or: [
        {
          remindedAt: null,
        },
        {
          remindedAt: { $lt: moment().subtract(7, 'days').toDate() },
        },
      ],
    },
    {
      role: UserRole.User,
      activeAt: { $lt: moment().subtract(7, 'days').toDate() },
      devices: {
        $elemMatch: {
          notificationStatus: NotificationStatus.Approved,
        },
      },
    },
  ],
};

export const Query: QueryResolvers = {
  async getDraftNotification(root: any, args: QueryGetDraftNotificationArgs, context: ContextType): Promise<any> {
    switch (args.type) {
      case NotificationType.RemindUserToContinueRoute:
        return {
          title: 'Continue with route',
          payload: {
            custom: {
              routeId: args.routeId,
            },
          },
          recipientUserIds: (
            await User.find({
              ...BASE_QUERY,
              routes: {
                $elemMatch: {
                  routeId: args.routeId,
                },
              },
              tasks: {
                $elemMatch: {
                  routeId: args.routeId,
                  status: TaskStatus.PendingUser,
                },
              },
            })
          ).map((u: any) => u._id),
        };
      case NotificationType.RemindUserToCompleteOnboarding:
        return {
          title: "Don't forget to complete your onboarding",
          payload: {
            hello: 'hi',
          },
          recipientUserIds: (
            await User.find({
              ...BASE_QUERY,
              routes: { $not: { $elemMatch: { routeId: 'financieleBasis' } } },
              tasks: {
                $elemMatch: {
                  status: TaskStatus.PendingUser,
                },
              },
            })
          ).map((u: any) => u._id),
        };
    }

    return {
      title: '',
      payload: {},
      recipients: [],
    };
  },
  async getNotifications(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await NotificationModel.find({});
  },
  adminStatistics(root: any, args: QueryAdminStatisticsArgs, context: ContextType): any {
    return true;
  },

  async adminGetUsers(root: any, args: QueryAdminGetUsersArgs, context: ContextType): Promise<Array<any>> {
    return await User.find({ role: { $in: args.roles } });
  },

  async adminGetAuditLog(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await AuditLog.find({});
  },

  async adminGetFeedback(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await RouteFeedback.find({});
  },
};
