import _ from 'lodash';

import { UserDocument, Device } from 'models/User';
import { ModuleContext } from '@graphql-modules/core';
import auth from './auth';
import cache from './cache';

export type ContextType = ModuleContext & {
  req: object;
  user?: UserDocument;
  device?: Device;
  accessToken: string;
  cache: any;
};

export const getContext = async (context: any): Promise<ContextType> => {
  const accessToken = _.get(context, 'req.headers.authorization', null);
  const user = accessToken ? await auth.getUser(accessToken) : null;
  const device = accessToken ? await auth.getDevice(accessToken) : null;

  return { ...context, user, device, accessToken, cache } as ContextType;
};
