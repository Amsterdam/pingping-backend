import _ from 'lodash';
import { UserDocument, User } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import { RouteDefinition, TaskDefinition } from '../types/global';
import { UserTask } from '../models/UserTask';
import { TaskStatus } from '../generated-models';
import TaskUtil from './TaskUtil';

class RouteUtil {
  static getDefinition(routeId: string): RouteDefinition {
    try {
      const routeFound = InitialDataUtil.getRouteById(routeId);

      const def = {
        title: routeFound.title,
        tasks: routeFound.tasks,
        isSuggested: routeFound.isSuggested,
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

  static getRouteTask(user: UserDocument, taskId: string): UserTask {
    let status = TaskStatus.PendingUser;
    let answer = null;

    let userTaskIndex = user.tasks.map((ut: UserTask) => ut.taskId).indexOf(taskId);
    let taskDef = TaskUtil.getDefinition(taskId);

    if (!taskDef) {
      return null;
    }

    if (userTaskIndex !== -1) {
      status = _.get(user, `tasks.${userTaskIndex}.status`);
      answer = _.get(user, `tasks.${userTaskIndex}.answer`);
    }

    return new UserTask(taskId, status, answer);
  }
}

export default RouteUtil;
