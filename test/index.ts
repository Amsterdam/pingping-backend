import boot from '../src/boot';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import 'ts-mocha';

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

process.env.TS_CONFIG_PATHS = './tsconfig.json';

require('ts-mocha');
const Mocha = require('mocha');

const mocha = new Mocha({
  reporter: 'mocha-junit-reporter',
  name: 'PingPing Backend',
});
mocha.addFile(`./test/taskUtil.test.ts`);
mocha.addFile(`./test/initialDataUtil.test.ts`);
mocha.addFile(`./test/mutations.test.ts`);
mocha.addFile(`./test/queries.test.ts`);
mocha.addFile(`./test/route.test.ts`);
mocha.addFile(`./test/onboarding.test.ts`);
mocha.addFile(`./test/achivement.test.ts`);
mocha.addFile(`./test/goal.test.ts`);
mocha.addFile(`./test/reward.test.ts`);
mocha.run((failures: any) => {
  process.exit(failures);
  // process.on('exit', () => {
  //   process.exit(failures); // exit with non-zero status if there were failures
  // });
});
