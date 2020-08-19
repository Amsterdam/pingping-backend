import _ from 'lodash';
import { UserTask } from './UserTask';
import { Types } from 'mongoose';
import { UserRouteStatus } from '../generated-models';

export class UserRoute {
  routeId: string;
  status: UserRouteStatus;

  constructor(routeId: string, status: UserRouteStatus) {
    this.routeId = routeId;
    this.status = status;
  }
}
