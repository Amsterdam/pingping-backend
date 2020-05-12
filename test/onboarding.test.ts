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
        'yes'
      );
      const taskOneRes = await TaskUtil.handleTask(
        user,
        "onboarding.bankRekening",
        "yes"
      );
      expect(taskOneRes.status).to.eq(TaskStatus.Completed);
      expect(taskOneRes.answer).to.eq('yes');
      const taskTwoRes = await TaskUtil.handleTask(
        user,
        "onboarding.digiD",
        "yes"
      );
      expect(taskTwoRes.status).to.eq(TaskStatus.Completed);
      expect(taskTwoRes.answer).to.eq('yes');

      const taskThreeRes = await TaskUtil.handleTask(
        user,
        "onboarding.zorgverzekering",
        "yes"
      );
      expect(taskThreeRes.status).to.eq(TaskStatus.Completed);
      expect(taskThreeRes.answer).to.eq('yes');

      const taskFourRes = await TaskUtil.handleTask(
        user,
        "onboarding.zorgtoeslag",
        "yes"
      );
      expect(taskFourRes.status).to.eq(TaskStatus.Completed);
      expect(taskFourRes.answer).to.eq('yes');

      const taskFiveRes = await TaskUtil.handleTask(
        user,
        "onboarding.inkomen",
        "yes"
      );
      expect(taskFiveRes.status).to.eq(TaskStatus.Completed);
      expect(taskFiveRes.answer).to.eq('yes');

      const taskSixRes = await TaskUtil.handleTask(
        user,
        "onboarding.waarKomtJeInkomenVandaan",
        "yes"
      );
      expect(taskSixRes.status).to.eq(TaskStatus.Completed);
      expect(taskSixRes.answer).to.eq('yes');

      const taskSevenRes = await TaskUtil.handleTask(
        user,
        "onboarding.ingeschrevenVoorWoning",
        "yes"
      );
      expect(taskSevenRes.status).to.eq(TaskStatus.Completed);
      expect(taskSevenRes.answer).to.eq('yes');

      expect(user.routes.length).to.eq(1)
    } catch (e) {
      console.error(e)

      throw e
    }
  });

  it("handle next task different path", async () => {
    try {
      await TaskUtil.handleTask(
        user,
        "onboarding.dateOfBirth",
        "2012-01-01"
      );
      const taskZeroRes = await TaskUtil.handleTask(
        user,
        "onboarding.woonAdres",
        'no'
      );
      expect(taskZeroRes.status).to.eq(TaskStatus.Completed);
      expect(taskZeroRes.answer).to.eq('no');
      // const taskOneRes = await TaskUtil.handleTask(
      //   user,
      //   "onboarding.bankRekening",
      //   "yes"
      // );
      // expect(taskOneRes.status).to.eq(TaskStatus.Completed);
      // expect(taskOneRes.answer).to.eq('true');
      // const taskTwoRes = await TaskUtil.handleTask(
      //   user,
      //   "onboarding.digiD",
      //   "true"
      // );
      // expect(taskTwoRes.status).to.eq(TaskStatus.Completed);
      // expect(taskTwoRes.answer).to.eq('true');
      const taskThreeRes = await TaskUtil.handleTask(
        user,
        "onboarding.zorgverzekering",
        "no"
      );
      expect(taskThreeRes.status).to.eq(TaskStatus.Completed);
      expect(taskThreeRes.answer).to.eq('no');

      const taskFourRes = await TaskUtil.handleTask(
        user,
        "onboarding.zorgtoeslag",
        "no"
      );
      expect(taskFourRes.status).to.eq(TaskStatus.Completed);
      expect(taskFourRes.answer).to.eq('no');

      const taskFiveRes = await TaskUtil.handleTask(
        user,
        "onboarding.inkomen",
        "no"
      );
      expect(taskFiveRes.status).to.eq(TaskStatus.Completed);
      expect(taskFiveRes.answer).to.eq('no');

      const taskSevenRes = await TaskUtil.handleTask(
        user,
        "onboarding.ingeschrevenVoorWoning",
        "no"
      );
      expect(taskSevenRes.status).to.eq(TaskStatus.Completed);
      expect(taskSevenRes.answer).to.eq('no');

      expect(user.routes.length).to.eq(1)
    } catch (e) {
      console.error(e)

      throw e
    }
  });
});
