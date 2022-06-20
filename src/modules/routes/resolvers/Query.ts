import _ from 'lodash';
import { QueryResolvers, TaskStatus, QueryGetRouteArgs, UserRouteStatus } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { RouteDefinition, TaskDefinition } from 'types/global';
import { UserTask } from 'models/UserTask';
import { ModuleContext } from '@graphql-modules/core';
import { ContextType } from 'lib/Context';
import { UserRoute } from 'models/UserRoute';

export const Query: QueryResolvers = {
  async getRoutes(root: any, args: any, context: ContextType): Promise<any> {
    let routes: Array<RouteDefinition> = InitialDataUtil.getRoutes(context.user.dataSet);
    let tasks: Array<UserTask> = context.user.tasks;
    let userRoutes: Array<string> = context.user.routes
      .filter((route: UserRoute) => route.status === UserRouteStatus.Active)
      .map((route: UserRoute) => route.routeId);

    let currentRoutes = routes.filter((r: RouteDefinition) => {
      let tasksFound = tasks.filter((ut: UserTask) => ut.routeId === r.id).map((ut: UserTask) => ut.routeTaskId);

      if (tasksFound.length <= 0 && userRoutes.indexOf(r.id) === -1) {
        return false;
      }

      return true;
    });

    let availableRoutes = routes.filter((r: RouteDefinition) => {
      let tasksFound = tasks
        .filter(
          (ut: UserTask) =>
            (ut.status === TaskStatus.Completed || ut.status === TaskStatus.Dismissed) && ut.routeId === r.id
        )
        .map((ut: UserTask) => ut.routeTaskId);

      return tasksFound.length <= 0 && userRoutes.indexOf(r.id) === -1;
    });

    return {
      currentRoutes,
      archivedRoutes: [],
      availableRoutes,
    };
  },

  async getRoute(root: any, args: QueryGetRouteArgs, context: ModuleContext): Promise<any> {
    return InitialDataUtil.getRouteById(args.routeId);
  },
};
