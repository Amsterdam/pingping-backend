import { UserRole } from '@models';
import NoPermissionError from 'errors/NoPermissionError';
import UnauthorizedError from 'errors/UnauthorizedError';
import cache from 'lib/cache';
import { ContextType } from 'lib/Context';
import { userInfo } from 'os';
import UserUtil from 'utils/UserUtil';

export default class AuthMiddleware {
  // This function is called with resolversComposition from the graphql-modules library.
  static isAuthenticated() {
    return (next: Function) => {
      return async (root: any, args: any, context: ContextType, info: any) => {
        if (!context.user || !context.device) {
          throw new UnauthorizedError();
        }

        UserUtil.updateActiveAt(context.user);

        return next(root, args, context, info);
      };
    };
  }

  static isAdmin() {
    return (next: Function) => {
      return async (root: any, args: any, context: ContextType, info: any) => {
        if (!context.user || context.user.role !== UserRole.Admin) {
          throw new NoPermissionError();
        }

        return next(root, args, context, info);
      };
    };
  }
}
