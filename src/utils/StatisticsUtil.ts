import { User } from 'models/User';
import moment from 'moment';
import _ from 'lodash';
import {
  UserRole,
  TaskStatus,
  StatisticNumberChange,
  Statistics,
  RouteStatistics,
  UserRouteStatus,
  TaskType,
} from '@models';
import InitialDataUtil from 'utils/InitialDataUtil';
import { TaskDefinition } from 'types/global';
import { RouteDefinition } from 'types/global';
import { StatisticModel, Statistic } from 'models/Statistic';
import { DATA_SET_AMSTERDAM } from 'models/User';

const TOTAL_USERS_WEEK = 'total-users-week';
const ACTIVE_USERS_WEEK = 'active-users-7-days';
const SKIPPED_ONBOARDING_WEEK = 'skipped-onboarding-week';
const DATE_FORMAT = 'YYYY-MM-DD';
const WEEK_FORMAT = 'YYYY-WW';

export const START_DATES: any = {
  amsterdam: '01.04.2021',
  rotterdam: '01.03.2022',
};

class StatisticsUtil {
  static async getTotalUsersCurrent(dataSet: string = undefined): Promise<number> {
    return await User.countDocuments({
      role: UserRole.User,
      dataSet,
    });
  }

  static async getSkippedOnboardingCurrent(dataSet: string = undefined): Promise<number> {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
          dataSet,
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

  static async getChangeFromLastWeek(type: string, dataSet: string = undefined, current: number = 0): Promise<number> {
    const key = moment().subtract(1, 'week').format(DATE_FORMAT);

    const res = await StatisticModel.findOne({
      type,
      key,
      dataSet,
    });

    if (res && res.value) {
      const lastWeek: number = parseFloat(res.value);

      if (lastWeek) {
        return (current - lastWeek) / lastWeek;
      }
    }

    return 0;
  }

  static async getUsersCumulative(dataSet: string = undefined): Promise<Statistics> {
    const dates = this.getDates(dataSet);
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
          dataSet,
          createdAt: {
            $gt: moment(START_DATES[dataSet], 'DD.MM.YYYY').toDate(),
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
      {
        $project: {
          date: '$_id',
          count: '$count',
        },
      },
      {
        $group: {
          _id: null,
          stats: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          stats: {
            $map: {
              input: dates,
              as: 'date',
              in: {
                $let: {
                  vars: { dateIndex: { $indexOfArray: ['$stats._id', '$$date'] } },
                  in: {
                    $cond: {
                      if: { $ne: ['$$dateIndex', -1] },
                      then: { $arrayElemAt: ['$stats', '$$dateIndex'] },
                      else: { _id: '$$date', date: '$$date', count: 0 },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $unwind: '$stats',
      },
      {
        $replaceRoot: {
          newRoot: '$stats',
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      values: res.reduce((acc: Array<any>, v: any) => {
        if (acc.length) {
          acc.push(acc[acc.length - 1] + v.count);
        } else {
          acc.push(v.count);
        }

        return acc;
      }, []),
      keys: res.map((i: any) => i._id),
    };
  }

  static async getRoutesPerMonth(dataSet: string = undefined): Promise<Statistics> {
    const months = this.getMonths(dataSet);
    const filter: any = [
      {
        $match: {
          role: UserRole.User,
          dataSet,
          createdAt: {
            $gt: moment(START_DATES[dataSet], 'DD.MM.YYYY').toDate(),
          },
        },
      },
      {
        $unwind: {
          path: '$routes',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          label: { $dateToString: { format: '%Y-%m', date: '$routes.createdAt' } },
        },
      },
      {
        $group: {
          _id: '$label',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          count: '$count',
        },
      },
      {
        $group: {
          _id: null,
          stats: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          stats: {
            $map: {
              input: months,
              as: 'date',
              in: {
                $let: {
                  vars: { dateIndex: { $indexOfArray: ['$stats._id', '$$date'] } },
                  in: {
                    $cond: {
                      if: { $ne: ['$$dateIndex', -1] },
                      then: { $arrayElemAt: ['$stats', '$$dateIndex'] },
                      else: { _id: '$$date', date: '$$date', count: 0 },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $unwind: '$stats',
      },
      {
        $replaceRoot: {
          newRoot: '$stats',
        },
      },
      { $sort: { _id: 1 } },
    ];

    const res = await User.aggregate(filter);

    return {
      values: res.map((i: any) => i.count),
      keys: res.map((i: any) => moment(i._id, 'YYYY-MM').format('YYYY-MM-DD')),
    };
  }

  static getDates(dataSet: string) {
    let dateArray = [];
    let currentDate = moment(START_DATES[dataSet], 'DD.MM.YYYY');
    let endDate = moment();
    while (currentDate.isBefore(endDate)) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  static getMonths(dataSet: string) {
    let dateArray = [];
    let currentDate = moment(START_DATES[dataSet], 'DD,MM.YYYY');
    let endDate = moment();
    while (currentDate.isBefore(endDate)) {
      dateArray.push(moment(currentDate).format('YYYY-MM'));
      currentDate = moment(currentDate).add(1, 'month').startOf('month');
    }
    return dateArray;
  }

  static async getRoutesCompletedPerMonth(dataSet: string = undefined): Promise<Statistics> {
    const months = this.getMonths(dataSet);
    const filter: any = [
      {
        $match: {
          role: UserRole.User,
          dataSet,
          createdAt: {
            $gt: moment(START_DATES[dataSet], 'DD.MM.YYYY').toDate(),
          },
        },
      },
      {
        $unwind: {
          path: '$routes',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'routes.status': 'Completed',
        },
      },
      {
        $project: {
          label: { $dateToString: { format: '%Y-%m', date: '$routes.completedAt' } },
        },
      },
      {
        $group: {
          _id: '$label',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          count: '$count',
        },
      },
      {
        $group: {
          _id: null,
          stats: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          stats: {
            $map: {
              input: months,
              as: 'date',
              in: {
                $let: {
                  vars: { dateIndex: { $indexOfArray: ['$stats._id', '$$date'] } },
                  in: {
                    $cond: {
                      if: { $ne: ['$$dateIndex', -1] },
                      then: { $arrayElemAt: ['$stats', '$$dateIndex'] },
                      else: { _id: '$$date', date: '$$date', count: 0 },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $unwind: '$stats',
      },
      {
        $replaceRoot: {
          newRoot: '$stats',
        },
      },
      { $sort: { _id: 1 } },
    ];

    const res = await User.aggregate(filter);

    return {
      values: res.map((i: any) => i.count),
      keys: res.map((i: any) => moment(i._id, 'YYYY-MM').format('YYYY-MM-DD')),
    };
  }

  static async getUsersPerYearOfBirth(week: string, dataSet: string = undefined): Promise<Statistics> {
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
          dataSet,
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
          'tasks.taskId':
            dataSet === DATA_SET_AMSTERDAM ? 'onboarding.dateOfBirth' : `onboarding.dateOfBirth-${dataSet}`,
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

    res = res.filter((i: any) => i._id.label !== null);

    return {
      dump: res,
      values: res.map((i: any) => i.count),
      keys: res.map((i: any) => i._id.label),
    };
  }

  static async getUsersPerMonthOfBirth(
    week: string,
    minAge: number = 0,
    maxAge: number = 100,
    dataSet: string = undefined
  ): Promise<Statistics> {
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
          dataSet,
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
          'tasks.taskId':
            dataSet === DATA_SET_AMSTERDAM ? 'onboarding.dateOfBirth' : `onboarding.dateOfBirth-${dataSet}`,
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

    res = res.filter((i: any) => i._id.label !== null);

    return {
      values: res.map((i: any) => i.count),
      keys: res.map((i: any) => {
        let mod = i._id.label % 12;

        return `${(i._id.label - mod) / 12}.${mod}`;
      }),
    };
  }

  static async registerStatistics(dataSet: string = undefined): Promise<void> {
    const key = moment().format(DATE_FORMAT);

    // Active Users
    const activeUsers = await User.countDocuments({
      activeAt: { $gte: moment().subtract('7', 'days').toDate() },
      role: UserRole.User,
      dataSet,
    });

    await StatisticModel.findOneAndUpdate(
      {
        type: ACTIVE_USERS_WEEK,
        key,
        dataSet,
      },
      { value: activeUsers.toString() },
      {
        new: true,
        upsert: true,
      }
    );

    // Total Users
    const totalUsers = await this.getTotalUsersCurrent(dataSet);

    await StatisticModel.findOneAndUpdate(
      {
        type: TOTAL_USERS_WEEK,
        key,
        dataSet,
      },
      { value: totalUsers.toString() },
      {
        new: true,
        upsert: true,
      }
    );

    // Skipped onboarding
    const skippedOnboarding = await this.getSkippedOnboardingCurrent(dataSet);
    const skipperOnboardingPercentile: number = skippedOnboarding / totalUsers;
    await StatisticModel.findOneAndUpdate(
      {
        type: SKIPPED_ONBOARDING_WEEK,
        key,
        dataSet,
      },
      { value: skipperOnboardingPercentile.toString() },
      {
        new: true,
        upsert: true,
      }
    );
  }

  static async getTotalUsers(dataSet: string = undefined): Promise<StatisticNumberChange> {
    const current: number = await this.getTotalUsersCurrent(dataSet);
    const change: number = await StatisticsUtil.getChangeFromLastWeek(TOTAL_USERS_WEEK, dataSet, current);

    return {
      current,
      change,
    };
  }

  static async getSkippedOnboarding(dataSet: string = undefined): Promise<StatisticNumberChange> {
    const current: number = await this.getSkippedOnboardingCurrent(dataSet);
    const totalUsers: number = await this.getTotalUsersCurrent(dataSet);
    const percentile: number = current / totalUsers;
    const change: number = await StatisticsUtil.getChangeFromLastWeek(SKIPPED_ONBOARDING_WEEK, dataSet, percentile);

    return {
      current,
      percentile,
      change,
    };
  }

  static async getActiveUsers(dataSet: string = undefined): Promise<StatisticNumberChange> {
    const current: number = await User.countDocuments({
      activeAt: { $gte: moment().subtract('7', 'days').toDate() },
      role: UserRole.User,
      dataSet,
    });
    const change: number = await StatisticsUtil.getChangeFromLastWeek(ACTIVE_USERS_WEEK, dataSet, current);

    return {
      current,
      change,
    };
  }

  static async getUsersPerDay(dataSet: string = undefined): Promise<Statistics> {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
          dataSet,
          createdAt: {
            $gt: moment(START_DATES[dataSet], 'DD.MM.YYYY').toDate(),
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

  static async getUsersPerWeek(dataSet: string = undefined): Promise<Statistics> {
    let res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
          dataSet,
          createdAt: {
            $gte: moment(START_DATES[dataSet], 'DD.MM.YYYY').toDate(),
            $lte: moment().subtract(1, 'week').endOf('week').add(2, 'day').toDate(),
          },
        },
      },
      {
        $project: {
          label: { $dateToString: { format: '%Y-%U', date: '$createdAt' } },
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

    res = res.filter((i) => {
      return moment(i._id, WEEK_FORMAT).isBefore(moment());
    });

    return {
      values: res.map((i) => i.count),
      keys: res.map((i) => moment(i._id, WEEK_FORMAT).format(DATE_FORMAT)),
    };
  }

  static async getActiveUsersPerWeek(dataSet: string = undefined): Promise<Statistics> {
    const avg: any = {};
    const date: any = moment(START_DATES[dataSet], 'DD.MM.YYYY');

    while (true) {
      const key = moment(date).format(DATE_FORMAT);

      const res: Statistic = await StatisticModel.findOne({
        type: ACTIVE_USERS_WEEK,
        key,
        dataSet,
      });

      if (res) {
        if (avg[date.format(WEEK_FORMAT)]) {
          avg[date.format(WEEK_FORMAT)].push(parseInt(res.value));
        } else {
          avg[date.format(WEEK_FORMAT)] = [parseInt(res.value)];
        }
      } else {
        if (!avg[date.format(WEEK_FORMAT)]) {
          avg[date.format(WEEK_FORMAT)] = [];
        }
      }

      date.add(1, 'day');

      if (date.isAfter(moment())) {
        break;
      }
    }

    const keys: any = Object.keys(avg).map((i) => moment(i, WEEK_FORMAT).format(DATE_FORMAT));

    return {
      values: Object.keys(avg)
        .map((k) => {
          if (avg[k].length) {
            return avg[k].reduce((p: number, c: number) => p + c) / avg[k].length;
          }

          return 0;
        })
        .map((n) => Math.round(n)),
      keys,
    };
  }

  static async getRoutes(dataSet: string = undefined): Promise<Array<RouteStatistics>> {
    const res = await User.aggregate([
      {
        $match: {
          role: UserRole.User,
          dataSet,
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

    const routes = InitialDataUtil.getRoutes(dataSet).filter((r: RouteDefinition) => r.isSuggested);
    let finalRes = [];

    for (var r in routes) {
      let route = routes[r];
      const set = res.filter((v) => v._id.route === route.id);
      const notStarted = await User.countDocuments({
        role: UserRole.User,
        dataSet,
        routes: { $not: { $elemMatch: { routeId: route.id } } },
        tasks: {
          $not: {
            $elemMatch: {
              taskId: 'onboarding.gemeente',
              status: TaskStatus.Dismissed,
            },
          },
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

  static async getCompletedTasks(week: string, dataSet: string = undefined): Promise<Statistics> {
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
          dataSet,
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
        const coreId: Array<string> = i._id.task.split('-');
        const id = coreId[0].replace('onboarding', i._id.route);
        let task: TaskDefinition = undefined;

        try {
          task = InitialDataUtil.getTaskById(id);
        } catch {
          return 'unknown';
        }

        return `${i._id.task.split('.')[0]}:${task.title}`;
      }),
    };
  }
}

export default StatisticsUtil;
