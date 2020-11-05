import { AuditLogDocument } from 'models/AuditLog';
import { User, UserDocument } from 'models/User';

export const AdminUserResponse: any = {
  userTasks: (doc: UserDocument) => doc.tasks,
};

export const AuditLogResponse: any = {
  user: async (doc: AuditLogDocument) => {
    return await User.find({ _id: doc.user });
  },
};
