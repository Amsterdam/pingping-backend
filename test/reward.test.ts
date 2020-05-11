import _ from 'lodash'
import { UserDocument, User } from "../src/models/User";
import UserUtil from "../src/utils/UserUtil";
import { expect } from 'chai';
import { describe } from 'mocha';
import RewardUtil from '../src/utils/RewardUtil';
import TransactionUtil from '../src/utils/TransactionUtil';

describe("goal", () => {
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
    const res = RewardUtil.claim(user, 'mambo-jambo')
    await expect(res).to.be.rejectedWith(/reward_not_defined/);
  })

  it("claim reward", async () => {
    await TransactionUtil.addTransaction(user, 'Test', 20)
    const rew = await RewardUtil.claim(user, 'meelopen-met-jongeren')

    expect(user.rewards.length).to.eq(1)
    expect(user.balance).to.eq(0)
  });

  it("claim reward insufficient balance", async () => {
    const res = RewardUtil.claim(user, 'meelopen-met-jongeren')

    await expect(res).to.be.rejectedWith(/reward_insufficient_balance/);
  });

  it("claim reward already claimed", async () => {
    // Add balance for test, enough to claim the reward twice.
    await TransactionUtil.addTransaction(user, 'Test', 40)

    await RewardUtil.claim(user, 'meelopen-met-jongeren')

    const res = RewardUtil.claim(user, 'meelopen-met-jongeren')

    await expect(res).to.be.rejectedWith(/reward_already_claimed/);
  });
});