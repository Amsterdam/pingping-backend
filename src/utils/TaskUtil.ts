import _ from 'lodash';
import { UserDocument, User } from '../models/User';
import { UserTask } from '../models/UserTask';
import { RouteDefinition, TaskDefinition } from '../types/global';
import InitialDataUtil from './InitialDataUtil';
import moment from 'moment';
import BadRequestError from '../errors/BadRequestError';
import RouteUtil from './RouteUtil';
import { TaskStatus, TaskType, UserRouteStatus } from '../generated-models';
import TransactionUtil from './TransactionUtil';
import { UserRoute } from 'models/UserRoute';

class TaskUtil {
  static getProgress(taskId: string): number {
    if (taskId.indexOf('onboarding.') !== -1) {
      return InitialDataUtil.getOnboardingProgress(taskId);
    }

    // GetRoute
    const tasks = InitialDataUtil.getRouteById(InitialDataUtil.getRouteIdFromTaskId(taskId)).tasks;
    const index = tasks.map((i) => i.id).indexOf(taskId);

    return _.round((index + 1) / tasks.length, 2);
  }

  static getDefinition(taskId: string): TaskDefinition {
    const taskFound = InitialDataUtil.getTaskById(taskId);

    if (!taskFound) {
      throw new Error(`taks definition not found for: ${taskId}`);
    }

    const def = {
      id: taskId,
      title: taskFound.title,
      headerTitle: taskFound.headerTitle,
      choices: taskFound.choices,
      points: taskFound.points,
      progress: TaskUtil.getProgress(taskId),
      description: taskFound.description,
      routeTaskId: taskFound.routeTaskId,
      nextTaskId: taskFound.nextTaskId,
      nextRouteId: taskFound.nextRouteId,
      defaultValue: taskFound.defaultValue,
      media: taskFound.media,
      icon: taskFound.icon,
      type: taskFound.type,
    };

    // If there is a reference to an actual routeTask we show that
    if (taskFound.routeTaskId) {
      return {
        ...InitialDataUtil.getTaskById(taskFound.routeTaskId),
        ..._.pickBy(def, _.identity), // Remove undefined
        id: taskId,
      };
    }

    return def;
  }

  static getUserTask(user: UserDocument, taskId: string): UserTask {
    const tasks: Array<UserTask> = user.tasks.filter((t: UserTask) => t.taskId === taskId);
    const firstTask = _.first(tasks);

    if (firstTask) {
      return new UserTask(firstTask.taskId, firstTask.status, firstTask.answer);
    }

    return new UserTask(taskId, TaskStatus.PendingUser, null);
  }

  static getRouteIdFromTaskId(id: string): string {
    const [routeId, taskId] = id.split('.');

    return routeId;
  }

  static getCurrentUserTask(user: UserDocument): UserTask {
    const tasks: Array<UserTask> = user.tasks.filter((t: UserTask) => t.status === TaskStatus.PendingUser);
    const task: UserTask = <UserTask>_.nth(tasks, 1) || <UserTask>_.first(tasks);

    if (task) {
      return new UserTask(task.taskId, task.status, task.answer, task._id);
    }

    return null;
  }

  static getPreviousUserTask(user: UserDocument): UserTask {
    const tasks: Array<UserTask> = user.tasks.filter((t: UserTask) => t.status !== TaskStatus.PendingUser);
    const task: UserTask = <UserTask>_.last(tasks);

    if (task) {
      return new UserTask(task.taskId, task.status, task.answer, task._id);
    }

    return null;
  }

  static updateUserTask(user: UserDocument, userTask: UserTask): UserDocument {
    let index = user.tasks.map((i: UserTask) => i.taskId).indexOf(userTask.taskId);

    if (index !== -1) {
      user.tasks.set(index, userTask);
    } else {
      user.tasks.push(userTask);
    }

    return user;
  }

  static removeUserTask(user: UserDocument, userTask: UserTask): UserDocument {
    user.tasks.pull({ _id: userTask._id });

    return user;
  }

