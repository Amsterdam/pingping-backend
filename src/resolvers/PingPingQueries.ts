import _ from 'lodash'
import { QueryResolvers, UserRouteResponse, RouteResponse, UserAchivementResponse, AchivementStatus, StatusResponse, RewardResponse, RewardStatus, UserRewardResponse } from '../generated/graphql';
import Context from './Context';
import InitialDataUtil from '../utils/InitialDataUtil';
import { AchivementDefinition, RewardDefinition } from 'global';
import { UserAchivement } from '../models/UserAchivement';
import TaskUtil from '../utils/TaskUtil';
import UnauthorizedError from '../errors/UnauthorizedError';
import RouteUtil from '../utils/RouteUtil';
import { UserReward } from '../models/UserReward';

const PingPingQueries:QueryResolvers = {
  getCurrentRoutes ():Array<UserRouteResponse> {
    return []
  },

  getAvailableRoutes ():Array<RouteResponse> {
    return []
  },

  getAvailableRewards (root:any, args:any, context:Context):Array<RewardResponse> {
    if (!context.user) {
      throw new UnauthorizedError()
    }

    const rewards:Array<RewardDefinition> = InitialDataUtil.getRewards()

    return rewards.map((reward:RewardDefinition) => {
      return {
        rewardId: reward.id,
        title: reward.title,
        description: reward.description,
        imageUrl: reward.imageUrl,
        price: reward.price,
        status: RewardStatus.AvailableToClaim
      }
    })
  },

  getCurrentRewards (root:any, args:any, context:Context):Array<UserRewardResponse> {
    if (!context.user) {
      throw new UnauthorizedError()
    }

    // const rewards:Array<RewardDefinition> = InitialDataUtil.getRewards()

    return context.user.rewards.map((reward:UserReward) => {
      let rewardDef

      try {
        rewardDef = InitialDataUtil.getReward(reward.rewardId)
      } catch {
        return null
      }

      return {
        rewardId: reward.rewardId,
        title: rewardDef.title,
        description: rewardDef.description,
        imageUrl: rewardDef.imageUrl,
        barcodeImageUrl: `https://barcodes.com/${reward._id}`,
        status: reward.status
      }
    }).filter(r => r)
  },

  async getAchivements (root:any, args:any, context:Context):Promise<Array<UserAchivementResponse>> {
    if (!context.user) {
      throw new UnauthorizedError()
    }

    const achivements = InitialDataUtil.getAchivements()
    const userAchivements:Array<UserAchivement> = context.user.achivements || []

    return achivements.map((achivement:AchivementDefinition) => {
      const userAchivementIndex = userAchivements.map(i => i.achivementId).indexOf(achivement.id)

      return {
        achivementId: achivement.id,
        ...achivement,
        status: userAchivementIndex !== -1 ? AchivementStatus.Earned : AchivementStatus.AvailableToEarn
      }
    })
  },

  getStatus (root:any, args:any, context:Context):StatusResponse {
    if (!context.user) {
      throw new UnauthorizedError()
    }

    const currentTask = TaskUtil.getCurrentUserTask(context.user)
    const currentRoute = RouteUtil.getCurrentUserRoute(context.user)

    return {
      user: context.user.toResponse(),
      balance: context.user.balance,
      currentTask: currentTask ? currentTask.toResponse() : null,
      currentRoute: currentRoute ? currentRoute.toResponse() : null
    }
  }
}

export default PingPingQueries
