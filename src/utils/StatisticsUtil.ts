import { User } from 'models/User';
import moment from 'moment';
import { UserRole, TaskStatus, UserRouteStatus } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { TaskDefinition } from 'types/global';
import { RouteDefinition } from 'types/global';

class StatisticsUtil {
  static async getTotalUsers() {
    return {
      current: await User.count({ role: UserRole.User }),
      change: 0,
    };
  }

  static async getActiveUsers() {
    return {
      current: 0,
      change: 0,
    };
  }

  static async getUsersPerDay() {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
        },
      },
      {
        $project: {
          label: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
      },
      {
        $group: {
          _id: { label: '$label' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.label': 1 } },
    ]);

    return {
      values: res.map((i) => i.count),
      keys: res.map((i) => moment(i._id.label, 'YYYY-MM-DD').format('MM.DD.YYYY')),
    };
  }

  static async getRoutes(): Promise<Array<any>> {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
        },
      },
      {
        $unwind: {
          path: '$routes',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: {
            route: '$routes.routeId',
            status: '$routes.status',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return InitialDataUtil.getRoutes()
      .map((r: RouteDefinition) => {
        const set = res.filter((v) => v._id.route === r.id);

        return {
          title: r.title,
          data: {
            values: set.map((v) => v.count),
            keys: set.map((v) => v._id.status),
          },
        };
      })
      .filter((r) => r.data.values.length);
  }

  static async getCompletedTasks() {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
        },
      },
      {
        $unwind: {
          path: '$tasks',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'tasks.status': TaskStatus.Completed,
          'tasks.routeTaskId': { $exists: true },
        },
      },
      {
        $group: {
          _id: { task: '$tasks.routeTaskId' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      values: res.map((i) => i.count),
      keys: res.map((i) => {
        const task: TaskDefinition = InitialDataUtil.getTaskById(i._id.task);

        return task.title;
      }),
    };
  }
}

export default StatisticsUtil;
