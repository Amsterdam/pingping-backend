import _ from 'lodash'
import { ModuleContext } from '@graphql-modules/core';

import { UserDocument } from '../models/User';
import auth from './auth';

export interface IModuleContext {
  user: UserDocument,
}

export const context = async (request: any, currentContext:ModuleContext, { injector }: any) => {
  const accessToken = _.get(request, "req.headers.authorization", null);
  const user = accessToken ? await auth.getUser(accessToken) : null;

  return { user } as IModuleContext;
}
