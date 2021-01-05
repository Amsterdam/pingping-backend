import { User } from 'models/User';
import moment from 'moment';

class StatisticsUtil {
  static async getUsersPerDay() {
    const res = await User.aggregate([
      {
        $match: {},
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
}

export default StatisticsUtil;
