import _ from 'lodash'
import { UserDocument, User } from "../src/models/User";
import UserUtil from "../src/utils/UserUtil";
import { expect } from 'chai';
import RouteUtil from '../src/utils/RouteUtil';
import { UserRoute } from '../src/models/UserRoute';

describe("route", () => {
  let accessToken: any;
  let user: UserDocument;

  beforeEach(async () => {
    user = await UserUtil.createOrFindUser({
      deviceId: `randomdeviceid${_.random(true)}`,
    });
    accessToken = _.get(user, "tokens.0.accessToken");

    return await setTimeout(() => {}, 1000)
  });

  afterEach((done) => {
    User.remove(user._id)
    done();
  });

  it("non existing error", async () => {
    const res = RouteUtil.assignToUser(user, 'jibberish')
    await expect(res).to.be.rejectedWith(/route_not_defined/);
  })

  it("assign to user", async () => {
    await RouteUtil.assignToUser(user, 'financieleBasis')

    expect(user.routes.length).to.eq(1)

    const route:UserRoute = _.first(user.routes)
    expect(route.routeId).to.eq('financieleBasis')
  });
});