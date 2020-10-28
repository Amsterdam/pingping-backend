import _ from 'lodash';
import { User } from 'models/User';

export default class AdminUtil {
  static async fixUsers() {
    const users = await User.find({});

    for (var u in users) {
      let user = users[u];

      user.tasks = _.uniqBy(user.tasks, (e) => {
        return e.taskId;
      }) as any;
      await user.save();
    }
  }

  static async deleteAllUsers() {
    // if (process.env.NODE_ENV === 'production') {
    // throw new Error('cannot delete users on production');
    // }

    await User.deleteMany({});
  }
}
