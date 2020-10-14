import moment from 'moment';
import { UserDocument } from 'models/User';

export const UserResponse: any = {
  id: (doc: UserDocument) => doc._id,
  createdAt: (doc: any) => moment(doc.createdAt).toString(),
};

export const AdminUserResponse: any = {
  data: (doc: UserDocument) => doc,
};
