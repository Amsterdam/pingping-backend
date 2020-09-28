import moment from 'moment';
import { UserDocument } from 'models/User';

export const UserResponse: any = {
  id: (doc: UserDocument) => doc._id,
  profile: (doc: UserDocument) => doc.profile,
  balance: (doc: UserDocument) => doc.balance,
  rewards: (doc: UserDocument) => doc.rewards,
  createdAt: (doc: any) => moment(doc.createdAt).toString(),
};
