import { UserRouteStatus } from '@models';
import { Types } from 'mongoose';
import { TaskDefinition } from '../types/global';

export class UserRoute {
  _id?: Types.ObjectId;
  routeId: string;
  status: UserRouteStatus;
  task: TaskDefinition;
  progress: number = null;

  constructor(routeId: string, status: UserRouteStatus, _id: Types.ObjectId = undefined) {
    this.routeId = routeId;
    this.status = status;
    this._id = _id;
  }
}
