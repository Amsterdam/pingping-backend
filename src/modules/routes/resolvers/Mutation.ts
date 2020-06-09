import { MutationResolvers, MutationStartRouteArgs, MutationUpdateTaskArgs, UpdateTaskResponse } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import InitialDataUtil from 'utils/InitialDataUtil';
import RouteUtil from 'utils/RouteUtil';
import TaskUtil from 'utils/TaskUtil';

export const Mutation: MutationResolvers = {
  async startRoute(root: any, args: MutationStartRouteArgs, context: ModuleContext): Promise<any> {
    // Check if exists
    let routeDef = InitialDataUtil.getRouteById(args.routeId);

    const userRoute = await RouteUtil.assignToUser(context.user, args.routeId);

    return userRoute;
  },

  async updateTask(root: any, args: MutationUpdateTaskArgs, context: ModuleContext): Promise<any> {
    let task = TaskUtil.getUserTask(context.user, args.input.taskId);

    if (!task) {
      throw new Error('task_not_found_on_user');
    }

    task = await TaskUtil.handleTask(context.user, args.input.taskId, args.input.answer || '');

    const nextTask = TaskUtil.getNextTask(context.user);

    return {
      previousTask: task,
      nextTask: nextTask ? nextTask : undefined,
    };
  },
};
