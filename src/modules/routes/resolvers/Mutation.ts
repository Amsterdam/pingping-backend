import {
  MutationResolvers,
  MutationStartRouteArgs,
  MutationUpdateTaskArgs,
  UpdateTaskResponse,
  MutationCreateRouteFeedbackArgs,
} from '@models';
import { ModuleContext } from '@graphql-modules/core';
import InitialDataUtil from 'utils/InitialDataUtil';
import RouteUtil from 'utils/RouteUtil';
import TaskUtil from 'utils/TaskUtil';
import { RouteFeedback } from 'models/RouteFeedback';

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

  async createRouteFeedback(root: any, args: MutationCreateRouteFeedbackArgs, context: ModuleContext): Promise<any> {
    const inst = await RouteFeedback.create({
      routeId: args.input.routeId,
      taskName: args.input.taskName,
      feedback: args.input.feedback,
      userId: context.user.id,
    });

    return {
      taskName: inst.taskName,
      feedback: inst.feedback,
    };
  },
};
