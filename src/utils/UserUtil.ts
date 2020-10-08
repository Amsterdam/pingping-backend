import _ from 'lodash';

import { User, Device, AuthToken, AuthTokenKind, UserDocument } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import auth from '../lib/auth';
import { RegisterDeviceInput, NotificationStatus } from '@models';
import { RewardVoucher } from 'models/RewardVoucher';

class UserUtil {
  static async createOrFindUser(deviceInput: RegisterDeviceInput): Promise<UserDocument> {
    const userFound = await User.findOne({
      devices: { $elemMatch: { id: deviceInput.deviceId } },
    });

    if (userFound) {
      // Update the device

      return userFound;
    }

    const initialTasks = InitialDataUtil.getInitialUserOnboardingTasks();

    const user = await User.create({
      tasks: initialTasks,
      balance: 0,
      profile: {},
    });
    const device: Device = {
      id: deviceInput.deviceId,
      os: deviceInput.deviceOs,
      type: deviceInput.deviceType,
      token: deviceInput.deviceToken,
      notificationStatus: NotificationStatus.Initial,
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

  static async deleteUser(user: UserDocument) {
    const userId = user._id;
    await User.deleteOne({ _id: userId });

    // Abandon Vouchers, if the user signs up again with the same device ID, he will be assigned the same vouchers.
    await RewardVoucher.updateMany({ userId }, { $set: { userId: null } });
  }
}

export default UserUtil;
