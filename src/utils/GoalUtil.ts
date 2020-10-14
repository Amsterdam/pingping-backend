import { UserDocument } from '../models/User';
import { UserGoal } from '../models/UserGoal';

class GoalUtil {
  static async create(user:UserDocument, title:string, description:string, amount:number):Promise<UserGoal> {
    const goal:UserGoal = {
      title,
      description,
      amount
    } as UserGoal

    const res = user.goals.push(goal)
    await user.save()

    return user.goals[res - 1]
  }
}

export default GoalUtil
