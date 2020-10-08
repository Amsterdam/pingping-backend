import 'reflect-metadata';
import boot from '../src/boot';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import 'ts-mocha';
import { RewardVoucher } from '../src/models/RewardVoucher';
import { User } from '../src/models/User';

chai.use(chaiAsPromised);

const failures = [];
const successes = [];

before(async () => {
  await boot.start();

  try {
  } catch {}
});

afterEach(function () {
  if (this.currentTest.state === 'passed') {
    successes.push(this.currentTest.title);
  } else {
    failures.push(this.currentTest.title);
  }
});

after(async () => {
  User.deleteMany({}, (err: any) => console.log(err));
  RewardVoucher.deleteMany({}, (err: any) => console.log(err));
});

process.env.TS_CONFIG_PATHS = './tsconfig.json';
process.env.NODE_ENV = 'test';

require('ts-mocha');
const Mocha = require('mocha');

const mocha = new Mocha({
  reporter: 'mocha-junit-reporter',
  name: 'PingPing Backend',
});

require('./taskUtil.test.ts');
require('./initialDataUtil.test.ts');
require('./mutations.test.ts');
require('./queries.test.ts');
require('./route.test.ts');
require('./onboarding.test.ts');
require('./achievement.test.ts');
require('./goal.test.ts');
require('./reward.test.ts');
