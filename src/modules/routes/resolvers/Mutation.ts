import {
  MutationResolvers,
  MutationUpdateTaskArgs,
  MutationCreateRouteFeedbackArgs,
  MutationCompleteTaskArgs,
} from '@models';
import { ModuleContext } from '@graphql-modules/core';
import TaskUtil from 'utils/TaskUtil';
import { RouteFeedback } from 'models/RouteFeedback';
import InitialDataUtil from 'utils/InitialDataUtil';

export const Mutation: MutationResolvers = {
  async updateTask(root: any, args: MutationUpdateTaskArgs, context: ModuleContext): Promise<any> {
    let taskDef = InitialDataUtil.getTaskById(args.input.taskId);

    let task = await TaskUtil.handleTask(context.user, taskDef, args.input.answer || '');
    const nextTask = TaskUtil.getNextTask(context.user);

    return {
      previousTask: task,
      nextTask: nextTask ? nextTask : undefined,
    };
  },

  async completeTask(root: any, args: MutationCompleteTaskArgs, context: ModuleContext): Promise<any> {
    let taskDef = InitialDataUtil.getTaskById(args.taskId);

    if (taskDef.id.indexOf('onboarding') !== -1) {
      throw new Error('onboarding_task_cannot_be_completed_must_be_updated');
    }

    let task = await TaskUtil.handleTask(context.user, taskDef);
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
