import moment from 'moment';
import { UserDocument } from 'models/User';
import auth from '../../../lib/auth';
import { ContextType } from 'lib/Context';

export const UserResponse: any = {
  id: (doc: UserDocument) => doc._id,
  createdAt: (doc: any) => moment(doc.createdAt).toString(),
};

export const StatusResponse: any = {
  exportToken: (doc: any, args: any, context: ContextType) => {
    return auth.signToken(context.user);
  },
};

export const AdminUserResponse: any = {
  data: (doc: UserDocument) => doc,
};
