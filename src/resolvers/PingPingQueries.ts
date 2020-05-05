import _ from "lodash";
import {
  QueryResolvers,
  UserRouteResponse,
  RouteResponse,
  AchivementResponse,
  AchivementStatus,
  StatusResponse,
  RewardResponse,
  RewardStatus,
} from "../generated/graphql";
import Context from "./Context";
import InitialDataUtil from "../utils/InitialDataUtil";
import { AchivementDefinition, RewardDefinition } from "global";
import { UserAchivement } from "../models/UserAchivement";
import TaskUtil from "../utils/TaskUtil";
import UnauthorizedError from "../errors/UnauthorizedError";
import RouteUtil from "../utils/RouteUtil";

const PingPingQueries: QueryResolvers = {
  getCurrentRoutes(): Array<UserRouteResponse> {
    return [];
  },

  getAvailableRoutes(): Array<RouteResponse> {
    return [];
  },

  getAvailableRewards(
    root: any,
    args: any,
    context: Context
  ): Array<RewardResponse> {
    if (!context.user) {
      throw new UnauthorizedError();
    }

    const rewards: Array<RewardDefinition> = InitialDataUtil.getRewards();

    return rewards.map((reward: RewardDefinition) => {
      return {
        rewardId: reward.id,
        title: reward.title,
        description: reward.description,
        imageUrl: reward.imageUrl,
        price: reward.price,
        status: RewardStatus.AvailableToClaim,
      };
    });
  },

  async getAchivements(
    root: any,
    args: any,
    context: Context
  ): Promise<Array<AchivementResponse>> {
    if (!context.user) {
      throw new UnauthorizedError();
    }

    const achivements = InitialDataUtil.getAchivements();
    const userAchivements: Array<UserAchivement> =
      context.user.achivements || [];

    return achivements.map((achivement: AchivementDefinition) => {
      const userAchivementIndex = userAchivements
        .map((i) => i.achivementId)
        .indexOf(achivement.id);

      return {
        achivementId: achivement.id,
        ...achivement,
        status:
          userAchivementIndex !== -1
            ? AchivementStatus.Earned
            : AchivementStatus.AvailableToEarn,
        earnedDate: _.get(userAchivements, `${userAchivementIndex}.earnedDate`),
      };
    });
  },

  getStatus(root: any, args: any, context: Context): StatusResponse {
    if (!context.user) {
      throw new UnauthorizedError();
    }

    const currentTask = TaskUtil.getCurrentUserTask(context.user);
    const currentRoute = RouteUtil.getCurrentUserRoute(context.user);

    return {
      user: context.user.toResponse(),
      currentTask: currentTask ? currentTask.toResponse() : null,
      currentRoute: currentRoute ? currentRoute.toResponse() : null,
    };
  },
};

export default PingPingQueries;
