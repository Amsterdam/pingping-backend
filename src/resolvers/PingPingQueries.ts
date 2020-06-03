import _ from "lodash";
import Context from "./Context";
import InitialDataUtil from "../utils/InitialDataUtil";
import { AchivementDefinition, RewardDefinition, RouteDefinition } from 'global';
import { UserAchivement } from "../models/UserAchivement";
import TaskUtil from "../utils/TaskUtil";
import UnauthorizedError from "../errors/UnauthorizedError";
import RouteUtil from "../utils/RouteUtil";
import { UserRoute } from '../models/UserRoute';
import { ModuleContext } from "@graphql-modules/core";

const PingPingQueries: any = {
  // async getAchivements(
  //   root: any,
  //   args: any,
  //   context: Context
  // ): Promise<Array<AchivementResponse>> {
  //   if (!context.user) {
  //     throw new UnauthorizedError();
  //   }

  //   const achivements = InitialDataUtil.getAchivements();
  //   const userAchivements: Array<UserAchivement> =
  //     context.user.achivements || [];

  //   return achivements.map((achivement: AchivementDefinition) => {
  //     const userAchivementIndex = userAchivements
  //       .map((i) => i.achivementId)
  //       .indexOf(achivement.id);

  //     return {
  //       achivementId: achivement.id,
  //       ...achivement,
  //       status:
  //         userAchivementIndex !== -1
  //           ? AchivementStatus.Earned
  //           : AchivementStatus.AvailableToEarn,
  //       earnedDate: _.get(userAchivements, `${userAchivementIndex}.earnedDate`),
  //     };
  //   });
  // },
};

export default PingPingQueries;
