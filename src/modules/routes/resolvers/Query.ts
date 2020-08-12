import { QueryResolvers, UserRouteResponse, RouteResponse } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { RouteDefinition } from 'types/global';

export const Query: QueryResolvers = {
  // @todo Revise
  getCurrentRoutes(): Array<UserRouteResponse> {
    return [];
  },

  // @todo Revise
  getAvailableRoutes(): Array<RouteResponse> {
    const routeDefs = InitialDataUtil.getRoutes();

    return routeDefs.map((def: RouteDefinition) => {
      return {
        routeId: def.id,
        title: def.title,
        isSuggested: false,
        numberOfSteps: 10,
        totalPoints: 10,
        targetAudience: 'anyone',
      };
    });
  },
};
