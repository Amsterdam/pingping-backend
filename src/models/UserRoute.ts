import _ from 'lodash';
import { UserTask } from './UserTask';
import { Types, Document } from 'mongoose';
import RouteUtil from '../utils/RouteUtil';
import { TaskDefinition } from '../types/global';
import { UserDocument } from './User';
import InitialDataUtil from '../utils/InitialDataUtil';
import { UserRouteResponse, UserRouteStatus, TaskStatus } from '../generated-models';

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
