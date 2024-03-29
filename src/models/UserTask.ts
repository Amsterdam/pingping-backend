import { TaskStatus } from '@models';
import { Types } from 'mongoose';
import { TaskDefinition } from '../types/global';
import { UserDocument } from 'models/User';

export class UserTask {
  _id?: Types.ObjectId;
  taskId: string;
  routeTaskId: string;
  routeId: string;
  answer: string;
  status: TaskStatus;
  task: TaskDefinition;
  completedAt?: Date;
  user: UserDocument;
  progress: number = null;

  constructor(
    taskId: string,
    status: TaskStatus,
    answer: string = null,
    _id: Types.ObjectId = undefined,
    user: UserDocument = undefined
  ) {
    this.taskId = taskId;
    this.status = status;
    this.answer = answer;
    this._id = _id;
    this.user = user;
  }
}
