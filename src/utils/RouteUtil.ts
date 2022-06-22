import _ from 'lodash';
import { UserDocument, User } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import { RouteDefinition, TaskDefinition } from '../types/global';
import { UserTask } from '../models/UserTask';
import { TaskStatus } from '../generated-models';
import TaskUtil from './TaskUtil';
import { DATA_SET_AMSTERDAM, DATA_SET_NONE } from 'models/User';

class RouteUtil {
  static getProgress(user: UserDocument, route: RouteDefinition): number {
    const tasks =
      user.tasks
        .filter((ut: UserTask) => ut.status === TaskStatus.Completed)
        .filter((ut: UserTask) => ut.routeId === route.id) || [];

    return _.round(tasks.length / route.tasks.length, 2);
  }

  static getDefinition(routeId: string): RouteDefinition {
    try {
      const routeFound = InitialDataUtil.getRouteById(routeId);

      const def = {
        id: routeId,
        key: routeFound.key,
        title: routeFound.title,
        tasks: routeFound.tasks,
        isSuggested: routeFound.isSuggested,
        dataSet: routeFound.dataSet,
        tips: routeFound.tips || [],
        cover: routeFound.cover,
        targetAudience: routeFound.targetAudience,
      };

      return def;
    } catch (e) {
      if (e.message === `route_not_defined::${routeId}`) {
        return null;
      }

      throw e;
    }
  }

  static getRouteIdFromTaskId(id: string): string {
    const [routeId, taskId] = id.split('.');

    return routeId;
  }

  static getTaskIdFromRouteTask(key: string, dataset: string): string {
    const [routeId, taskId] = key.split('.');

    if (dataset === DATA_SET_AMSTERDAM || dataset === DATA_SET_NONE) {
      return `${routeId}.${taskId}`;
    }

    return `${routeId}-${dataset}.${taskId}`;
  }

  static async recoverUserStateTaskRemoved(user: UserDocument, task: UserTask = null): Promise<UserDocument> {
    if (task) {
      // Remove task from user
      user = TaskUtil.removeUserTask(user, task);
    }

    while (true) {
      let previousTask = TaskUtil.getPreviousUserTask(user);

      if (!previousTask) {
        // Add initial task
        user = await TaskUtil.assignInitialTasksToUser(user);
        break;
      }

      try {
        let previousTaskDef = TaskUtil.getDefinition(previousTask.taskId, user.dataSet);
        user = TaskUtil.addNextTaskAndRoute(user, previousTaskDef, previousTask.answer);

        break;
      } catch {
        user = TaskUtil.removeUserTask(user, task);
      }
    }

    await user.save();
    return user;
  }

  static getRouteTask(user: UserDocument, taskId: string): UserTask {
    let status = TaskStatus.PendingUser;
    let answer = null;

    let userTaskIndex = user.tasks.map((ut: UserTask) => ut.taskId).indexOf(taskId);

    try {
      TaskUtil.getDefinition(taskId, user.dataSet);

      if (userTaskIndex !== -1) {
        status = _.get(user, `tasks.${userTaskIndex}.status`);
        answer = _.get(user, `tasks.${userTaskIndex}.answer`);
      }

      return new UserTask(taskId, status, answer);
    } catch {
      return null;
    }

    return null;
  }
}

export default RouteUtil;
