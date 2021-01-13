import { User } from 'models/User';
import { UserRouteStatus, UserRole } from '@models';
import { UserDocument } from 'models/User';
import { UserRoute } from 'models/UserRoute';
import RouteUtil from 'utils/RouteUtil';
import { RouteDefinition } from 'types/global';
import InitialDataUtil from './InitialDataUtil';

class MigrationUtil {
  static async checkRouteProgress() {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
        },
      },
      {
        $match: {
          'routes.status': UserRouteStatus.Active,
        },
      },
    ]);

    for (var i in res) {
      const user: UserDocument = res[i];

      for (var r in user.routes) {
        const userRoute: UserRoute = user.routes[r];

        if (userRoute.status === UserRouteStatus.Active) {
          const routeDef: RouteDefinition = InitialDataUtil.getRouteById(userRoute.routeId);
          const progress: number = RouteUtil.getProgress(user, routeDef);

          if (progress === 1) {
            user.routes[r].status = UserRouteStatus.Completed;

            await User.updateOne({ _id: user._id }, user);

            // await user.save();
          }
        }
      }
    }
  }
}

export default MigrationUtil;
