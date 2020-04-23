import _ from 'lodash'
import { TaskStatus } from '../generated/graphql';
import { TaskDefinition, RouteDefinition } from '../types/global';
import { UserTask } from '../models/User';
const initialData:InitialData = require('../../initialData.json')

type InitialData = {
  onboardingTasks: [TaskDefinition]
}

type OnboardingTaskDefinition = TaskDefinition & {
  nextTaskId?: string
  nextRotueId?: string
}

type TaskIdObject = {
  routeId:string
  taskId:string
}

class InitialDataUtil {
  // Task id can conlude a refereice to a route like this Route.taskId. Here we deconstruct it.
  static deconstructTaskId (id:string):TaskIdObject {
    const [routeId, taskId] = id.split('.')

    return {
      routeId,
      taskId
    }
  }

  static getTaskFromArray (id:string, items:Array<TaskDefinition>):TaskDefinition {
    const tasks = items.filter((i:TaskDefinition) => i.id === id)

    return _.first(tasks)
  }

  static getRouteById (id:string):RouteDefinition {
    return _.get(initialData, `routes.${id}`)
  }

  static getTaskById (id:string):TaskDefinition {
    const tasks = initialData.onboardingTasks.filter((i:TaskDefinition) => i.id === id)
    const task:TaskDefinition = _.first(tasks)

    if (tasks.length && !task.title) {
      const taskObj = this.deconstructTaskId(id)
      const route = this.getRouteById(taskObj.routeId)

      if (route) {
        return this.getTaskFromArray(taskObj.taskId, route.tasks)
      }
    }

    if (!tasks.length) {
      throw new Error(`task with id: ${id} not found!`)
    }

    return _.first(tasks)
  }

  static getInitialUserOnboardingTasks ():Array<any> {
    const tasks = initialData.onboardingTasks.filter((i:any) => i.initial && i.initial === true)

    return tasks.map((i:OnboardingTaskDefinition) => {
      return {
        taskId: i.id,
        status: TaskStatus.PendingUser,
        type: i.type
      }
    })
  }
}

export default InitialDataUtil
