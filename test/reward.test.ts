import _ from 'lodash';
import { UserDocument, User } from '../src/models/User';
import UserUtil from '../src/utils/UserUtil';
import { expect } from 'chai';
import { describe } from 'mocha';
import RewardUtil from '../src/utils/RewardUtil';
import TransactionUtil from '../src/utils/TransactionUtil';
import { RewardVoucher } from '../src/models/RewardVoucher';
import InitialDataUtil from '../src/utils/InitialDataUtil';

describe('reward', () => {
  let accessToken: any;
  let user: UserDocument;
  let user3: UserDocument;
  let user4: UserDocument;
  let voucher: any;
  let deviceId: string = `randomdeviceid${_.random(true)}`;

  beforeEach(async () => {
    user = await UserUtil.createOrFindUser({
      deviceId,
    });
    user3 = await UserUtil.createOrFindUser({
      deviceId: `randomdeviceid${_.random(true)}`,
    });
    user4 = await UserUtil.createOrFindUser({
      deviceId: `randomdeviceid${_.random(true)}`,
    });
    accessToken = _.get(user, 'tokens.0.accessToken');

    voucher = RewardVoucher.create({
      rewardId: 'pathe-test',
      data: { pin: '1234', code: 'test1' },
      userId: null,
      deviceId: null,
    });
    RewardVoucher.create({
      rewardId: 'pathe-test',
      data: { pin: '1234', code: 'test2' },
      userId: null,
      deviceId: null,
    });
    RewardVoucher.create({
      rewardId: 'pathe-test',
      data: { pin: '1234', code: 'test3' },
      userId: null,
      deviceId: null,
    });

    return await setTimeout(() => {}, 1000);
  });

  afterEach((done) => {
    User.remove(user._id);
    done();
  });

  it('non existing error', async () => {
    const res = RewardUtil.claim(user, 'mambo-jambo');
    await expect(res).to.be.rejectedWith(/reward_not_defined/);
  });

  it('has 2 rewards in definition', async () => {
    const res = InitialDataUtil.getRewards();

    expect(res.length).to.eq(2);
  });

  it('claim reward', async () => {
    await TransactionUtil.addTransaction(user, 'Test', 20, 'lkdfjg');
    const rew = await RewardUtil.claim(user, 'meelopen-met-jongeren');

    expect(user.rewards.length).to.eq(1);
    expect(user.balance).to.eq(0);
  });

  it('claim reward insufficient balance', async () => {
    const res = RewardUtil.claim(user, 'pathe-test');

    await expect(res).to.be.rejectedWith(/reward_insufficient_balance/);
  });

  // it('claim reward already claimed', async () => {
  //   // Add balance for test, enough to claim the reward twice.
  //   await TransactionUtil.addTransaction(user, 'Test', 40, 'sdflj');

  //   await RewardUtil.claim(user, 'meelopen-met-jongeren');
  //   // const res = RewardUtil.claim(user, 'meelopen-met-jongeren');
  //   const res = RewardUtil.assignVoucher('meelopen-met-jongeren', user);

  //   await expect(Promise.resolve(res)).to.eventually.be.rejected;
  // });

  // it('claim reward again after delete, same voucher', async () => {
  //   await TransactionUtil.addTransaction(user, 'Test', 140, 'sdflj');
  //   await TransactionUtil.addTransaction(user3, 'Test', 140, 'sdflj');
  //   const reward = await RewardUtil.claim(user, 'pathe-test');
  //   await UserUtil.deleteUser(user);

  //   const userTwoSameDevice = await UserUtil.createOrFindUser({
  //     deviceId,
  //   });
  //   await TransactionUtil.addTransaction(userTwoSameDevice, 'Test', 140, 'sdflj');

  //   const rewardTwo = await RewardUtil.claim(userTwoSameDevice, 'pathe-test');
  //   const rewardThree = await RewardUtil.claim(user3, 'pathe-test');

  //   expect(reward.voucherId).to.eq(rewardTwo.voucherId);
  //   expect(reward.voucherId).to.not.eq(rewardThree.voucherId);
  // });

  it('delete voucher', async () => {
    let reward = _.first(user.rewards);
    await RewardUtil.deleteVoucher(reward.voucherId);

    let userItem: any = await User.findOne({ _id: user._id });
    expect(userItem.rewards.length).to.eq(0);
  });
});
