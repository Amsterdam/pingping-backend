import { Document } from 'mongoose';

export class UserAchievement extends Document {
  achievementId: string;
  createdAt: Date;

  constructor(achievementId: string) {
    super();
    this.achievementId = achievementId;
  }
}
