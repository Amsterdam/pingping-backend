import _ from 'lodash';
import { QueryResolvers, TaskStatus, QueryGetRouteArgs } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { RouteDefinition, TaskDefinition } from 'types/global';
import { UserTask } from 'models/UserTask';
import { ModuleContext } from '@graphql-modules/core';
import { ContextType } from 'lib/Context';

export const Query: QueryResolvers = {
  async getRoutes(root: any, args: any, context: ContextType): Promise<any> {
    let routes: Array<RouteDefinition> = InitialDataUtil.getRoutes();
    let tasks: Array<UserTask> = context.user.tasks;

    let currentRoutes = routes.filter((r: RouteDefinition) => {
      let tasksFound = tasks.filter((ut: UserTask) => ut.routeId === r.id).map((ut: UserTask) => ut.routeTaskId);

      if (tasksFound.length <= 0) {
        return false;
      }

      // @Todo Check if the route is completed

      return true;
    });

    let availableRoutes = routes.filter((r: RouteDefinition) => {
      let tasksFound = tasks
        .filter(
          (ut: UserTask) =>
            (ut.status === TaskStatus.Completed || ut.status === TaskStatus.Dismissed) && ut.routeId === r.id
        )
        .map((ut: UserTask) => ut.routeTaskId);

      return tasksFound.length <= 0;
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
