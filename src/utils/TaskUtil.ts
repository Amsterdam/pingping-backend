import _ from 'lodash'
import { UserDocument } from '../models/User';
import { UserTask } from '../models/UserTask';
import { TaskStatus, TaskType } from '../generated/graphql';
import { TaskDefinition } from '../types/global';
import InitialDataUtil from './InitialDataUtil';
import moment from 'moment';
import BadRequestError from '../errors/BadRequestError';

class TaskUtil {
  static getDefinition (taskId:string):TaskDefinition {
    const taskFound = InitialDataUtil.getTaskById(taskId)

    if (!taskFound) {
      throw new Error(`taks definition not found for: ${taskId}`)
    }

    const def = {
      id: taskId,
      title: taskFound.title,
      description: taskFound.description,
      routeTaskId: taskFound.routeTaskId,
      nextTaskId: taskFound.nextTaskId,
      nextRouteId: taskFound.nextRouteId,
      icon: taskFound.icon,
      type: taskFound.type
    }

    if (taskFound.routeTaskId) {
      return {
        ...def,
        ...InitialDataUtil.getTaskById(taskFound.routeTaskId),
      }
    }

    return def
  }

  static getUserTask(user:UserDocument, taskId:string):UserTask {
    const tasks:Array<UserTask> = user.tasks.filter((t:UserTask) => t.taskId === taskId)
    const firstTask = _.first(tasks)

    if (firstTask) {
      return new UserTask(firstTask.taskId, firstTask.status, firstTask.answer)
    }

    return null
  }

  static getCurrentUserTask(user:UserDocument):UserTask {
    const tasks:Array<UserTask> = user.tasks.filter((t:UserTask) => t.status === TaskStatus.PendingUser)
    const task:UserTask = <UserTask> _.first(tasks)

    return new UserTask(task.taskId, task.status, task.answer)
  }

  static async updateUserTask(user:UserDocument, userTask:UserTask) {
    let index = user.tasks.map((i:UserTask) => i.taskId).indexOf(userTask.taskId)

    if (index !== -1) {
      user.tasks.set(index, userTask)
    }

    await user.save()
  }

  static getNextTask(user:UserDocument):UserTask {
    const tasks = user.tasks.filter((t:UserTask) =>  t.status === TaskStatus.PendingUser)

    if (tasks.length) {
      const firstTask = _.first(tasks);
      return new UserTask(firstTask.taskId, firstTask.status, firstTask.answer)
    }
  }

  static async addNextTaskToUseer(user:UserDocument, taskId:string):Promise<UserTask> {
    const taskDef:TaskDefinition = InitialDataUtil.getTaskById(taskId)

    const userTask:UserTask = new UserTask(taskDef.id, TaskStatus.PendingUser, taskDef.type)
    user.tasks.push(userTask)
    await user.save()

    return userTask
  }

  static async handleTask(user:UserDocument, taskId:string, answer:string):Promise<UserTask> {
    const userTask = this.getUserTask(user, taskId)
    const taskDef:TaskDefinition = InitialDataUtil.getTaskById(taskId)

    userTask.status = TaskStatus.Completed
    userTask.answer = answer

    switch (taskDef.type) {
      case TaskType.DateOfBirth:
        // Check date
        const date = moment(answer, 'YYYY-MM-DD')

        if (!date.isValid()) {
          throw new BadRequestError('invalid date input, expecting YYYY-MM-DD')
        }
      default:
        // no validation
    }

    if (taskDef.nextTaskId) {
      await this.addNextTaskToUseer(user, taskDef.nextTaskId)
    }

    await this.updateUserTask(user, userTask)

    return userTask
  }
}

export default TaskUtil