  static getNextTask(user: UserDocument): UserTask {
    const tasks = user.tasks.filter((t: UserTask) => t.status === TaskStatus.PendingUser);

    if (tasks.length) {
      const firstTask = _.first(tasks);
      return new UserTask(firstTask.taskId, firstTask.status, firstTask.answer);
    }
  }

  static addRouteToUser(user: UserDocument, routeId: string): UserDocument {
    let index = (_.get(user, 'routes', []) as Array<UserRoute>).map((i: UserRoute) => i.routeId).indexOf(routeId);

    // Only add it if it doesn already exist
    if (!routeId || index !== -1) {
      return user;
    }

    const routeDef: RouteDefinition = InitialDataUtil.getRouteById(routeId);
    const userRoute: UserRoute = new UserRoute(routeDef.id, UserRouteStatus.Active);
    if (!user.routes) {
      user.routes = [] as any;
    }

    user.routes.push(userRoute);

    return user;
  }

  static addNextTaskToUser(user: UserDocument, taskId: string): UserDocument {
    let index = user.tasks.map((i: UserTask) => i.taskId).indexOf(taskId);

    // Only add it if it doesn already exist
    if (!taskId || index !== -1) {
      return user;
    }

    const taskDef: TaskDefinition = InitialDataUtil.getTaskById(taskId);

    const userTask: UserTask = new UserTask(taskDef.id, TaskStatus.PendingUser);
    userTask.routeTaskId = taskDef.routeTaskId;
    userTask.routeId = RouteUtil.getRouteIdFromTaskId(taskDef.routeTaskId || taskId);
    user.tasks.push(userTask);

    return user;
  }

  static getNextTaskOrRouteId(answer: string, next: string | object): string {
    answer = typeof answer === 'boolean' ? (answer ? 'yes' : 'no') : answer;

    if (typeof next === 'string') {
      return next;
    }

    return _.get(next, answer.toLowerCase());
  }

  static async revertTask(user: UserDocument, taskId: string) {
    const currentUserTask = TaskUtil.getCurrentUserTask(user);

    // Revert the task and delete the latest one
    let userTask = TaskUtil.getUserTask(user, taskId);
    userTask.status = TaskStatus.PendingUser;
    user = TaskUtil.updateUserTask(user, userTask);

    user = TaskUtil.removeUserTask(user, currentUserTask);
    await user.save();
  }

  static async handleTask(user: UserDocument, taskDef: TaskDefinition, answer: string = null): Promise<UserTask> {
    const userTask = this.getUserTask(user, taskDef.id);

    userTask.routeTaskId = taskDef.routeTaskId;
    userTask.routeId = RouteUtil.getRouteIdFromTaskId(taskDef.routeTaskId || taskDef.id);
    const oldStatus = userTask.status;

    if (answer) {
      userTask.status =
        (taskDef.type === TaskType.YesOrNo || taskDef.type === TaskType.Confirm) && answer === 'no'
          ? TaskStatus.Dismissed
          : TaskStatus.Completed;
      userTask.answer = answer;

      switch (taskDef.type) {
        case TaskType.DateOfBirth:
          // Check date
          const date = moment(answer, 'YYYY-MM-DD');
          user.profile.dateOfBirth = date.toDate();

          if (!date.isValid()) {
            throw new BadRequestError('invalid date input, expecting YYYY-MM-DD');
          }
        default:
        // no validation
      }
    } else {
      userTask.status = TaskStatus.Completed;
      userTask.completedAt = new Date();
    }

    if (taskDef.points && oldStatus !== TaskStatus.Completed && userTask.status === TaskStatus.Completed) {
      await TransactionUtil.addTransaction(user, `Voltooid: ${taskDef.title}`, taskDef.points, taskDef.id);
    }

    if (taskDef.nextTaskId) {
      user = this.addNextTaskToUser(user, this.getNextTaskOrRouteId(answer, taskDef.nextTaskId));
    }

    if (taskDef.nextRouteId) {
      user = this.addRouteToUser(user, this.getNextTaskOrRouteId(answer, taskDef.nextRouteId));
    }

    user = this.updateUserTask(user, userTask);
    user.activeAt = new Date();
    await User.findOneAndUpdate({ _id: user._id }, user);

    return userTask;
  }
}

export default TaskUtil;
