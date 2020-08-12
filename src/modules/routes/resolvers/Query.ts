import { QueryResolvers, UserRouteResponse, RouteResponse } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { RouteDefinition } from 'types/global';
import RouteUtil from 'utils/RouteUtil';
import { UserRoute } from 'models/UserRoute';
import { ModuleContext } from '@graphql-modules/core';

export const Query: QueryResolvers = {
  getCurrentRoutes(root: any, args: any, context: ModuleContext): Array<any> {
    const routes: Array<UserRoute> = RouteUtil.getCurrentUserRoutes(context.user);

    return routes;
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
