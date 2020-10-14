import _ from 'lodash'
import { UserDocument, User } from "../src/models/User";
import UserUtil from "../src/utils/UserUtil";
import { expect, assert } from 'chai';
import GoalUtil from '../src/utils/GoalUtil';
import { describe } from 'mocha';
import { UserGoal } from '../src/models/UserGoal';

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

  it("create goal", async () => {
    await GoalUtil.create(user, 'Test Title', 'Test Description', 100)

    expect(user.goals.length).to.eq(1)

    const firstGoal:UserGoal = _.first(user.goals)
    expect(firstGoal.title).to.eq('Test Title')
    expect(firstGoal.description).to.eq('Test Description')
    expect(firstGoal.amount).to.eq(100)
  });
});