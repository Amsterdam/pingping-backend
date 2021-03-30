import { User } from 'models/User';
import moment from 'moment';
import _ from 'lodash';
import { UserRole, TaskStatus, StatisticNumberChange, Statistics, RouteStatistics } from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { TaskDefinition } from 'types/global';
import { RouteDefinition } from 'types/global';
import { StatisticModel } from 'models/Statistic';
import { stat } from 'fs';

const TOTAL_USERS_WEEK = 'total-users-week';
const ACTIVE_USERS_WEEK = 'active-users-7-days';
const SKIPPED_ONBOARDING_WEEK = 'skipped-onboarding-week';
const DATE_FORMAT = 'YYYY-MM-DD';
const WEEK_FORMAT = 'YYYY-WW';
export const START_DATE = '04.01.2021';

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

    return _.get(_.first(res), 'count', 0);
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

    return 0;
  }

  static async getUsersCumulative(): Promise<Statistics> {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
          createdAt: {
            $gt: moment(START_DATE, 'DD.MM.YYYY').toDate(),
          },
        },
      },
      {
        $project: {
          label: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
      },
      {
        $group: {
          _id: '$label',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      values: res.reduce((acc, v) => {
        if (acc.length) {
          acc.push(acc[acc.length - 1] + v.count);
        } else {
          acc.push(v.count);
        }

        return acc;
      }, []),
      keys: res.map((i) => i._id),
    };
  }

  static async getUsersPerYearOfBirth(week: string): Promise<Statistics> {
    let dateQuery: any = {};

    if (week) {
      dateQuery['tasks.createdAt'] = {
        $gt: moment(week, WEEK_FORMAT).startOf('week').toDate(),
        $lt: moment(week, WEEK_FORMAT).endOf('week').toDate(),
      };
    }

    let res = await User.aggregate([
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
          ...dateQuery,
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
      { $sort: { '_id.label': 1 } },
    ]);

    res = res.filter((i) => i._id.label !== null);

    return {
      dump: res,
      values: res.map((i) => i.count),
      keys: res.map((i) => i._id.label),
    };
  }

  static async getUsersPerMonthOfBirth(week: string, minAge: number = 0, maxAge: number = 100): Promise<Statistics> {
    let dateQuery: any = {};

    if (week) {
      dateQuery['tasks.createdAt'] = {
        $gt: moment(week, WEEK_FORMAT).startOf('week').toDate(),
        $lt: moment(week, WEEK_FORMAT).endOf('week').toDate(),
      };
    }

    let res = await User.aggregate([
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
          ...dateQuery,
        },
      },
      {
        $project: {
          dateOfBirth: { $dateFromString: { dateString: '$tasks.answer' } },
        },
      },
      {
        $match: {
          dateOfBirth: {
            $gt: moment().subtract(maxAge, 'years').toDate(),
            $lt: moment().subtract(minAge, 'years').toDate(),
          },
        },
      },
      {
        $project: {
          ageInMillis: { $subtract: [new Date(), '$dateOfBirth'] },
        },
      },
      {
        $project: {
          age: { $divide: ['$ageInMillis', 31558464000 / 12] },
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
      { $sort: { '_id.label': 1 } },
    ]);

    res = res.filter((i) => i._id.label !== null);

    return {
      values: res.map((i) => i.count),
      keys: res.map((i) => {
        let mod = i._id.label % 12;

        return `${(i._id.label - mod) / 12}.${mod}`;
      }),
    };
  }

  static async registerStatistics(): Promise<void> {
    const key = moment().format(DATE_FORMAT);

    // Active Users
    const activeUsers = await User.countDocuments({
      activeAt: { $gte: moment().subtract('7', 'days').toDate() },
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
      activeAt: { $gte: moment().subtract('7', 'days').toDate() },
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
          createdAt: {
            $gt: moment(START_DATE, 'DD.MM.YYYY').toDate(),
          },
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

  static async getUsersPerWeek(): Promise<Statistics> {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
          createdAt: {
            $gt: moment(START_DATE, 'DD.MM.YYYY').toDate(),
          },
        },
      },
      {
        $project: {
          label: { $dateToString: { format: '%Y-%V', date: '$createdAt' } },
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
      keys: res.map((i) => {
        return moment(i._id.label, WEEK_FORMAT).format(DATE_FORMAT);
      }),
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

    const routes = InitialDataUtil.getRoutes().filter((r: RouteDefinition) => r.isSuggested);
    let finalRes = [];

    for (var r in routes) {
      let route = routes[r];
      const set = res.filter((v) => v._id.route === route.id);
      const notStarted = await User.countDocuments({
        routes: { $not: { $elemMatch: { routeId: route.id } } },
        tasks: {
          $elemMatch: {
            status: TaskStatus.PendingUser,
          },
        },
      });

      finalRes.push({
        title: route.title,
        data: {
          values: [...set.map((v) => v.count), notStarted],
          keys: [...set.map((v) => v._id.status), 'Not Started'],
        },
      });
    }

    return finalRes.filter(({ data }) => data.values.length);
  }

  static async getCompletedTasks(week: string): Promise<Statistics> {
    let dateQuery: any = {};

    if (week) {
      dateQuery['tasks.updatedAt'] = {
        $gt: moment(week, WEEK_FORMAT).startOf('week').toDate(),
        $lt: moment(week, WEEK_FORMAT).endOf('week').toDate(),
      };
    }

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
          'tasks.routeId': { $exists: true, $ne: 'onboarding' },
          ...dateQuery,
        },
      },
      {
        $group: {
          _id: { task: '$tasks.taskId', route: '$tasks.routeId' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      values: res.map((i) => i.count),
      keys: res.map((i) => {
        const id = i._id.task.replace('onboarding', i._id.route);
        const task: TaskDefinition = InitialDataUtil.getTaskById(id);

        return `${i._id.task.split('.')[0]}:${task.title}`;
      }),
    };
  }
}

export default StatisticsUtil;
