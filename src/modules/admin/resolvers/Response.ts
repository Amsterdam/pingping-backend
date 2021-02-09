import { AuditLogDocument } from 'models/AuditLog';
import { User, UserDocument } from 'models/User';
import InitialDataUtil from 'utils/InitialDataUtil';
import { UserRoute } from 'models/UserRoute';

export const AdminUserResponse: any = {
  userTasks: (doc: UserDocument) => doc.tasks,
};

export const AuditLogResponse: any = {
  user: async (doc: AuditLogDocument) => {
    return await User.findOne({ _id: doc.user });
  },
};
