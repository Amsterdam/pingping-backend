import boot from '../src/boot'
import auth from '../src/lib/auth'
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai'
import { User } from '../src/models/User';

chai.use(chaiAsPromised);

before(async () => {
  await boot.start()

  try {
  } catch {
  }
})

after(async () => {
  User.deleteMany({}, (err) => console.log(err));
})