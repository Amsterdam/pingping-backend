import _ from 'lodash'

import { User, Device, AuthToken, AuthTokenKind } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import { RegisterDeviceInput } from '../generated/graphql';
import auth from '../lib/auth';

class UserUtil {
  static async createOrFindUser(deviceInput:RegisterDeviceInput) {
    const userFound = await User.findOne({
      devices: { $elemMatch: { id: deviceInput.deviceId } },
    });

    if (userFound) {
      return userFound
    }

    const initialTasks = InitialDataUtil.getInitialUserTasks();

    const user = await User.create({
      tasks: initialTasks,
    });
    const device:Device = {
      id: deviceInput.deviceId,
      os: deviceInput.deviceOs,
      type: deviceInput.deviceType,
    };
    const token:AuthToken = {
      deviceId: deviceInput.deviceId,
      kind: AuthTokenKind.auth,
      validUntil: null,
      accessToken: auth.signToken(user),
    };

    user.tokens.push(token);
    user.devices.push(device);
    user.save();

    return user
  }
}

export default UserUtil
