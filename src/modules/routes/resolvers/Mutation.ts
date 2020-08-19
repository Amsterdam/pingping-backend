import { MutationResolvers, MutationUpdateTaskArgs, MutationCreateRouteFeedbackArgs } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import RouteUtil from 'utils/RouteUtil';
import TaskUtil from 'utils/TaskUtil';
import { RouteFeedback } from 'models/RouteFeedback';
import InitialDataUtil from 'utils/InitialDataUtil';

export const Mutation: MutationResolvers = {
  async updateTask(root: any, args: MutationUpdateTaskArgs, context: ModuleContext): Promise<any> {
    let taskDef = InitialDataUtil.getTaskById(args.input.taskId);

    // let task = TaskUtil.getUserTask(context.user, args.input.taskId);

    // if (!task) {
    //   // Look for RouteTask
    //   task = RouteUtil.getRouteTask(context.user, args.input.taskId);

    //   if (!task) {
    //     throw new Error('task_not_found_on_user');
    //   }
    // }

    let task = await TaskUtil.handleTask(context.user, taskDef, args.input.answer || '');
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
