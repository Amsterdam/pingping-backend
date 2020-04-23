import { expect } from 'chai'
import _ from 'lodash'

import UserUtil from '../src/utils/UserUtil';
import { UserDocument } from '../src/models/User';
import TaskUtil from '../src/utils/TaskUtil';
import { TaskStatus } from '../src/generated/graphql';
import BadRequestError from '../src/errors/BadRequestError';

describe('onboarding', () => {
  let accessToken:any
  let user:UserDocument

  beforeEach(async () => {
    user = await UserUtil.createOrFindUser({ deviceId: 'test1234test'})
    accessToken = _.get(user, 'tokens.0.accessToken')
  });

  afterEach((done) => {
    done();
  });

  it ('handle invalid input error', async () => {
    const call = async () => {
      return await TaskUtil.handleTask(user, 'onboarding.dateOfBirth', '2012-24-01')
    }
    await expect(call()).to.be.rejectedWith(BadRequestError)
  })

  it ('handle task', async () => {
    const taskOneRes = await TaskUtil.handleTask(user, 'onboarding.dateOfBirth', '2012-01-01')
    expect(taskOneRes.status).to.eq(TaskStatus.Completed)
    expect(taskOneRes.answer).to.eq('2012-01-01')
  })

  it ('get next task in line', async () => {
    const nextTask = await TaskUtil.getNextTask(user)
    expect(nextTask.status).to.eq(TaskStatus.PendingUser)
    expect(nextTask.taskId).to.eq('onboarding.woonAdres')
  })
})