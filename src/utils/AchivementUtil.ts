import InitialDataUtil from "./InitialDataUtil"
import { AchivementDefinition } from "global"
import { UserDocument } from '../models/User';
import { UserAchivement } from '../models/UserAchivement';
import TransactionUtil from './TransactionUtil';

class AchivementUtil {
  static getDefinition (id:string):AchivementDefinition {
    const achivement = InitialDataUtil.getAchivementById(id)

    return {
      id,
      title: achivement.title,
      description: achivement.description,
      points: achivement.points,
      icon: achivement.icon,
    }
  }

  static async create (user:UserDocument, id:string):Promise<UserAchivement> {
    const def:AchivementDefinition = InitialDataUtil.getAchivementById(id)

    // Check if it exists
    const indexFound = user.achivements.map(a => a.achivementId).indexOf(id)

    // Passive check if already earned
    if (indexFound !== -1) {
      return user.achivements[indexFound]
    }

    const userAchivement:UserAchivement = {
      achivementId: id,
      createdAt: new Date()
    } as UserAchivement

    // If the achivement has a point value to it, we need to update the users balance
    if (def.points && def.points > 0) {
      await TransactionUtil.addTransaction(user, def.title, def.points)
    }

    const res = user.achivements.push(userAchivement)
    await user.save()

    return user.achivements[res - 1]
  }
}

export default AchivementUtil
