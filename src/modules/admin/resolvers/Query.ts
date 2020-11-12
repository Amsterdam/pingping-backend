import { QueryResolvers } from '@models';
import { ContextType } from 'lib/Context';
import { AuditLog } from 'models/AuditLog';
import { User } from 'models/User';

export const Query: QueryResolvers = {
  async adminGetUsers(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await User.find({});
  },

  async adminGetAuditLog(root: any, args: any, context: ContextType): Promise<Array<any>> {
    return await AuditLog.find({});
  },
};
