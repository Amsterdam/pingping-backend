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
  NotificationDeliveryStatus,
  NotificationType,
  NotificationStatus,
} from '@models';
import AdminUtil from 'utils/AdminUtil';
import { ContextType } from 'lib/Context';
import { PushNotificationUtil } from 'utils/PushNotificationUtil';
import auth from 'lib/auth';
import { Device, User, UserDocument } from 'models/User';
import LogUtil from 'utils/LogUtil';
import RewardUtil from 'utils/RewardUtil';
import { NotificationModel } from 'models/Notification';

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
    { input }: MutationAdminSendNotificationsArgs,
    context: ContextType
  ): Promise<any> {
    let payload = PushNotificationUtil.getPayload(input.title, input.message, input.payload);
    let users: Array<UserDocument> = await User.find({ _id: { $in: input.recipientUserIds } });

    let tokens: Array<string> = users.reduce((tokens: any, user: UserDocument) => {
      // Find active devices
      let devices = user.devices.filter((d: Device) => d.notificationStatus === NotificationStatus.Approved);

      if (devices.length) {
        tokens.push(devices[0].token);
      }

      return tokens;
    }, []);

    const res = await PushNotificationUtil.send(tokens, payload);
    await LogUtil.create(
      context.user,
      AuditLogType.SendNotifications,
      `Send ${tokens.length} notifications: ${input.title}`
    );

    for (var r = 0; r < input.recipientUserIds.length; r++) {
      let user: string = input.recipientUserIds[r];
      await NotificationModel.create({
        user,
        status: NotificationDeliveryStatus.Delivered,
        type: input.type,
        payload,
      });
      await User.updateOne({ _id: user }, { remindedAt: new Date() });
    }

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
    await RewardUtil.deleteVoucher(args.id);

    return {
      message: 'sucess',
    };
  },

  async adminLogin(root: any, args: MutationAdminLoginArgs, context: ContextType): Promise<any> {
    const req: any = context.req;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const res: any = await auth.login(ip, args.email, args.password, args.deviceId);
    await LogUtil.create(res.user, AuditLogType.AdminLogin, 'Admin login');

    return {
      accessToken: res.accessToken,
      user: res.user,
    };
  },
};
