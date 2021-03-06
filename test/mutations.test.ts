import _ from 'lodash';
import { describe, it } from 'mocha';
import { expect, assert } from 'chai';
import request from 'supertest';
import App from '../src/App';
import index from '../src/index';
import UserUtil from '../src/utils/UserUtil';

describe('mutations', () => {
  let server: any;

  beforeEach(() => {
    server = index;
  });

  afterEach((done) => {
    done();
  });

  it('register device, error, wrong device id', (done) => {
    request(server)
      .post('/api')
      .send({
        query: `mutation registerDevice($input:RegisterDeviceInput!) {
            registerDevice(input:$input) {
              accessToken
            }
          }`,
        operationName: 'registerDevice',
        variables: { input: { deviceId: 'lkfj' } },
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: any, res: any) => {
        const errors = (res.body.errors || []).map((i: any) => i.message).join(' ');
        expect(errors).to.contain('deviceId');
        done();
      });
  });

  it('regiser device, successful', (done) => {
    request(server)
      .post('/api')
      .send({
        query: `mutation registerDevice($input:RegisterDeviceInput!) {
            registerDevice(input:$input) {
              accessToken,
              currentTask {
                task {
                  taskId
                }
              }
            }
          }`,
        operationName: 'registerDevice',
        variables: { input: { deviceId: `test1234test:${_.random(true)}` } },
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: any, res: any) => {
        const data = _.get(res, 'body.data.registerDevice', {});
        expect(_.get(data, 'currentTask.task.taskId')).to.eq('onboarding.gemeente', 'arg');
        expect(_.get(data, 'accessToken').length).to.eq(153);
        done();
      });
  });

  it('make secure request without token and fail', (done) => {
    request(server)
      .post('/api')
      .send({
        query: `mutation updateTask($input:UpdateTaskInput!) {
            updateTask(input:$input) {
              nextTask {
                task {
                  taskId
                }
              }
            }
          }`,
        operationName: 'updateTask',
        variables: { input: { answer: '2012-01-01', taskId: 'dateOfBirth' } },
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: any, res: any) => {
        const errors = (res.body.errors || []).map((i: any) => i.message).join(' ');
        expect(errors).to.contain('unauthorized');
        done();
      });
  });
  it('make secure request with token and pass', (done) => {
    UserUtil.createOrFindUser({ deviceId: `dfg${_.random(true)}` }).then((res) => {
      let accessToken = _.get(res, 'tokens.0.accessToken');

      request(server)
        .post('/api')
        .send({
          query: `mutation updateTask($input:UpdateTaskInput!) {
          updateTask(input:$input) {
            nextTask {
              task {
                taskId
                title
              }
            },
            previousTask {
              task {
                taskId
                title
              }
            }
          }
        }`,
          operationName: 'updateTask',
          variables: { input: { answer: '2012-01-01', taskId: 'onboarding.dateOfBirth' } },
        })
        .set({ Authorization: `Bearer ${accessToken}`, Accept: 'application/json' })
        .expect(200)
        .end((err: any, res: any) => {
          const errors = (res.body.errors || []).map((i: any) => i.message);
          expect(errors).to.be.an('array').that.is.empty;
          done();
        });
    });
  });
});
