import {
  MutationResolvers,
  UserGoalResponse,
  MutationCreateGoalArgs,
  MutationDeleteUserArgs,
  MessageResponse,
  MutationRegisterNotificationsArgs,
} from '@models';
import { ModuleContext } from '@graphql-modules/core';
import GoalUtil from 'utils/GoalUtil';
import { UserGoal } from 'models/UserGoal';
import { User } from 'models/User';
import { ContextType } from 'lib/Context';

export const Mutation: MutationResolvers = {
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
      await User.deleteOne({ _id: context.user._id });

      return {
        message: 'deleted',
      };
    }

    return {
      message: 'not_confirmed',
    };
  },

  // @todo Implement this
  async exportUser(root: any, args: any, context: ContextType): Promise<any> {
    return {
      token: 'placeholder_token',
    };
  },

  async importUser(root: any, args: any, context: ContextType): Promise<any> {
    // @todo Check the token

    return {
      message: 'error',
    };
  },

  async sendNotification(root: any, args: any, context: ContextType): Promise<any> {},

  async registerNotifications(root: any, args: MutationRegisterNotificationsArgs, context: ContextType): Promise<any> {
    context.device.token = args.input.deviceToken;
    context.device.notificationStatus = args.input.notificationStatus;

    await User.update(
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
