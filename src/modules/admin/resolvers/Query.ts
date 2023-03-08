import {
  QueryAdminStatisticsArgs,
  QueryResolvers,
  QueryAdminGetUsersArgs,
  QueryGetDraftNotificationArgs,
  NotificationType,
  UserRole,
  TaskStatus,
  NotificationStatus,
  UserFilter,
  UserRouteStatus,
} from '@models';
import { ContextType } from 'lib/Context';
import { AuditLog } from 'models/AuditLog';
import { User } from 'models/User';
import { RouteFeedback } from 'models/RouteFeedback';
import { NotificationModel } from 'models/Notification';
import moment from 'moment';

// Base query applies to all notifications
const BASE_QUERY: any = (dataSet: string) => {
  return {
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
        $or: [
          {
            activeAt: null,
          },
          {
            activeAt: { $lt: moment().subtract(7, 'days').toDate() },
          },
        ],
      },
      {
        role: UserRole.User,
        dataSet,
        devices: {
          $elemMatch: {
            notificationStatus: NotificationStatus.Approved,
          },
        },
      },
    ],
  };
};

export const Query: QueryResolvers = {
  getEnv() {
    return process.env.ENVIRONMENT || 'unknown';
  },
  async getDraftNotification(root: any, args: QueryGetDraftNotificationArgs, context: ContextType): Promise<any> {
    switch (args.type) {
      case NotificationType.RemindUserToContinueRoute:
        return {
          title: 'Fiks je basis, zet je volgende stap!',
          message:
            'Goed bezig! Je bent al begonnen met het fiksen van je basis. Zet snel de volgende stap om verder te gaan en je succes te vieren!',
          payload: {
            custom: {
              routeId: args.routeId,
              type: args.type,
            },
          },
          recipientUserIds: (
            await User.find({
              ...BASE_QUERY(context.user.dataSet),
              routes: {
                $elemMatch: {
                  routeId: args.routeId,
                  status: UserRouteStatus.Active,
                },
              },
            })
          ).map((u: any) => u._id),
        };
      case NotificationType.RemindUserToCompleteOnboarding:
        return {
          title: 'Fiks je basis. Begin nu!',
          message:
            'Goed bezig! Je hebt Ping Ping gedownload. Zet de volgende stap en begin met het fiksen van je basis!',
          payload: {
            custom: {
              type: args.type,
            },
          },
          recipientUserIds: (
            await User.find({
              ...BASE_QUERY(context.user.dataSet),
              routes: { $not: { $elemMatch: { routeId: 'financieleBasis' } } },
              tasks: {
                $elemMatch: {
                  status: TaskStatus.PendingUser,
                },
              },
            })
          ).map((u: any) => u._id),
        };
      case NotificationType.ManualAll:
        return {
          title: '',
          message:
            '',
          payload: {
            custom: {
              type: NotificationType.Manual,
            },
          },
          recipientUserIds: (
            await User.find({
              role: UserRole.User,
              dataSet: context.user.dataSet,
              devices: {
                $elemMatch: {
                  notificationStatus: NotificationStatus.Approved,
                },
              },
            },)
          ).map((u: any) => u._id),
        };
    }

    return {
      title: '',
      messsage: '',
      payload: {
        custom: {
          type: args.type,
        },
      },
      recipientUserIds: [],
    };
  },
  async getNotifications(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await NotificationModel.find({});
  },
  adminStatistics(root: any, args: QueryAdminStatisticsArgs, context: ContextType): any {
    return true;
  },

  async adminGetUsers(root: any, args: QueryAdminGetUsersArgs, context: ContextType): Promise<Array<any>> {
    let query: any = { dataSet: context.user.dataSet, role: { $in: args.roles } };

    switch (args.filter) {
      case UserFilter.NotAmsterdam:
        query.tasks = {
          $elemMatch: {
            taskId: 'onboarding.gemeente',
            status: TaskStatus.Dismissed,
          },
        };
        break;
      case UserFilter.SkippedOnboarding:
        query.tasks = {
          $elemMatch: {
            taskId: 'onboarding.welcome',
            status: TaskStatus.Dismissed,
          },
        };
        break;
      case UserFilter.OnboardingIncomplete:
        query.routes = { $not: { $elemMatch: { routeId: 'financieleBasis' } } };
        query.tasks = {
          $not: {
            $elemMatch: {
              taskId: 'onboarding.gemeente',
              status: TaskStatus.Dismissed,
            },
          },
        };
        break;
      case UserFilter.InactiveInFixJeBasis:
        query = {
          $and: [
            query,
            {
              $or: [
                {
                  activeAt: null,
                },
                {
                  activeAt: { $lt: moment().subtract(7, 'days').toDate() },
                },
              ],
            },
            {
              routes: {
                $elemMatch: {
                  routeId: 'financieleBasis',
                  status: UserRouteStatus.Active,
                },
              },
            },
          ],
        };
        break;
      case UserFilter.CompletedFixJeBasis:
        query = {
          $and: [
            query,
            {
              routes: {
                $elemMatch: {
                  routeId: 'financieleBasis',
                  status: UserRouteStatus.Completed,
                },
              },
            },
          ],
        };
        break;
    }

    return await User.find(query);
  },

  async adminGetAuditLog(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await AuditLog.find({ dataSet: context.user.dataSet });
  },

  async adminGetFeedback(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await RouteFeedback.find({ dataSet: context.user.dataSet });
  },
};
