import boot from '../src/boot'
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai'

chai.use(chaiAsPromised);

const failures = []
const successes = []

before(async () => {
  await boot.start()

  try {
  } catch {
  }
})

after(async (res) => {
  // User.deleteMany({}, (err) => console.log(err));
  process.exit(failures.length > 0 ? 1 : 0)
})

afterEach(function () {
  if (this.currentTest.state === 'passed') {
    successes.push(this.currentTest.title)
  } else {
    failures.push(this.currentTest.title)
  }
})

require('./taskUtil.test')
require('./initialDataUtil.test')
require('./mutations.test')
require('./queries.test')
require('./onboarding.test')