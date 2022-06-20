import _ from 'lodash';
import { MutationResolvers, MutationRegisterDeviceArgs, RegisterDeviceResponse } from '@models';
import ValidationError from 'errors/ValidationError';
import UserUtil from 'utils/UserUtil';
import TaskUtil from 'utils/TaskUtil';
import { UserTask } from 'models/UserTask';

export const Mutation: MutationResolvers = {
  async registerDevice(root: any, args: MutationRegisterDeviceArgs): Promise<any> {
    if (args.input.deviceId.length < 12) {
      throw new ValidationError('deviceId is should be at least 12 characters');
    }

    const user = await UserUtil.createOrFindUser(args.input);
    const currentTask: UserTask = await TaskUtil.getCurrentUserTask(user);

    return {
      user,
      ..._.last(user.tokens),
      currentTask,
    };
  },
};
