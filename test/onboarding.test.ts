import { expect } from "chai";
import _ from "lodash";

import UserUtil from "../src/utils/UserUtil";
import { UserDocument, User } from '../src/models/User';
import TaskUtil from "../src/utils/TaskUtil";
import { TaskStatus } from "../src/generated/graphql";
import BadRequestError from "../src/errors/BadRequestError";

describe("onboarding", () => {
  let accessToken: any;
  let user: UserDocument;

  beforeEach(async () => {
    user = await UserUtil.createOrFindUser({
      deviceId: `randomdeviceid${_.random(true)}`,
    });
    accessToken = _.get(user, "tokens.0.accessToken");
  });

  afterEach((done) => {
    User.remove(user._id)
    done();
  });

  it("error, handle invalid input", async () => {
    const call = async () => {
      return await TaskUtil.handleTask(
        user,
        "onboarding.dateOfBirth",
        "2012-24-01"
      );
    };
    await expect(call()).to.be.rejectedWith(BadRequestError);
  });

  it("error, non existing", async () => {
      const res = TaskUtil.handleTask(
      user,
      "jibberish",
      "2012-24-01"
    );
    await expect(res).to.be.rejectedWith(/task_not_found_on_user/);
  });

  it("error, invalid status", async () => {
    await TaskUtil.handleTask(
      user,
      "onboarding.dateOfBirth",
      "2012-01-01"
    );
    const res = TaskUtil.handleTask(
      user,
      "onboarding.dateOfBirth",
      "2012-01-01"
    );
    await expect(res).to.be.rejectedWith(/task_invalid_status/);
  });

  // it("non existing on user error", async () => {
  //   const res = TaskUtil.handleTask(
  //     user,
  //     "onboarding.bankRekening",
  //     "2012-24-01"
  //   );
  //   await expect(res).to.be.rejectedWith(/task_not_found_on_user/);
  // });

  it("handle task", async () => {
    const taskOneRes = await TaskUtil.handleTask(
      user,
      "onboarding.dateOfBirth",
      "2012-01-01"
    );
    expect(taskOneRes.status).to.eq(TaskStatus.Completed);
    expect(taskOneRes.answer).to.eq("2012-01-01");
  });

  it("get next task in line", async () => {
    try {
      await TaskUtil.handleTask(
        user,
        "onboarding.dateOfBirth",
        "2012-01-01"
      );
      const nextTask = await TaskUtil.getNextTask(user);
      expect(nextTask.status).to.eq(TaskStatus.PendingUser);
      expect(nextTask.taskId).to.eq("onboarding.woonAdres");
    } catch (e) {
      console.error(e);

      throw e
    }
  });

  it("handle next task", async () => {
    try {
      await TaskUtil.handleTask(
        user,
        "onboarding.dateOfBirth",
        "2012-01-01"
      );
      await TaskUtil.handleTask(
        user,
        "onboarding.woonAdres",
        'true'
      );
      const taskOneRes = await TaskUtil.handleTask(
        user,
        "onboarding.bankRekening",
        "true"
      );
      expect(taskOneRes.status).to.eq(TaskStatus.Completed);
      expect(taskOneRes.answer).to.eq('true');
      const taskTwoRes = await TaskUtil.handleTask(
        user,
        "onboarding.digiD",
        "true"
      );
      expect(taskTwoRes.status).to.eq(TaskStatus.Completed);
      expect(taskTwoRes.answer).to.eq('true');

      const taskThreeRes = await TaskUtil.handleTask(
        user,
        "onboarding.zorgverzekering",
        "true"
      );
      expect(taskThreeRes.status).to.eq(TaskStatus.Completed);
      expect(taskThreeRes.answer).to.eq('true');

      const taskFourRes = await TaskUtil.handleTask(
        user,
        "onboarding.zorgtoeslag",
        "true"
      );
      expect(taskFourRes.status).to.eq(TaskStatus.Completed);
      expect(taskFourRes.answer).to.eq('true');

      const taskFiveRes = await TaskUtil.handleTask(
        user,
        "onboarding.inkomen",
        "true"
      );
      expect(taskFiveRes.status).to.eq(TaskStatus.Completed);
      expect(taskFiveRes.answer).to.eq('true');

      const taskSixRes = await TaskUtil.handleTask(
        user,
        "onboarding.waarKomtJeInkomenVandaan",
        "true"
      );
      expect(taskSixRes.status).to.eq(TaskStatus.Completed);
      expect(taskSixRes.answer).to.eq('true');

      const taskSevenRes = await TaskUtil.handleTask(
        user,
        "onboarding.ingeschrevenVoorWoning",
        "true"
      );
      expect(taskSevenRes.status).to.eq(TaskStatus.Completed);
      expect(taskSevenRes.answer).to.eq('true');

      expect(user.routes.length).to.eq(1)
    } catch (e) {
      console.error(e)

      throw e
    }
  });
});
