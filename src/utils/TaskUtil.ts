import _ from 'lodash'
import { UserDocument, UserTask } from '../models/User';
import { TaskStatus } from '../generated/graphql';
import { TaskDefinition } from '../types/global';
import InitialDataUtil from './InitialDataUtil';

class TaskUtil {
  static getDefinition (taskId:string):TaskDefinition {
    const taskFound = InitialDataUtil.getTaskById(taskId)

    if (!taskFound) {
      throw new Error(`taks definition not found for: ${taskId}`)
    }

    return {
      id: taskId,
      title: taskFound.title,
      description: taskFound.description,
      icon: taskFound.icon,
      type: taskFound.type
    }
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

  static async handleTask(userTask:UserTask) {
    switch (userTask.taskId) {
      default:
        // todo
    }
  }
}

export default TaskUtil