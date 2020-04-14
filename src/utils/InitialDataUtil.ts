import _ from 'lodash'
import { TaskStatus } from '../generated/graphql';
import { TaskDefinition, RouteDefinition } from '../types/global';
const initialData = require('../../initialData.json')

type TaskIdObject = {
  routeId:string
  taskId:string
}

// type InitialData = {
//   tasks: Array<TaskDefinition>,
//   routes: Array<RouteDefinition>
// }

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
    const tasks = initialData.tasks.filter((i:TaskDefinition) => i.id === id)
    const task:TaskDefinition = _.first(tasks)

    if (tasks.length && !task.title) {
      const taskObj = this.deconstructTaskId(id)
      const route = this.getRouteById(taskObj.routeId)

      if (route) {
        return this.getTaskFromArray(taskObj.taskId, route.tasks)
      }
    }

    return _.first(tasks)
  }

  static getInitialUserTasks ():Array<TaskDefinition> {
    const tasks = initialData.tasks

    console.log('init', initialData)

    return tasks.map((i:TaskDefinition) => {
      return {
        taskId: i.id,
        status: TaskStatus.PendingUser,
        type: i.type
      }
    })
  }
}

export default InitialDataUtil
