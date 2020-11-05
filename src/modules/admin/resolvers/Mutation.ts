import _ from 'lodash';
import {
  MutationResolvers,
  MutationAdminActionsArgs,
  AdminActionType,
  MutationSendNotificationsArgs,
  MutationAdminDeleteUserArgs,
  MutationAdminCreateUserArgs,
  MutationLoginArgs,
  AuditLogType,
} from '@models';
import AdminUtil from 'utils/AdminUtil';
import { ContextType } from 'lib/Context';
import { PushNotificationUtil } from 'utils/PushNotificationUtil';
import auth from 'lib/auth';
import { User } from 'models/User';
import LogUtil from 'utils/LogUtil';

export const Mutation: MutationResolvers = {
  async adminActions(root: any, args: MutationAdminActionsArgs, context: ContextType): Promise<any> {
    switch (args.type) {
      case AdminActionType.FixUsers:
        await AdminUtil.fixUsers();
        break;
      case AdminActionType.DeleteAllUsers:
        await AdminUtil.deleteAllUsers();
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

  async adminCreateUser(root: any, args: MutationAdminCreateUserArgs, context: ContextType): Promise<any> {
    const user = await auth.createUser(args.input.role, args.input.fullName, args.input.email, args.input.password);
    await LogUtil.create(context.user, AuditLogType.CreateUser, 'User created by admin');

    return user;
  },

  async adminDeleteUser(root: any, args: MutationAdminDeleteUserArgs, context: ContextType): Promise<any> {
    if (args.id === context.user.id) {
      throw new Error('cannot_self_delete');
    }

    await User.deleteOne({ _id: args.id });
    await LogUtil.create(context.user, AuditLogType.DeleteUser, 'User deleted by admin', args.id);

    return 'success';
  },

  async login(root: any, args: MutationLoginArgs, context: ContextType): Promise<any> {
    const res: any = await auth.login(args.email, args.password, args.deviceId);

    return {
      accessToken: res.accessToken,
      user: res.user,
    };
  },
};
