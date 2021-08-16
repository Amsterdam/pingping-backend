import _ from 'lodash';
import { User } from 'models/User';
import { UserTask } from 'models/UserTask';

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

  static async deleteAllUsers() {
    if (process.env.ENVIRONMENT === 'production') {
      throw new Error('cannot delete users on production');
    }

    await User.deleteMany({});
  }
}
