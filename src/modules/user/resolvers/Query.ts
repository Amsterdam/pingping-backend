import { QueryResolvers } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import TaskUtil from 'utils/TaskUtil';
import { UserRoute } from 'models/UserRoute';
import RouteUtil from 'utils/RouteUtil';

export const Query: QueryResolvers = {
  getStatus(root: any, args: any, context: ModuleContext): any {
    const currentTask = TaskUtil.getCurrentUserTask(context.user);
    const previousTask = TaskUtil.getPreviousUserTask(context.user);
    const routes: Array<UserRoute> = RouteUtil.getCurrentUserRoutes(context.user);

    return {
      user: context.user,
      currentTask: currentTask ? currentTask : null,
      previousTask: previousTask || null,
      routes,
    };
  },
};
