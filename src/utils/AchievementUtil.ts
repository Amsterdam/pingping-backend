import InitialDataUtil from './InitialDataUtil';
import { AchievementDefinition } from 'types/global';
import { UserDocument } from '../models/User';
import { UserAchievement } from '../models/UserAchievement';
import TransactionUtil from './TransactionUtil';

class AchievementUtil {
  static getDefinition(id: string): AchievementDefinition {
    const achievement = InitialDataUtil.getAchievementById(id);

    return {
      id,
      title: achievement.title,
      description: achievement.description,
      points: achievement.points,
      icon: achievement.icon,
    };
  }

  static async create(user: UserDocument, id: string): Promise<UserAchievement> {
    const def: AchievementDefinition = InitialDataUtil.getAchievementById(id);

    // Check if it exists
    const indexFound = user.achievements.map((a: UserAchievement) => a.achievementId).indexOf(id);

    // Passive check if already earned
    if (indexFound !== -1) {
      return user.achievements[indexFound];
    }

    const userAchievement: UserAchievement = {
      achievementId: id,
      createdAt: new Date(),
    } as UserAchievement;

    // If the achievement has a point value to it, we need to update the users balance
    if (def.points && def.points > 0) {
      await TransactionUtil.addTransaction(user, def.title, def.points, def.id);
    }

    const res = user.achievements.push(userAchievement);
    await user.save();

    return user.achievements[res - 1];
  }
}

export default AchievementUtil;
