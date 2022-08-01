import _ from 'lodash';
import { User } from 'models/User';
import { AuditLog } from 'models/AuditLog';
import { UserTask } from 'models/UserTask';
import { RouteFeedback } from 'models/RouteFeedback';
import { StatisticModel } from 'models/Statistic';
import { NotificationModel } from 'models/Notification';

export default class AdminUtil {
  static async fixUsers() {
    const users = await User.find({});

    for (var u in users) {
      let user = users[u];

      user.tasks = _.uniqBy(user.tasks, (ut: UserTask) => {
        return ut.taskId;
      }) as any;
      await user.save();
    }
  }

  static async fixStatistics() {
    await StatisticModel.deleteMany({ key: '2022-12-26' });
  }

  static async deleteAllUsers() {
    if (process.env.ENVIRONMENT === 'production') {
      throw new Error('cannot delete users on production');
    }

    await User.deleteMany({});
  }

  // Setting all current data to the Amsterdam data set
  static async dataSetMigration() {}
}
