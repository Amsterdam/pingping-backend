import NoPermissionError from 'errors/NoPermissionError';
import UnauthorizedError from 'errors/UnauthorizedError';
import { ContextType } from 'lib/Context';

export default class AuthMiddleware {
  // This function is called with resolversComposition from the graphql-modules library.
  static isAuthenticated() {
    return (next: Function) => {
      return async (root: any, args: any, context: ContextType, info: any) => {
        if (!context.user || !context.device) {
          throw new UnauthorizedError();
        }

        return next(root, args, context, info);
      };
    };
  }

  static isAdmin() {
    return (next: Function) => {
      return async (root: any, args: any, context: ContextType, info: any) => {
        if (!context.user || !context.device || context.device.id !== process.env.SECRET.substr(0, 12)) {
          throw new NoPermissionError();
        }

        return next(root, args, context, info);
      };
    };
  }
}
