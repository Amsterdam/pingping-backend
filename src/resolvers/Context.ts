import { UserDocument } from '../models/User';

interface Context {
  req: object,
  user: UserDocument,
  accessToken: string,
}

export default Context;
