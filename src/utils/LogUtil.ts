import { AuditLogType } from '@models';
import { AuditLog } from 'models/AuditLog';
import { UserDocument } from 'models/User';

export default class LogUtil {
  static async create(user: UserDocument, type: AuditLogType, description: string, linkId: string = undefined) {
    await AuditLog.create({ user: user._id, type, description, linkId });
  }
}
