import _ from 'lodash';
import { UserTask } from 'models/UserTask';
import TaskUtil from 'utils/TaskUtil';
import { TaskDefinition, RouteDefinition } from 'types/global';
import { TaskStatus, TaskType } from '@models';
import { ModuleContext } from '@graphql-modules/core';

export const UserTaskResponse: any = {
  task: (doc: UserTask) => TaskUtil.getDefinition(doc.taskId),
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
  progress: (doc: RouteDefinition, args: any, context: ModuleContext) => {
    const tasks = context.user.tasks
      .filter((ut: UserTask) => ut.status === TaskStatus.Completed)
      .filter((ut: UserTask) => ut.routeId === doc.id);

    return _.round(tasks.length / doc.tasks.length, 2);
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