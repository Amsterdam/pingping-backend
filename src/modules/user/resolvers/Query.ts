import { QueryResolvers } from '@models';
import TaskUtil from 'utils/TaskUtil';
import { ContextType } from 'lib/Context';

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
};
