import _ from 'lodash';
import { QueryResolvers, TaskStatus } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { RouteDefinition, TaskDefinition } from 'types/global';
import { UserTask } from 'models/UserTask';
import { ModuleContext } from '@graphql-modules/core';

export const Query: QueryResolvers = {
  // getCurrentRoutes(root: any, args: any, context: ModuleContext): Array<any> {
  //   const routes: Array<UserRoute> = RouteUtil.getCurrentUserRoutes(context.user);

  //   return routes;
  // },

  async getRoutes(root: any, args: any, context: ModuleContext): Promise<any> {
    let routes: Array<RouteDefinition> = InitialDataUtil.getRoutes();
    let tasks: Array<UserTask> = context.user.tasks;

    let currentRoutes = routes.filter((r: RouteDefinition) => {
      let tasksFound = tasks.filter((ut: UserTask) => ut.routeId === r.id).map((ut: UserTask) => ut.routeTaskId);

      if (tasksFound.length <= 0) {
        return false;
      }

      console.log('t', tasksFound, _.xor(r.tasks.map((td: TaskDefinition) => td.id)));

      // @Todo Check if the route is completed

      return true;
    });

    let availableRoutes = routes.filter((r: RouteDefinition) => {
      let tasksFound = tasks
        .filter((ut: UserTask) => ut.status === TaskStatus.Completed && ut.routeId === r.id)
        .map((ut: UserTask) => ut.routeTaskId);

      return tasksFound.length <= 0;
    });

    return {
      currentRoutes,
      archivedRoutes: [],
      availableRoutes,
    };
  },

  // // @todo Revise
  // getAvailableRoutes(): Array<any> {
  //   const routeDefs = InitialDataUtil.getRoutes();

  //   return routeDefs;
  // },
};
