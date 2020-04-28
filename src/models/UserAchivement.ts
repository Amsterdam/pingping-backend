import { Document } from 'mongoose';

export class UserAchivement extends Document {
  achivementId: string
  createdAt: Date

  constructor(achivementId:string) {
    super ()
    this.achivementId = achivementId;
  }
}
