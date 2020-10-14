import _ from 'lodash';
import TaskUtil from '../src/utils/TaskUtil';
import { expect } from 'chai';
import UserUtil from '../src/utils/UserUtil';
import { UserTask } from '../src/models/UserTask';
import { TaskStatus } from '../src/generated-models';
import { UserDocument } from '../src/models/User';

describe('taskUtil', () => {
  let accessToken: any;
  let user: UserDocument;

  beforeEach(async () => {
    user = await UserUtil.createOrFindUser({
      deviceId: `randomdeviceid${_.random(true)}`,
    });
    accessToken = _.get(user, 'tokens.0.accessToken');

    return await setTimeout(() => {}, 1000);
  });

  it('when getting definition, should combine data from route & onboarding task', () => {
    const def = TaskUtil.getDefinition('onboarding.woonAdres');
    const routeTaskDef = TaskUtil.getDefinition(def.routeTaskId);

    expect(def.routeTaskId).to.eq(routeTaskDef.id);
  });

  it('completeTask', async () => {
    const def = TaskUtil.getDefinition('financieleBasis.inkomen');
    let userTask: UserTask = await TaskUtil.handleTask(user, def);

    expect(userTask.status).to.eq(TaskStatus.Completed);
  });

  it('completeTask & balance update', async () => {
    const def = TaskUtil.getDefinition('financieleBasis.ingeschrevenVoorWoning');
    const balance = user.balance;
    await TaskUtil.handleTask(user, def);

    expect(user.balance).to.eq(balance + 20);
  });

  it('completeTask task already dismissed', async () => {
    const defOne = TaskUtil.getDefinition('onboarding.inkomen');
    await TaskUtil.handleTask(user, defOne, 'no');
    const def = TaskUtil.getDefinition('financieleBasis.inkomen');
    let userTask: UserTask = await TaskUtil.handleTask(user, def);

    expect(userTask.status).to.eq(TaskStatus.Completed);
  });
});
