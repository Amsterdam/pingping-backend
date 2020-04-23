import _ from 'lodash'
import { describe, it } from "mocha";
import { expect, assert } from "chai";
import request from "supertest";
import index from "../src/index";

describe("Graph API", () => {
  let server: any;

  beforeEach(() => {
    server = index.express;
  });

  afterEach((done) => {
    done();
  });

  it("regiser device, error, wrong device id", (done) => {
    console.log("test");
      request(server)
        .post("/")
        .send({
          query: `mutation registerDevice($input:RegisterDeviceInput!) {
            registerDevice(input:$input) {
              accessToken
            }
          }`,
          operationName: "registerDevice",
          variables: { input: { deviceId: "lkfj" } },
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          console.log(res.status, res.text)
          // expect(res.status).to.eq(400)
        })
        .end((err: any, res: any) => {
          const errors = (res.body.errors || []).map((i:any) => i.message).join(' ')
          expect(errors).to.contain('deviceId');
          done()
        })
  });

  it("regiser device, successful", (done) => {
    console.log("test");
      request(server)
        .post("/")
        .send({
          query: `mutation registerDevice($input:RegisterDeviceInput!) {
            registerDevice(input:$input) {
              accessToken,
              currentTask {
                taskId
              }
            }
          }`,
          operationName: "registerDevice",
          variables: { input: { deviceId: "test1234test" } },
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          console.log(res.status, res.text)
          // expect(res.status).to.eq(400)
        })
        .end((err: any, res: any) => {
          const data = _.get(res, 'body.data.registerDevice', {})
          expect(_.get(data, 'currentTask.taskId')).to.eq('dateOfBirth')
          expect(_.get(data, 'accessToken').length).to.eq(153)
          done()
        })
  });
});
