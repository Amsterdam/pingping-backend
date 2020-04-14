import { QueryResolvers, UserRouteResponse, RouteResponse } from '../generated/graphql';
import Context from './Context';

const PingPingQueries:QueryResolvers = {
  getCurrentRoutes ():Array<UserRouteResponse> {
    return []
  },

  getAvailableRoutes ():Array<RouteResponse> {
    return []
  },

  // getStatus (root:any, args:any, context:Context):StatusResponse {
  //   return {
  //     user: context.user.toResponse(),
  //   }
  // }

// getOnboardingSteps():OnBoarding Step[] {
  //   return []
  // }
}

export default PingPingQueries
