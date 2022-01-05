import { expect } from 'chai';
import _ from 'lodash';

import UserUtil from '../src/utils/UserUtil';
import { UserDocument, User } from '../src/models/User';
import TaskUtil from '../src/utils/TaskUtil';
import BadRequestError from '../src/errors/BadRequestError';
import { TaskStatus } from '../src/generated-models';
import { TaskDefinition } from '../src/types/global';
import InitialDataUtil from '../src/utils/InitialDataUtil';

describe('onboarding', () => {
  let accessToken: any;
  let user: UserDocument;

  beforeEach(async () => {
    user = await UserUtil.createOrFindUser({
      deviceId: `randomdeviceid${_.random(true)}`,
    });
    accessToken = _.get(user, 'tokens.0.accessToken');
  });

  afterEach((done) => {
    User.remove(user._id);
    done();
  });

  it('error, handle invalid input', async () => {
    const call = async () => {
      let taskDef: TaskDefinition = TaskUtil.getDefinition('onboarding.dateOfBirth');
      return await TaskUtil.handleTask(user, taskDef, '2012-24-01');
    };
    await expect(call()).to.be.rejectedWith(BadRequestError);
  });

  // it('error, cannot complete task', async () => {
  //   const call = async () => {
  //     let taskDef: TaskDefinition = TaskUtil.getDefinition('onboarding.dateOfBirth');
  //     return await TaskUtil.handleTask(user, taskDef);
  //   };
  //   await expect(call()).to.be.rejectedWith('onboarding_task_cannot_be_completed_must_be_updated');
  // });

  it('handle task', async () => {
    let taskDef: TaskDefinition = TaskUtil.getDefinition('onboarding.gemeente');
    const taskOneRes = await TaskUtil.handleTask(user, taskDef, 'amsterdam');
    expect(taskOneRes.status).to.eq(TaskStatus.Completed);
    expect(taskOneRes.answer).to.eq('amsterdam');
  });

  it('get next task in line', async () => {
    try {
      let taskDef: TaskDefinition = TaskUtil.getDefinition('onboarding.dateOfBirth');
      await TaskUtil.handleTask(user, taskDef, '2012-01-01');
      const nextTask = await TaskUtil.getNextTask(user);
      expect(nextTask.status).to.eq(TaskStatus.PendingUser);
      expect(nextTask.taskId).to.eq('onboarding.gemeente');
    } catch (e) {
      console.error(e);

      throw e;
    }
  });

  it('handle next task', async () => {
    try {
      let taskDef0: TaskDefinition = TaskUtil.getDefinition('onboarding.gemeente');
      await TaskUtil.handleTask(user, taskDef0, 'amsterdam');
      let taskDefWelcome: TaskDefinition = TaskUtil.getDefinition('onboarding.welcome');
      await TaskUtil.handleTask(user, taskDefWelcome, 'yes');
      let taskDef: TaskDefinition = TaskUtil.getDefinition('onboarding.dateOfBirth');
      let taskDefTwo: TaskDefinition = TaskUtil.getDefinition('onboarding.woonAdres');
      await TaskUtil.handleTask(user, taskDef, '2012-01-01');
      await TaskUtil.handleTask(user, taskDefTwo, 'yes');
      let taskDefThree: TaskDefinition = TaskUtil.getDefinition('onboarding.bankRekening');
      const taskOneRes = await TaskUtil.handleTask(user, taskDefThree, 'yes');
      expect(taskOneRes.status).to.eq(TaskStatus.Completed);
      expect(taskOneRes.answer).to.eq('yes');
      let taskDefFour: TaskDefinition = TaskUtil.getDefinition('onboarding.digiD');
      const taskTwoRes = await TaskUtil.handleTask(user, taskDefFour, 'yes');
      expect(taskTwoRes.status).to.eq(TaskStatus.Completed);
      expect(taskTwoRes.answer).to.eq('yes');

      let taskDefFive: TaskDefinition = TaskUtil.getDefinition('onboarding.zorgverzekering');
      const taskThreeRes = await TaskUtil.handleTask(user, taskDefFive, 'yes');
      expect(taskThreeRes.status).to.eq(TaskStatus.Completed);
      expect(taskThreeRes.answer).to.eq('yes');

      let taskDefSix: TaskDefinition = TaskUtil.getDefinition('onboarding.zorgtoeslag');
      const taskFourRes = await TaskUtil.handleTask(user, taskDefSix, 'yes');
      expect(taskFourRes.status).to.eq(TaskStatus.Completed);
      expect(taskFourRes.answer).to.eq('yes');

      let taskDefSeven: TaskDefinition = TaskUtil.getDefinition('onboarding.inkomen');
      const taskFiveRes = await TaskUtil.handleTask(user, taskDefSeven, 'yes');
      expect(taskFiveRes.status).to.eq(TaskStatus.Completed);
      expect(taskFiveRes.answer).to.eq('yes');

      let taskDefEight: TaskDefinition = TaskUtil.getDefinition('onboarding.waarKomtJeInkomenVandaan');
      const taskSixRes = await TaskUtil.handleTask(user, taskDefEight, 'yes');
      expect(taskSixRes.status).to.eq(TaskStatus.Completed);
      expect(taskSixRes.answer).to.eq('yes');

      let taskDefNine: TaskDefinition = TaskUtil.getDefinition('onboarding.ingeschrevenVoorWoning');
      const taskSevenRes = await TaskUtil.handleTask(user, taskDefNine, 'yes');
      expect(taskSevenRes.status).to.eq(TaskStatus.Completed);
      expect(taskSevenRes.answer).to.eq('yes');
      expect(user.tasks.filter((i) => i.status === TaskStatus.PendingUser).length).to.eq(0);
      expect(user.balance).to.eq(140);
    } catch (e) {
      console.error(e);

      throw e;
    }
  });

  it('handle next task different path', async () => {
    try {
      let taskDef0: TaskDefinition = TaskUtil.getDefinition('onboarding.gemeente');
      await TaskUtil.handleTask(user, taskDef0, 'amsterdam');
      let taskDefWelcome: TaskDefinition = TaskUtil.getDefinition('onboarding.welcome');
      await TaskUtil.handleTask(user, taskDefWelcome, 'yes');
      let taskDef: TaskDefinition = TaskUtil.getDefinition('onboarding.dateOfBirth');
      let taskDefZ: TaskDefinition = TaskUtil.getDefinition('onboarding.woonAdres');
      await TaskUtil.handleTask(user, taskDef, '2012-01-01');
      const taskZeroRes = await TaskUtil.handleTask(user, taskDefZ, 'no');
      expect(taskZeroRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskZeroRes.answer).to.eq('no');

      let taskDefThree: TaskDefinition = TaskUtil.getDefinition('onboarding.bankRekening');
      await TaskUtil.handleTask(user, taskDefThree, 'no');

      let taskDefFour: TaskDefinition = TaskUtil.getDefinition('onboarding.digiD');
      await TaskUtil.handleTask(user, taskDefFour, 'no');

      let taskDef2: TaskDefinition = TaskUtil.getDefinition('onboarding.zorgverzekering');
      const taskThreeRes = await TaskUtil.handleTask(user, taskDef2, 'no');
      expect(taskThreeRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskThreeRes.answer).to.eq('no');

      let taskDef3: TaskDefinition = TaskUtil.getDefinition('onboarding.zorgtoeslag');
      const taskFourRes = await TaskUtil.handleTask(user, taskDef3, 'no');
      expect(taskFourRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskFourRes.answer).to.eq('no');

      let taskDef4: TaskDefinition = TaskUtil.getDefinition('onboarding.inkomen');
      const taskFiveRes = await TaskUtil.handleTask(user, taskDef4, 'no');
      expect(taskFiveRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskFiveRes.answer).to.eq('no');

      let taskDef5: TaskDefinition = TaskUtil.getDefinition('onboarding.ingeschrevenVoorWoning');
      const taskSevenRes = await TaskUtil.handleTask(user, taskDef5, 'no');
      expect(taskSevenRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskSevenRes.answer).to.eq('no');
      const pending = user.tasks.filter((i) => i.status === TaskStatus.PendingUser);
      expect(pending.length, pending.toString()).to.eq(0);

      expect(user.balance).to.eq(0);
    } catch (e) {
      console.error(e);

      throw e;
    }
  });
});
