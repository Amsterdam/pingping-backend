import _ from "lodash";
import { describe, it } from "mocha";
import { expect, assert } from "chai";
import index from "../src/index";
import request from "supertest";
import { UserDocument } from '../src/models/User';
import UserUtil from "../src/utils/UserUtil";
import { RewardResponse, AchivementResponse } from '../src/generated/graphql';

describe("queries", () => {
  let server:any;
  let user:UserDocument
  let accessToken:string

  beforeEach(async () => {
    server = index.express;
    user = await UserUtil.createOrFindUser({ deviceId: 'test1234test'})
    accessToken = _.get(user, 'tokens.0.accessToken')
  });

  afterEach((done) => {
    done();
  });

  it("get status", (done) => {
    request(server)
      .post("/")
      .send({
        query: `query getStatus {
            getStatus {
              user {
                balance
                rewards {
                  title
                }
                goals {
                  title
                }
              }
            }
          }`,
        operationName: "getStatus"
      })
      .set({ 'Authorization': `Bearer ${accessToken}`, Accept: 'application/json' })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        const body = res.body.data.getStatus
        expect(body.user.balance).to.equal(0);
        expect(body.user.rewards.length).to.equal(0);
        expect(body.user.goals.length).to.equal(0);
        done();
      });
  });

  it("get available rewards", (done) => {
    request(server)
      .post("/")
      .send({
        query: `query getAvailableRewards {
            getAvailableRewards {
              title
              description
            }
          }`,
        operationName: "getAvailableRewards"
      })
      .set({ 'Authorization': `Bearer ${accessToken}`, Accept: 'application/json' })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        const body = res.body.data.getAvailableRewards
        const first:RewardResponse = _.first(body)

        expect(first.title).to.equal('Meelopen met jongeren- adviseur t.w.v. €50', 'check title');
        done();
      });
  });

  it("get achivements", (done) => {
    request(server)
      .post("/")
      .send({
        query: `query getAchivements {
          getAchivements {
            title
            description
            icon
            achivementId
            status
            points
          }
        }`,
        operationName: "getAchivements"
      })
      .set({ 'Authorization': `Bearer ${accessToken}`, Accept: 'application/json' })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err: any, res: any) => {
        const body = res.body.data.getAchivements
        const first:AchivementResponse = _.first(body)
        expect(first.title).to.equal('Zorgtoeslag');
        expect(first.description).to.equal('Zorgtoeslag');
        expect(first.points).to.equal(20);
        done();
      });
  });
})