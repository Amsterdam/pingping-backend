import { QueryResolvers } from '@models';
import TaskUtil from 'utils/TaskUtil';
import { ContextType } from 'lib/Context';
import { User } from 'models/User';
import { QueryGetUsersArgs } from 'generated-models';
import auth from 'lib/auth';
import UnauthorizedError from 'errors/UnauthorizedError';

export const Query: QueryResolvers = {
  getStatus(root: any, args: any, context: ContextType): any {
    const currentTask = TaskUtil.getCurrentUserTask(context.user);
    const previousTask = TaskUtil.getPreviousUserTask(context.user);

    return {
      user: context.user,
      currentTask: currentTask ? currentTask : null,
      previousTask: previousTask || null,
      device: context.device,
    };
  },

  getAchievements(root: any, args: any, context: ContextType): any {
    return [];
  },

  async getUsers(root: any, args: QueryGetUsersArgs, context: ContextType): Promise<Array<any>> {
    const user = await auth.getUser(args.token);
    const device = await auth.getDevice(args.token);

    if (!user || !device || device.id !== process.env.SECRET.substr(0, 12)) {
      throw new UnauthorizedError();
    }

    console.log('newContext', device, device.id !== process.env.SECRET.substr(0, 12));

    return await User.find({});
  },
};
