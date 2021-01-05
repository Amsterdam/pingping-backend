import {
  MutationResolvers,
  UserGoalResponse,
  MutationCreateGoalArgs,
  MutationDeleteUserArgs,
  MessageResponse,
  MutationRegisterNotificationsArgs,
  MutationContactArgs,
  AuditLogType,
} from '@models';
import _ from 'lodash';
import { ModuleContext } from '@graphql-modules/core';
import GoalUtil from 'utils/GoalUtil';
import { UserGoal } from 'models/UserGoal';
import { User } from 'models/User';
import { ContextType } from 'lib/Context';
import UserUtil from 'utils/UserUtil';
import LogUtil from 'utils/LogUtil';
import MailUtil from 'utils/MailUtil';

export const Mutation: MutationResolvers = {
  async contact(root: any, args: MutationContactArgs, context: ContextType): Promise<any> {
    console.log('contact', args);
    const html = `<strong>Naam: </strong>${args.input.name}<br/><strong>Email: </strong>${args.input.email}<br/><strong>Bericht: </strong>${args.input.body}<br/>`;

    try {
      await MailUtil.send(args.input.email, html);
      return 'success';
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);

        return 'error';
      }

      return 'unknown error';
    }
  },

  async createGoal(root: any, args: MutationCreateGoalArgs, context: ModuleContext): Promise<UserGoalResponse> {
    const userGoal: UserGoal = await GoalUtil.create(
      context.user,
      args.input.title,
      args.input.description,
      args.input.amount
    );

    return {
      id: userGoal._id,
      title: userGoal.title,
      description: userGoal.description,
      amount: userGoal.amount,
    };
  },

  async deleteUser(root: any, args: MutationDeleteUserArgs, context: ModuleContext): Promise<MessageResponse> {
    if (args.confirm === 'delete') {
      await LogUtil.create(context.user, AuditLogType.DeleteUser, 'User deleted his own account', context.user._id);
      await UserUtil.deleteUser(context.user);

      return {
        message: 'deleted',
      };
    }

    return {
      message: 'not_confirmed',
    };
  },

  async registerNotifications(root: any, args: MutationRegisterNotificationsArgs, context: ContextType): Promise<any> {
    context.device.token = args.input.deviceToken;
    context.device.notificationStatus = args.input.notificationStatus;

    await User.updateOne(
      { 'devices.id': context.device.id },
      {
        $set: {
          'devices.$.token': args.input.deviceToken,
          'devices.$.notificationStatus': args.input.notificationStatus,
        },
      }
    );

    return context.device;
  },
};
