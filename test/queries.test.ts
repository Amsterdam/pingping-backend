import _ from 'lodash';
import { describe, it } from 'mocha';
import { expect, assert } from 'chai';
import request from 'supertest';
import { UserDocument } from '../src/models/User';
import index from '../src/index';
import UserUtil from '../src/utils/UserUtil';
import auth from '../src/lib/auth';
import { RewardResponse, UserRole } from '../src/generated-models';
import { DATA_SET_AMSTERDAM } from '../src/models/User';

describe('queries', () => {
  let server: any;
  let user: UserDocument;
  let admin: UserDocument;
  let accessToken: string;
  let adminAccessToken: any;

  before(async () => {
    admin = await auth.createUser(UserRole.Admin, 'Admin', 'admin@test.com', 'password', DATA_SET_AMSTERDAM);
    adminAccessToken = await auth.createToken(admin, 'testhellotests');
  });

  beforeEach(async () => {
    server = index;
    user = await UserUtil.createOrFindUser({ deviceId: 'test1234test' });
    accessToken = _.get(user, 'tokens.0.accessToken');
  });

  afterEach((done) => {
    done();
  });

  it('get status', (done) => {
    request(server)
      .post('/api')
      .send({
        query: `query getStatus {
            getStatus {
              user {
                balance
                rewards {
                  reward {
                    title
                  }
                }
                goals {
                  title
                }
              }
            }
          }`,
        operationName: 'getStatus',
      })
      .set({ Authorization: `Bearer ${accessToken}`, Accept: 'application/json' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: any, res: any) => {
        const body = res.body.data.getStatus;
        expect(body.user.balance).to.equal(0);
        expect(body.user.rewards.length).to.equal(0);
        expect(body.user.goals.length).to.equal(0);
        done();
      });
  });

  it('get available rewards', (done) => {
    request(server)
      .post('/api')
      .send({
        query: `query getAvailableRewards {
            getAvailableRewards {
              title
              description
            }
          }`,
        operationName: 'getAvailableRewards',
      })
      .set({ Authorization: `Bearer ${accessToken}`, Accept: 'application/json' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: any, res: any) => {
        const body = res.body.data.getAvailableRewards;
        const first: RewardResponse = _.first(body);

        expect(first.title).to.equal('Pathe Thuis Film', 'check title');
        done();
      });
  });
});
