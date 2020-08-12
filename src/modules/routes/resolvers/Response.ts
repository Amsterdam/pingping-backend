import _ from 'lodash';
import { UserTask } from 'models/UserTask';
import TaskUtil from 'utils/TaskUtil';
import { TaskDefinition, RouteDefinition } from 'types/global';
import { UserRoute } from 'models/UserRoute';
import { TaskStatus } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { ModuleContext } from '@graphql-modules/core';

export const UserTaskResponse: any = {
  status: (doc: UserTask) => doc.status,
  answer: (doc: UserTask) => doc.answer,
  task: (doc: UserTask) => TaskUtil.getDefinition(doc.taskId),
  progress: (doc: UserTask) => 0.1, // @todo Calculate
};

export const TaskResponse: any = {
  taskId: (doc: TaskDefinition) => doc.id,
  title: (doc: TaskDefinition) => doc.title,
  headerTitle: (doc: TaskDefinition) => doc.headerTitle,
  description: (doc: TaskDefinition) => doc.description,
  media: (doc: TaskDefinition) => doc.media,
  choices: (doc: TaskDefinition) => doc.choices,
  type: (doc: TaskDefinition) => doc.type,
  progressPercentile: (doc: TaskDefinition) => 0,
};

export const RouteResponse: any = {
  routeId: (doc: RouteDefinition) => doc.id,
  title: (doc: RouteDefinition) => doc.title,
  description: (doc: RouteDefinition) => doc.description,
  imageUrl: (doc: RouteDefinition) => doc.imageUrl,
  isSuggested: (doc: RouteDefinition) => false, // @todo Calculate
  numberOfSteps: (doc: RouteDefinition) => doc.tasks.length,
};

export const UserRouteResponse: any = {
  status: (doc: UserRoute) => doc.status,
  progress: (doc: UserRoute) => doc.progress,
  route: (doc: UserRoute) => InitialDataUtil.getRouteById(doc.routeId),
  tasks: (doc: UserRoute, args: any, context: ModuleContext) => {
    return doc.tasks.map((task: UserTask) => {
      let status = TaskStatus.PendingUser;
      let answer = null;

      // Look for completed tasks
      const taskFoundIndex = doc.tasks.map((t: UserTask) => t.taskId).indexOf(task.taskId);
      const onboardingTaskFoundIndex = context.user.tasks
        .map((t: any) => InitialDataUtil.getTaskById(t.taskId))
        .map((t: any) => t.routeTaskId)
        .indexOf(`${doc.routeId}.${task.taskId}`);

      if (taskFoundIndex !== -1) {
        status = _.get(doc, `${taskFoundIndex}.status`, TaskStatus.PendingUser);
        answer = _.get(doc, `${taskFoundIndex}.answer`);
      } else if (onboardingTaskFoundIndex !== -1) {
        status =
          _.get(context.user.tasks, `${onboardingTaskFoundIndex}.status`) === TaskStatus.Dismissed
            ? TaskStatus.PendingUser
            : TaskStatus.Completed;
        answer = _.get(context.user.tasks, `${onboardingTaskFoundIndex}.answer`);
      }

      return {
        status,
        answer,
        taskId: task.taskId,
      };
    });
  },
};
