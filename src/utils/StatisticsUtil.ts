import { User } from 'models/User';
import moment from 'moment';
import { UserRole, TaskStatus } from '@models';

class StatisticsUtil {
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
      keys: res.map((i) => moment(i._id.label, 'YYYY-MM-DD').format('DD.MM.YY')),
    };
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
          _id: { label: '$tasks.routeTaskId' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      values: res.map((i) => i.count),
      keys: res.map((i) => i._id.label),
    };
  }
}

export default StatisticsUtil;
