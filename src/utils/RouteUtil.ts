import _ from "lodash";

import { UserDocument, User } from "../models/User";
import { UserRoute } from "../models/UserRoute";
import { UserRouteStatus, TaskStatus } from "../generated/graphql";
import { Types } from "mongoose";
import InitialDataUtil from "./InitialDataUtil";
import { RouteDefinition } from "global";
import { UserTask } from '../models/UserTask';

class RouteUtil {
  static getDefinition(routeId: string): RouteDefinition {
    try {
      const routeFound = InitialDataUtil.getRouteById(routeId);

      const def = {
        title: routeFound.title,
        tasks: routeFound.tasks,
      };

      return def;
    } catch (e) {
      if (e.message === 'route_not_defined') {
        return null
      }

      throw e
    }
  }

  static getNextTask(user:UserDocument, routeId:string):UserTask {
    const index = user.routes.map(r => r.routeId).indexOf(routeId)

    if (index === -1) {
      throw new Error('route_not_found_on_user')
    }

    const tasks = user.routes[index].tasks.filter((t:UserTask) =>  t.status === TaskStatus.PendingUser)

    if (tasks.length) {
      const firstTask = _.first(tasks);
      return new UserTask(firstTask.taskId, firstTask.status, firstTask.answer)
    }
  }

  static getDefaultRouteForUser(user: UserDocument) {
    // todo
  }

  static getCurrentUserRoutes(user: UserDocument):Array<UserRoute> {
    const routes = user.routes.filter(
      (r: UserRoute) => r.status === UserRouteStatus.Active
    );

    return routes;
  }

  static async assignToUser(
    user: UserDocument,
    routeId: string
  ): Promise<UserRoute> {
    InitialDataUtil.getRouteById(routeId);

    const userRoute: UserRoute = {
      routeId,
      tasks: new Types.Array(),
      status: UserRouteStatus.Active,
    } as UserRoute;

    user.routes.push(userRoute);
    await user.save();

    return userRoute;
  }
}

export default RouteUtil;
