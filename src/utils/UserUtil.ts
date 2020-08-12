import _ from 'lodash';

import { User, Device, AuthToken, AuthTokenKind, UserDocument } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import auth from '../lib/auth';
import { RegisterDeviceInput } from '@models';

class UserUtil {
  static async createOrFindUser(deviceInput: RegisterDeviceInput): Promise<UserDocument> {
    const userFound = await User.findOne({
      devices: { $elemMatch: { id: deviceInput.deviceId } },
    });

    if (userFound) {
      return userFound;
    }

    const initialTasks = InitialDataUtil.getInitialUserOnboardingTasks();

    const user = await User.create({
      tasks: initialTasks,
    });
    const device: Device = {
      id: deviceInput.deviceId,
      os: deviceInput.deviceOs,
      type: deviceInput.deviceType,
      token: deviceInput.deviceToken,
    };
    const token: AuthToken = {
      deviceId: deviceInput.deviceId,
      kind: AuthTokenKind.auth,
      validUntil: null,
      accessToken: auth.signToken(user),
    };

    user.tokens.push(token);
    user.devices.push(device);
    await user.save();

    return user;
  }
}

export default UserUtil;
