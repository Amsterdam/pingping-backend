import _ from 'lodash'

import { UserDocument } from '../models/User';
import { UserRoute } from '../models/UserRoute';
import { UserRouteStatus } from '../generated/graphql';

class RouteUtil {
  static getDefaultRouteForUser(user:UserDocument) {
    // todo
  }

  static getCurrentUserRoute (user:UserDocument):UserRoute {
    const routes = user.routes.filter((r:UserRoute) => r.status === UserRouteStatus.Active)

    if (routes.length) {
      return _.first(routes)
    }

    return null
  }
}

export default RouteUtil
