import { User } from 'models/User';
import moment from 'moment';
import _ from 'lodash';
import { UserRole, TaskStatus, StatisticNumberChange, Statistics, RouteStatistics } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { TaskDefinition } from 'types/global';
import { RouteDefinition } from 'types/global';
import { StatisticModel } from 'models/Statistic';

const TOTAL_USERS_WEEK = 'total-users-week';
const ACTIVE_USERS_WEEK = 'active-users-week';
const SKIPPED_ONBOARDING_WEEK = 'skipped-onboarding-week';
const DATE_FORMAT = 'YYYY-MM-DD';

class StatisticsUtil {
  static async getTotalUsersCurrent(): Promise<number> {
    return await User.countDocuments({
      role: UserRole.User,
    });
  }

  static async getSkippedOnboardingCurrent(): Promise<number> {
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
          'tasks.taskId': 'onboarding.welcome',
          'tasks.answer': 'no',
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return _.get(_.first(res), 'count');
  }

  static async getChangeFromLastWeek(type: string, current: number): Promise<number> {
    const key = moment().subtract(1, 'week').format(DATE_FORMAT);

    const res = await StatisticModel.findOne({
      type,
      key,
    });

    if (res) {
      const lastWeek: number = parseFloat(res.value);
      let val = (current - lastWeek) / lastWeek;

      return val;
    }

    return null;
  }

  static async getUsersPerYearOfBirth(): Promise<Statistics> {
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
          'tasks.taskId': 'onboarding.dateOfBirth',
        },
      },
      {
        $project: {
          dateOfBirth: { $dateFromString: { dateString: '$tasks.answer' } },
        },
      },
      {
        $project: {
          ageInMillis: { $subtract: [new Date(), '$dateOfBirth'] },
        },
      },
      {
        $project: {
          age: { $divide: ['$ageInMillis', 31558464000] },
        },
      },
      {
        $project: {
          age: { $subtract: ['$age', { $mod: ['$age', 1] }] },
        },
      },
      {
        $group: {
          _id: { label: '$age' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.age': 1 } },
    ]);

    return {
      values: res.map((i) => i.count),
      keys: res.map((i) => i._id.label),
    };
  }

  static async registerStatistics(): Promise<void> {
    const key = moment().format(DATE_FORMAT);

    // Active Users
    const activeUsers = await User.countDocuments({
      activeAt: { $gte: moment().subtract('24', 'hour').toDate() },
      role: UserRole.User,
    });

    await StatisticModel.findOneAndUpdate(
      {
        type: ACTIVE_USERS_WEEK,
        key,
      },
      { value: activeUsers.toString() },
      {
        new: true,
        upsert: true,
      }
    );

    // Total Users
    const totalUsers = await this.getTotalUsersCurrent();

    await StatisticModel.findOneAndUpdate(
      {
        type: TOTAL_USERS_WEEK,
        key,
      },
      { value: totalUsers.toString() },
      {
        new: true,
        upsert: true,
      }
    );

    // Skipped onboarding
    const skippedOnboarding = await this.getSkippedOnboardingCurrent();
    const skipperOnboardingPercentile: number = skippedOnboarding / totalUsers;
    await StatisticModel.findOneAndUpdate(
      {
        type: SKIPPED_ONBOARDING_WEEK,
        key,
      },
      { value: skipperOnboardingPercentile.toString() },
      {
        new: true,
        upsert: true,
      }
    );
  }

  static async getTotalUsers(): Promise<StatisticNumberChange> {
    const current: number = await this.getTotalUsersCurrent();
    const change: number = await StatisticsUtil.getChangeFromLastWeek(TOTAL_USERS_WEEK, current);

    return {
      current,
      change,
    };
  }

  static async getSkippedOnboarding(): Promise<StatisticNumberChange> {
    const current: number = await this.getSkippedOnboardingCurrent();
    const totalUsers: number = await this.getTotalUsersCurrent();
    const percentile: number = current / totalUsers;
    const change: number = await StatisticsUtil.getChangeFromLastWeek(SKIPPED_ONBOARDING_WEEK, percentile);

    return {
      current,
      percentile,
      change,
    };
  }

  static async getActiveUsers(): Promise<StatisticNumberChange> {
    const current: number = await User.countDocuments({
      activeAt: { $gte: moment().subtract('24', 'hour').toDate() },
      role: UserRole.User,
    });
    const change: number = await StatisticsUtil.getChangeFromLastWeek(ACTIVE_USERS_WEEK, current);

    return {
      current,
      change,
    };
  }

  static async getUsersPerDay(): Promise<Statistics> {
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
      keys: res.map((i) => i._id.label),
    };
  }

  static async getRoutes(): Promise<Array<RouteStatistics>> {
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

  static async getCompletedTasks(): Promise<Statistics> {
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
