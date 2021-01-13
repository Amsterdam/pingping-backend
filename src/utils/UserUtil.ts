import _ from 'lodash';

import { User, Device, AuthToken, AuthTokenKind, UserDocument } from '../models/User';
import InitialDataUtil from './InitialDataUtil';
import auth from '../lib/auth';
import { RegisterDeviceInput, NotificationStatus, UserRole } from '@models';
import { RewardVoucher } from 'models/RewardVoucher';
import moment from 'moment';

class UserUtil {
  static async createOrFindUser(deviceInput: RegisterDeviceInput): Promise<UserDocument> {
    let userFound: UserDocument;

    if (deviceInput.exportToken) {
      userFound = await auth.recoverUserFromExportToken(deviceInput.exportToken);
    } else {
      userFound = await User.findOne({
        devices: { $elemMatch: { id: deviceInput.deviceId } },
      });

      if (userFound) {
        // Update the device
        return userFound;
      }

      const initialTasks = InitialDataUtil.getInitialUserOnboardingTasks();

      userFound = await User.create({
        tasks: initialTasks,
        routes: [],
        balance: 0,
        role: UserRole.User,
        profile: {},
      });
    }

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
      accessToken: auth.signToken(userFound),
    };

    userFound.tokens.push(token);
    userFound.devices.push(device);
    await userFound.save();

    return userFound;
  }

  static async updateActiveAt(user: UserDocument) {
    if (!user.activeAt || moment().diff(moment(user.activeAt), 'hour') >= 12) {
      await User.updateOne({ _id: user._id }, { activeAt: new Date() });
    }
  }

  static async deleteUser(user: UserDocument) {
    const userId = user._id;
    await User.deleteOne({ _id: userId });

    // Abandon Vouchers, if the user signs up again with the same device ID, he will be assigned the same vouchers.
    await RewardVoucher.updateMany({ userId }, { $set: { userId: null } });
  }
}

export default UserUtil;
