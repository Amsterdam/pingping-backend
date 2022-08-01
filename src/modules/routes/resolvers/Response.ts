import _ from 'lodash';
import { UserTask } from 'models/UserTask';
import TaskUtil from 'utils/TaskUtil';
import { TaskDefinition, RouteDefinition } from 'types/global';
import { TaskStatus, TaskType, UserRole } from '@models';
import { ModuleContext } from '@graphql-modules/core';
import { ContextType } from 'lib/Context';
import { RouteFeedback } from 'models/RouteFeedback';
import RouteUtil from 'utils/RouteUtil';

export const UserTaskResponse: any = {
  task: async (doc: UserTask, args: any, context: ContextType) => {
    try {
      return TaskUtil.getDefinition(doc.taskId, context?.user?.dataSet);
    } catch {
      return null;
    }
  },
  answer: (doc: UserTask, args: any, context: ContextType) => {
    let user = context.user;

    if (!user && doc.user) {
      user = doc.user;
    }

    try {
      const def = TaskUtil.getDefinition(doc.taskId, user.dataSet);

      if (user?.role === UserRole.User) {
        return doc.answer;
      }

      if (doc.status === TaskStatus.PendingUser && def.defaultValue) {
        return def.defaultValue;
      }

      return '##redacted##';
    } catch {
      return '';
    }
  },
};

export const TaskResponse: any = {
  taskId: (doc: TaskDefinition) => doc.id,
  type: (doc: TaskDefinition) => doc.type || TaskType.Other,
};

export const RouteResponse: any = {
  routeId: (doc: RouteDefinition) => doc.id,
  coverImageUrl: (doc: RouteDefinition) => `${doc.imageUrl}`,
  totalPoints: (doc: RouteDefinition) => doc.tasks.reduce((sum: number, val: TaskDefinition) => sum + val.points, 0),
  numberOfSteps: (doc: RouteDefinition) => doc.tasks.length,
  hasSubmittedFeedback: async (doc: RouteDefinition, args: any, context: ModuleContext) => {
    let numberOfFeedbacks = await RouteFeedback.countDocuments({ routeId: doc.id, userId: context.user._id });

    return numberOfFeedbacks >= 1;
  },
  progress: (doc: RouteDefinition, args: any, context: ModuleContext) => {
    return RouteUtil.getProgress(context.user, doc);
  },
  tasks: (doc: RouteDefinition, args: any, context: ModuleContext) => {
    return doc.tasks.map((t: TaskDefinition) => {
      let status = TaskStatus.PendingUser;
      let answer = null;

      const taskFound = context.user.tasks
        .filter((ut: UserTask) => ut.routeTaskId === t.id || ut.taskId === t.id)
        .reduce((val: UserTask, item: any) => {
          if (!val) {
            return item;
          }

          if (val.status === TaskStatus.Dismissed) {
            val.status = item.status;
          }

          return val;
        }, null);

      if (taskFound) {
        status =
          _.get(taskFound, `status`, TaskStatus.PendingUser) === TaskStatus.Dismissed
            ? TaskStatus.PendingUser
            : TaskStatus.Completed;
        answer = _.get(taskFound, `answer`);
      }

      return {
        taskId: t.id,
        status,
        answer,
      };
    });
  },
};
