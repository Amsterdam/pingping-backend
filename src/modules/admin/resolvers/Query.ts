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
          title:
            'Je hebt nog een openstaande actie in je “fiks de basis route”. Zet de volgende stap, verdien punten en kom dichter bij je doel!',
          message: '',
          payload: {
            custom: {
              routeId: args.routeId,
              type: args.type,
            },
          },
          recipientUserIds: (
            await User.find({
              ...BASE_QUERY,
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
          title: "Don't forget to complete your onboarding",
          message: '',
          payload: {
            custom: {
              type: args.type,
            },
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
    let query: any = { role: { $in: args.roles } };

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
    }

    return await User.find(query);
  },

  async adminGetAuditLog(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await AuditLog.find({});
  },

  async adminGetFeedback(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await RouteFeedback.find({});
  },
};
