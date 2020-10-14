import _ from 'lodash';
import { UserDocument, User } from '../src/models/User';
import UserUtil from '../src/utils/UserUtil';
import { expect, assert } from 'chai';
import AchievementUtil from '../src/utils/AchievementUtil';

describe('achievement', () => {
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

  it('non existing error', async () => {
    const res = AchievementUtil.create(user, 'jibberish');
    await expect(res).to.be.rejectedWith(/achievement_not_defined/);
  });

  it('unlock achievement & check balance', async () => {
    expect(user.balance).to.eq(0, 'Initial Balance is zero');
    await AchievementUtil.create(user, 'zorgtoestlag');

    expect(user.balance).to.eq(20);
    expect(user.transactions.length).to.eq(1);
    expect(user.achievements.length).to.eq(1);
  });

  it('unlock achievement twice, balance remains the same', async () => {
    expect(user.balance).to.eq(0, 'Initial Balance is zero');
    await AchievementUtil.create(user, 'zorgtoestlag');
    await AchievementUtil.create(user, 'zorgtoestlag');

    expect(user.achievements.length).to.eq(1);
    expect(user.transactions.length).to.eq(1);
    expect(user.balance).to.eq(20);
  });
});
