import _ from 'lodash';
import { UserDocument, User } from '../src/models/User';
import UserUtil from '../src/utils/UserUtil';

describe('route', () => {
  let accessToken: any;
  let user: UserDocument;

  beforeEach(async () => {
    user = await UserUtil.createOrFindUser({
      deviceId: `randomdeviceid${_.random(true)}`,
    });
    accessToken = _.get(user, 'tokens.0.accessToken');

    return await setTimeout(() => {}, 1000);
  });

  afterEach((done) => {
    User.remove(user._id);
    done();
  });
});
