
import { QueryResolvers, UserRouteResponse, RouteResponse } from "@models";
import InitialDataUtil from '../../../utils/InitialDataUtil';
import { RouteDefinition } from "../../../types/global";

export const Query: QueryResolvers = {
  getCurrentRoutes(): Array<UserRouteResponse> {
    return [];
  },

  getAvailableRoutes(): Array<RouteResponse> {
    const routeDefs = InitialDataUtil.getRoutes()

    return routeDefs.map((def:RouteDefinition) => {
      return {
        routeId: def.id,
        title: def.title
      }
    });
  },
};
