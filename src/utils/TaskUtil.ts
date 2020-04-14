import _ from 'lodash'
import { UserDocument, UserTask } from '../models/User';
import { TaskStatus } from '../generated/graphql';
import { TaskDefinition } from '../types/global';
import InitialDataUtil from './InitialDataUtil';

class TaskUtil {
  static getDefinition (taskId:string):TaskDefinition {
    return InitialDataUtil.getTaskById(taskId)
  }

  static getUserTask(user:UserDocument, taskId:string):UserTask {
    const tasks:Array<UserTask> = user.tasks.filter((t:UserTask) => t.taskId === taskId)

    return _.first(tasks) ? Object.assign(new UserTask(), _.first(tasks)) : null
  }

  static getCurrentUserTask(user:UserDocument):UserTask {
    const tasks:Array<UserTask> = user.tasks.filter((t:UserTask) => t.status === TaskStatus.PendingUser)
    const task:UserTask = <UserTask> _.first(tasks)

    return Object.assign(new UserTask(), task)
  }
}

export default TaskUtil