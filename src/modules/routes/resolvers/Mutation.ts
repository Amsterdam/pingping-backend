import {
  MutationResolvers,
  MutationUpdateTaskArgs,
  MutationCreateRouteFeedbackArgs,
  MutationCompleteTaskArgs,
  MutationRevertTaskArgs,
} from '@models';
import { ModuleContext } from '@graphql-modules/core';
import TaskUtil from 'utils/TaskUtil';
import { RouteFeedback } from 'models/RouteFeedback';

export const Mutation: MutationResolvers = {
  async updateTask(root: any, args: MutationUpdateTaskArgs, context: ModuleContext): Promise<any> {
    let taskDef = TaskUtil.getDefinition(args.input.taskId);

    let task = await TaskUtil.handleTask(context.user, taskDef, args.input.answer || '');
    const nextTask = await TaskUtil.getNextTask(context.user);

    return {
      previousTask: task,
      nextTask: nextTask ? nextTask : undefined,
    };
  },

  async completeTask(root: any, args: MutationCompleteTaskArgs, context: ModuleContext): Promise<any> {
    let taskDef = TaskUtil.getDefinition(args.taskId);

    if (taskDef.id.indexOf('onboarding') !== -1) {
      throw new Error('onboarding_task_cannot_be_completed_must_be_updated');
    }

    let task = await TaskUtil.handleTask(context.user, taskDef);
    const nextTask = await TaskUtil.getNextTask(context.user);

    return {
      previousTask: task,
      nextTask: nextTask ? nextTask : undefined,
    };
  },

  async revertTask(root: any, args: MutationRevertTaskArgs, context: ModuleContext): Promise<any> {
    await TaskUtil.revertTask(context.user, args.taskId);

    return 'success';
  },

  async createRouteFeedback(root: any, args: MutationCreateRouteFeedbackArgs, context: ModuleContext): Promise<any> {
    const inst = await RouteFeedback.create({
      rating: args.input.rating,
      feedback: args.input.feedback,
      routeId: args.input.routeId,
      userId: context.user.id,
      dataSet: context.user.dataSet,
    });

    return inst;
  },
};
