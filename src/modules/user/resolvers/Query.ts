import { QueryResolvers } from '@models';
import TaskUtil from 'utils/TaskUtil';
import { ContextType } from 'lib/Context';
import RouteUtil from 'utils/RouteUtil';
import { userInfo } from 'os';

export const Query: QueryResolvers = {
  async getStatus(root: any, args: any, context: ContextType): Promise<any> {
    let currentTask = TaskUtil.getCurrentUserTask(context.user);
    let previousTask = TaskUtil.getPreviousUserTask(context.user);

    if (!currentTask && !context.user.routes.length) {
      await RouteUtil.recoverUserStateTaskRemoved(context.user);
      currentTask = TaskUtil.getCurrentUserTask(context.user);
      previousTask = TaskUtil.getPreviousUserTask(context.user);
    }

    return {
      user: context.user,
      currentTask: currentTask ? currentTask : null,
      previousTask: previousTask || null,
      device: context.device,
    };
  },

  whoAmI(root: any, args: any, context: ContextType): any {
    return context.user;
  },

  getAchievements(root: any, args: any, context: ContextType): any {
    return [];
  },
};
