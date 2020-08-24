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
      let taskDef: TaskDefinition = InitialDataUtil.getTaskById('onboarding.dateOfBirth');
      return await TaskUtil.handleTask(user, taskDef, '2012-24-01');
    };
    await expect(call()).to.be.rejectedWith(BadRequestError);
  });

  it('error, cannot complete task', async () => {
    const call = async () => {
      let taskDef: TaskDefinition = InitialDataUtil.getTaskById('onboarding.dateOfBirth');
      return await TaskUtil.completeTask(user, taskDef);
    };
    await expect(call()).to.be.rejectedWith('onboarding_task_cannot_be_completed_must_be_updated');
  });

  it('handle task', async () => {
    let taskDef: TaskDefinition = InitialDataUtil.getTaskById('onboarding.dateOfBirth');
    const taskOneRes = await TaskUtil.handleTask(user, taskDef, '2012-01-01');
    expect(taskOneRes.status).to.eq(TaskStatus.Completed);
    expect(taskOneRes.answer).to.eq('2012-01-01');
  });

  it('get next task in line', async () => {
    try {
      let taskDef: TaskDefinition = InitialDataUtil.getTaskById('onboarding.dateOfBirth');
      await TaskUtil.handleTask(user, taskDef, '2012-01-01');
      const nextTask = await TaskUtil.getNextTask(user);
      expect(nextTask.status).to.eq(TaskStatus.PendingUser);
      expect(nextTask.taskId).to.eq('onboarding.woonAdres');
    } catch (e) {
      console.error(e);

      throw e;
    }
  });

  it('handle next task', async () => {
    try {
      let taskDef: TaskDefinition = InitialDataUtil.getTaskById('onboarding.dateOfBirth');
      let taskDefTwo: TaskDefinition = InitialDataUtil.getTaskById('onboarding.woonAdres');
      await TaskUtil.handleTask(user, taskDef, '2012-01-01');
      await TaskUtil.handleTask(user, taskDefTwo, 'yes');
      let taskDefThree: TaskDefinition = InitialDataUtil.getTaskById('onboarding.bankRekening');
      const taskOneRes = await TaskUtil.handleTask(user, taskDefThree, 'yes');
      expect(taskOneRes.status).to.eq(TaskStatus.Completed);
      expect(taskOneRes.answer).to.eq('yes');
      let taskDefFour: TaskDefinition = InitialDataUtil.getTaskById('onboarding.digiD');
      const taskTwoRes = await TaskUtil.handleTask(user, taskDefFour, 'yes');
      expect(taskTwoRes.status).to.eq(TaskStatus.Completed);
      expect(taskTwoRes.answer).to.eq('yes');

      let taskDefFive: TaskDefinition = InitialDataUtil.getTaskById('onboarding.zorgverzekering');
      const taskThreeRes = await TaskUtil.handleTask(user, taskDefFive, 'yes');
      expect(taskThreeRes.status).to.eq(TaskStatus.Completed);
      expect(taskThreeRes.answer).to.eq('yes');

      let taskDefSix: TaskDefinition = InitialDataUtil.getTaskById('onboarding.zorgtoeslag');
      const taskFourRes = await TaskUtil.handleTask(user, taskDefSix, 'yes');
      expect(taskFourRes.status).to.eq(TaskStatus.Completed);
      expect(taskFourRes.answer).to.eq('yes');

      let taskDefSeven: TaskDefinition = InitialDataUtil.getTaskById('onboarding.inkomen');
      const taskFiveRes = await TaskUtil.handleTask(user, taskDefSeven, 'yes');
      expect(taskFiveRes.status).to.eq(TaskStatus.Completed);
      expect(taskFiveRes.answer).to.eq('yes');

      let taskDefEight: TaskDefinition = InitialDataUtil.getTaskById('onboarding.waarKomtJeInkomenVandaan');
      const taskSixRes = await TaskUtil.handleTask(user, taskDefEight, 'yes');
      expect(taskSixRes.status).to.eq(TaskStatus.Completed);
      expect(taskSixRes.answer).to.eq('yes');

      let taskDefNine: TaskDefinition = InitialDataUtil.getTaskById('onboarding.ingeschrevenVoorWoning');
      const taskSevenRes = await TaskUtil.handleTask(user, taskDefNine, 'yes');
      expect(taskSevenRes.status).to.eq(TaskStatus.Completed);
      expect(taskSevenRes.answer).to.eq('yes');
      expect(user.tasks.filter((i) => i.status === TaskStatus.PendingUser).length).to.eq(0);
    } catch (e) {
      console.error(e);

      throw e;
    }
  });

  it('handle next task different path', async () => {
    try {
      let taskDef: TaskDefinition = InitialDataUtil.getTaskById('onboarding.dateOfBirth');
      let taskDefZ: TaskDefinition = InitialDataUtil.getTaskById('onboarding.woonAdres');
      await TaskUtil.handleTask(user, taskDef, '2012-01-01');
      const taskZeroRes = await TaskUtil.handleTask(user, taskDefZ, 'no');
      expect(taskZeroRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskZeroRes.answer).to.eq('no');

      let taskDef2: TaskDefinition = InitialDataUtil.getTaskById('onboarding.zorgverzekering');
      const taskThreeRes = await TaskUtil.handleTask(user, taskDef2, 'no');
      expect(taskThreeRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskThreeRes.answer).to.eq('no');

      let taskDef3: TaskDefinition = InitialDataUtil.getTaskById('onboarding.zorgtoeslag');
      const taskFourRes = await TaskUtil.handleTask(user, taskDef3, 'no');
      expect(taskFourRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskFourRes.answer).to.eq('no');

      let taskDef4: TaskDefinition = InitialDataUtil.getTaskById('onboarding.inkomen');
      const taskFiveRes = await TaskUtil.handleTask(user, taskDef4, 'no');
      expect(taskFiveRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskFiveRes.answer).to.eq('no');

      let taskDef5: TaskDefinition = InitialDataUtil.getTaskById('onboarding.ingeschrevenVoorWoning');
      const taskSevenRes = await TaskUtil.handleTask(user, taskDef5, 'no');
      expect(taskSevenRes.status).to.eq(TaskStatus.Dismissed);
      expect(taskSevenRes.answer).to.eq('no');

      expect(user.tasks.filter((i) => i.status === TaskStatus.PendingUser).length).to.eq(0);
    } catch (e) {
      console.error(e);

      throw e;
    }
  });
});
