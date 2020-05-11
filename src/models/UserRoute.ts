import { UserRouteResponse, UserRouteStatus } from '../generated/graphql';
import { UserTask } from './UserTask';
import { Types, Document } from 'mongoose';
import RouteUtil from '../utils/RouteUtil';

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

  toResponse ():UserRouteResponse {
    return {
      ...RouteUtil.getDefinition(this.routeId),
      routeId: this.routeId,
      status: this.status,
      progress: this.progress,
      tasks: []
    }
  }
}
