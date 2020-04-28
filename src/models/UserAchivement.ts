import { TaskStatus, UserTaskResponse } from '../generated/graphql';
import { TaskDefinition } from 'global';
import TaskUtil from '../utils/TaskUtil';
import { Document } from 'mongoose';

export class UserAchivement extends Document {
  achivementId: string
  createdAt: Date

  constructor(achivementId:string) {
    super ()
    this.achivementId = achivementId;
  }

  toResponse ():UserTaskResponse {
    return {
      ...AchivementUtil.getDefinition(this.achivementId),
      achivementId: this.achivementId,
      createdAt: this.createdAt,
      answer: this.answer
    }
  }
}
