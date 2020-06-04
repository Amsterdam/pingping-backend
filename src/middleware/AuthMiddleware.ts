import { ModuleContext } from '@graphql-modules/core';
import UnauthorizedError from 'errors/UnauthorizedError';

export default class AuthMiddleware {
  // This function is called with resolversComposition from the graphql-modules library.
  static isAuthenticated() {
    return (next: Function) => {
      return async (root: any, args: any, context: ModuleContext, info: any) => {
        if (!context.user) {
          throw new UnauthorizedError();
        }

        return next(root, args, context, info);
      };
    };
  }
}
