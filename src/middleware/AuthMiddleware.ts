import UnauthorizedError from 'errors/UnauthorizedError';
import { ContextType } from 'lib/Context';

export default class AuthMiddleware {
  // This function is called with resolversComposition from the graphql-modules library.
  static isAuthenticated() {
    return (next: Function) => {
      return async (root: any, args: any, context: ContextType, info: any) => {
        if (!context.user) {
          throw new UnauthorizedError();
        }

        return next(root, args, context, info);
      };
    };
  }

  static isAdmin() {
    return (next: Function) => {
      return async (root: any, args: any, context: ContextType, info: any) => {
        console.log(context);
        // if (!context.user) {
        // throw new UnauthorizedError();
        // }

        // @todo do admin check

        return next(root, args, context, info);
      };
    };
  }
}
