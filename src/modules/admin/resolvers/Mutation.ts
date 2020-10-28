import _ from 'lodash';
import { MutationResolvers, MutationAdminActionsArgs, AdminActionType, MutationSendNotificationsArgs } from '@models';
import AdminUtil from 'utils/AdminUtil';
import { ContextType } from 'lib/Context';
import { PushNotificationUtil } from 'utils/PushNotificationUtil';

export const Mutation: MutationResolvers = {
  async adminActions(root: any, args: MutationAdminActionsArgs, context: ContextType): Promise<any> {
    switch (args.type) {
      case AdminActionType.FixUsers:
        AdminUtil.fixUsers();
        break;
      case AdminActionType.DeleteAllUsers:
        AdminUtil.deleteAllUsers();
        break;
      default:
        throw new Error('invalid_admin_action');
    }

    return 'done';
  },

  async sendNotifications(root: any, args: MutationSendNotificationsArgs, context: ContextType): Promise<any> {
    const res = await PushNotificationUtil.send(args.deviceTokens.split(','), args.title, args.body);

    return {
      result: res,
    };
  },
};
