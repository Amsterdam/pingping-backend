import {
  MutationResolvers,
  UserGoalResponse,
  MutationCreateGoalArgs,
  MutationDeleteUserArgs,
  MessageResponse,
  MutationRegisterNotificationsArgs,
  MutationContactArgs,
} from '@models';
import _ from 'lodash';
import { ModuleContext } from '@graphql-modules/core';
import GoalUtil from 'utils/GoalUtil';
import { UserGoal } from 'models/UserGoal';
import { User } from 'models/User';
import { ContextType } from 'lib/Context';
import SendGridMail from '@sendgrid/mail';
import UserUtil from 'utils/UserUtil';

export const Mutation: MutationResolvers = {
  async contact(root: any, args: MutationContactArgs, context: ContextType): Promise<any> {
    try {
      SendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
    } catch {
      return 'configuration error';
    }

    const msg = {
      to: process.env.CONTACT_EMAIL,
      from: process.env.CONTACT_EMAIL,
      subject: 'Bericht van pingping.amsterdam.nl',
      html: `<strong>Naam: </strong>${args.input.name}<br/><strong>Email: </strong>${args.input.email}<br/><strong>Bericht: </strong>${args.input.body}<br/>`,
    };

    try {
      await SendGridMail.send(msg);
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