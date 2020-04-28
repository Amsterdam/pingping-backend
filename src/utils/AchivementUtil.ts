import InitialDataUtil from "./InitialDataUtil"
import { AchivementDefinition } from "global"

class AchivementUtil {
  static getDefinition (achivementId:string):AchivementDefinition {
    const achivement = InitialDataUtil.getAchivementById(achivementId)

    return {
      id: achivementId,
      title: achivement.title,
      description: achivement.description,
      points: achivement.points,
      icon: achivement.icon,
    }
  }
}

export default AchivementUtil
