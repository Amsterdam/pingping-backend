
import { QueryResolvers, StatusResponse } from "@models";
import { ModuleContext } from "@graphql-modules/core";
import UnauthorizedError from "../../../errors/UnauthorizedError";
import TaskUtil from '../../../utils/TaskUtil';
import { UserRoute } from '../../../models/UserRoute';
import RouteUtil from '../../../utils/RouteUtil';

export const Query: QueryResolvers = {
  getStatus(root: any, args: any, context:ModuleContext): StatusResponse {
    const currentTask = TaskUtil.getCurrentUserTask(context.user);
    const routes:Array<UserRoute> = RouteUtil.getCurrentUserRoutes(context.user);

    return {
      user: context.user.toResponse(),
      currentTask: currentTask ? currentTask.toResponse() : null,
      routes: routes.map((route:UserRoute) => {
        const routeObj = new UserRoute(route.routeId, route.status, route.tasks)
        return (routeObj as UserRoute).toResponse(context.user)
      })
    };
  },
};
