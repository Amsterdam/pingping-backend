import _ from 'lodash'
import { UserDocument, User } from "../src/models/User";
import UserUtil from "../src/utils/UserUtil";
import { expect, assert } from 'chai';
import AchivementUtil from '../src/utils/AchivementUtil';

describe("achivement", () => {
  let accessToken: any;
  let user: UserDocument;

  beforeEach(async () => {
    user = await UserUtil.createOrFindUser({
      deviceId: `randomdeviceid${_.random(true)}`,
    });
    accessToken = _.get(user, "tokens.0.accessToken");

    return await setTimeout(() => {}, 1000)
  });

  afterEach((done) => {
    User.remove(user._id)
    done();
  });

  it("non existing error", async () => {
    const res = AchivementUtil.create(user, 'jibberish')
    await expect(res).to.be.rejectedWith(/achivement_not_defined/);
  })

  it("unlock achivement & check balance", async () => {
    expect(user.balance).to.eq(0, 'Initial Balance is zero')
    await AchivementUtil.create(user, 'zorgtoestlag')

    expect(user.balance).to.eq(20)
    expect(user.transactions.length).to.eq(1)
    expect(user.achivements.length).to.eq(1)
  });

  it("unlock achivement twice, balance remains the same", async () => {
    expect(user.balance).to.eq(0, 'Initial Balance is zero')
    await AchivementUtil.create(user, 'zorgtoestlag')
    await AchivementUtil.create(user, 'zorgtoestlag')

    expect(user.achivements.length).to.eq(1)
    expect(user.transactions.length).to.eq(1)
    expect(user.balance).to.eq(20)
  });
});