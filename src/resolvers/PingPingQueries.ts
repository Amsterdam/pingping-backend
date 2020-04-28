import _ from 'lodash'
import { QueryResolvers, UserRouteResponse, RouteResponse, UserAchivementResponse, AchivementStatus, StatusResponse } from '../generated/graphql';
import Context from './Context';
import InitialDataUtil from '../utils/InitialDataUtil';
import { AchivementDefinition } from 'global';
import { UserAchivement } from '../models/UserAchivement';
import TaskUtil from '../utils/TaskUtil';
import UnauthorizedError from '../errors/UnauthorizedError';

const PingPingQueries:QueryResolvers = {
  getCurrentRoutes ():Array<UserRouteResponse> {
    return []
  },

  getAvailableRoutes ():Array<RouteResponse> {
    return []
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

    return {
      user: context.user.toResponse(),
      currentTask: currentTask ? currentTask.toResponse() : null
    }
  }
}

export default PingPingQueries
