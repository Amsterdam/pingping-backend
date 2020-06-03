import _ from 'lodash'
import { UserTask } from './UserTask';
import { Types, Document } from 'mongoose';
import RouteUtil from '../utils/RouteUtil';
import { TaskDefinition } from '../types/global';
import { UserDocument } from './User';
import InitialDataUtil from '../utils/InitialDataUtil';
import { UserRouteResponse, UserRouteStatus, TaskStatus } from '../generated-models';

export class UserRoute {
  routeId: string
  status: UserRouteStatus
  progress: number
  tasks: Types.Array<UserTask>

  constructor(routeId:string, status:UserRouteStatus, tasks:Types.Array<UserTask>) {
    this.routeId = routeId;
    this.status = status;
    this.tasks = tasks
    this.progress = 0
  }

  toResponse (user:UserDocument):UserRouteResponse {
    const def = RouteUtil.getDefinition(this.routeId)

    return {
      ...def,
      routeId: this.routeId,
      status: this.status,
      progress: this.progress,
      tasks: def.tasks.map((taskDef:TaskDefinition) => {
        let status = TaskStatus.PendingUser
        let answer = null

        // Look for completed tasks
        const taskFoundIndex = this.tasks.map(t => t.taskId).indexOf(taskDef.id)
        const onboardingTaskFoundIndex = user.tasks.map(t => InitialDataUtil.getTaskById(t.taskId)).map(t => t.routeTaskId).indexOf(`${this.routeId}.${taskDef.id}`)

        if (taskFoundIndex !== -1) {
          status = _.get(this.tasks, `${taskFoundIndex}.status`, TaskStatus.PendingUser)
          answer = _.get(this.tasks, `${taskFoundIndex}.answer`)
        } else if (onboardingTaskFoundIndex !== -1) {
          status = _.get(user.tasks, `${onboardingTaskFoundIndex}.status`) === TaskStatus.Dismissed ? TaskStatus.PendingUser : TaskStatus.Completed
          answer = _.get(user.tasks, `${onboardingTaskFoundIndex}.answer`)
        }

        return {
          ...taskDef,
          taskId: taskDef.id,
          status,
          title: taskDef.title,
          description: taskDef.description,
          type: taskDef.type,
          answer
        }
      })
    }
  }
}
