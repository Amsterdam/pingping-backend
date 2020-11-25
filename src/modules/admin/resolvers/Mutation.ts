import _ from 'lodash';
import {
  MutationResolvers,
  MutationAdminActionsArgs,
  AdminActionType,
  MutationAdminDeleteUserArgs,
  MutationAdminCreateUserArgs,
  MutationAdminLoginArgs,
  AuditLogType,
  MutationAdminSendNotificationsArgs,
  MutationAdminDeleteRewardVoucherArgs,
  MessageResponse,
} from '@models';
import AdminUtil from 'utils/AdminUtil';
import { ContextType } from 'lib/Context';
import { PushNotificationUtil } from 'utils/PushNotificationUtil';
import auth from 'lib/auth';
import { User } from 'models/User';
import LogUtil from 'utils/LogUtil';
import { RewardVoucher } from 'models/RewardVoucher';

export const Mutation: MutationResolvers = {
  async adminActions(root: any, args: MutationAdminActionsArgs, context: ContextType): Promise<any> {
    switch (args.type) {
      case AdminActionType.FixUsers:
        await AdminUtil.fixUsers();
        break;
      default:
        throw new Error('invalid_admin_action');
    }

    return 'done';
  },

  async adminSendNotifications(
    root: any,
    args: MutationAdminSendNotificationsArgs,
    context: ContextType
  ): Promise<any> {
    const res = await PushNotificationUtil.send(args.deviceTokens.split(','), args.title, args.body);
    await LogUtil.create(
      context.user,
      AuditLogType.SendNotifications,
      `Send ${args.deviceTokens.length} notifications: ${args.body}`
    );

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

  async adminDeleteRewardVoucher(
    root: any,
    args: MutationAdminDeleteRewardVoucherArgs,
    context: ContextType
  ): Promise<MessageResponse> {
    await RewardVoucher.deleteOne({
      _id: args.id,
    });
    await User.update({}, { $pull: { 'rewards.$.sessions': { voucherId: args.id } } });

    return {
      message: 'sucess',
    };
  },

  async adminLogin(root: any, args: MutationAdminLoginArgs, context: ContextType): Promise<any> {
    const res: any = await auth.login(args.email, args.password, args.deviceId);
    await LogUtil.create(res.user, AuditLogType.AdminLogin, 'Admin login');

    return {
      accessToken: res.accessToken,
      user: res.user,
    };
  },
};
