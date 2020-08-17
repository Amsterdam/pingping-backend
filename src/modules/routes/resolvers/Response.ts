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
};

export const TaskResponse: any = {
  taskId: (doc: TaskDefinition) => doc.id,
  title: (doc: TaskDefinition) => doc.title,
  headerTitle: (doc: TaskDefinition) => doc.headerTitle,
  description: (doc: TaskDefinition) => doc.description,
  media: (doc: TaskDefinition) => doc.media,
  choices: (doc: TaskDefinition) => doc.choices,
  type: (doc: TaskDefinition) => doc.type,
};

export const RouteResponse: any = {
  routeId: (doc: RouteDefinition) => doc.id,
  title: (doc: RouteDefinition) => doc.title,
  description: (doc: RouteDefinition) => doc.description,
  imageUrl: (doc: RouteDefinition) => doc.imageUrl,
  isSuggested: (doc: RouteDefinition) => false, // @todo Calculate
  totalPoints: (doc: RouteDefinition) => doc.tasks.reduce((sum: number, val: TaskDefinition) => sum + val.points, 0),
  numberOfSteps: (doc: RouteDefinition) => doc.tasks.length,
};

export const UserRouteResponse: any = {
  status: (doc: UserRoute) => doc.status,
  progress: (doc: UserRoute, args: any, context: ModuleContext) => {
    const definedTasks = InitialDataUtil.getRouteById(doc.routeId).tasks;
    const onboardingTasks = context.user.tasks
      .filter((ut: UserTask) => ut.status === TaskStatus.Completed)
      .filter((ut: UserTask) => (ut.routeTaskId || '').indexOf(`${doc.routeId}.`) !== -1);
    const routeTasks = doc.tasks.filter((ut: UserTask) => ut.status === TaskStatus.Completed);

    return _.round((onboardingTasks.length + routeTasks.length) / definedTasks.length, 2);
  },
  route: (doc: UserRoute) => InitialDataUtil.getRouteById(doc.routeId),
  tasks: (doc: UserRoute, args: any, context: ModuleContext) => {
    const definedTasks = InitialDataUtil.getRouteById(doc.routeId).tasks;

    return definedTasks.map((t: TaskDefinition) => {
      let status = TaskStatus.PendingUser;
      let answer = null;

      const taskFoundIndex = doc.tasks.map((ut: UserTask) => ut.taskId).indexOf(t.id);
      const onboardingTaskFoundIndex = context.user.tasks
        .map((ut: any) => InitialDataUtil.getTaskById(ut.taskId))
        .map((ut: any) => ut.routeTaskId)
        .indexOf(`${t.id}`);

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
        taskId: t.id,
        status,
        answer,
      };
    });
  },
};
