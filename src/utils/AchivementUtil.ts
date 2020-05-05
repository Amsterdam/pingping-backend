import InitialDataUtil from "./InitialDataUtil"
import { AchivementDefinition } from "global"
import { UserDocument } from '../models/User';
import { UserAchivement } from '../models/UserAchivement';

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

  static create (user:UserDocument, id:string) {
    // Check if it exists
    InitialDataUtil.getAchivementById(id)
    const indexFound = user.achivements.map(a => a.achivementId).indexOf(id)

    // Passive check if already earned
    if (indexFound !== -1) {
      return user.achivements[indexFound]
    }

    const userAchivement:UserAchivement = {
      achivementId: id,
      createdAt: new Date()
    } as UserAchivement

    const res = user.achivements.push(userAchivement)
    user.save()

    return user.achivements[res - 1]
  }
}

export default AchivementUtil
