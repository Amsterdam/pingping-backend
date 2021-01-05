import _ from 'lodash';
import { UserDocument, User } from '../src/models/User';
import { expect, assert } from 'chai';
import cache from '../src/lib/cache';

describe('login limiter', () => {
  let accessToken: any;
  let user: UserDocument;

  beforeEach(async () => {});

  afterEach((done) => {
    done();
  });

  it('should register login attempts', () => {
    let res = cache.registerIp('test');

    expect(res).to.eq(1);
  });

  it('should register two attempts', () => {
    cache.registerIp('test2');
    let res = cache.registerIp('test2');

    expect(res).to.eq(2);
  });

  it('should register two attempts, wait', async () => {
    cache.registerIp('test3');
    await setTimeout(() => {
      let res = cache.registerIp('test3');

      expect(res).to.eq(2);
    }, 100);
  });

  it('should register two attempts, wait', async () => {
    cache.registerIp('test4');
    cache.registerIp('test4');

    await setTimeout(() => {
      let res = cache.registerIp('test4');

      expect(res).to.eq(3);
    }, 100);
  });
});
