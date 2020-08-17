import _ from 'lodash';
import { UserTask } from './UserTask';
import { Types } from 'mongoose';
import { UserRouteStatus } from '../generated-models';

export class UserRoute {
  routeId: string;
  status: UserRouteStatus;
  progress: number;
  tasks: Types.Array<UserTask>;

  constructor(routeId: string, status: UserRouteStatus, tasks: Types.Array<UserTask>) {
    this.routeId = routeId;
    this.status = status;
    this.tasks = tasks;
    this.progress = 0;
  }
}
