import _ from 'lodash';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { UserTask } from 'models/UserTask';

import { UserDocument, User, AuthToken, AuthTokenKind, Device } from '../models/User';

const TOKEN_VALIDITY_MINUTES = process.env.TOKEN_VALIDITY_MINUTES || 180;

class auth {
  static signToken(user: UserDocument): string {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET);

    return token;
  }

  static getRandomPassword(len = 8) {
    return Math.random()
      .toString(36)
      .slice(len * -1);
  }

  static async createToken(user: UserDocument): Promise<AuthToken> {
    let tokenObj: AuthToken = {
      kind: AuthTokenKind.auth,
      deviceId: null,
      accessToken: this.signToken(user),
      validUntil: moment().add(TOKEN_VALIDITY_MINUTES, 'minutes').toDate(),
    };

    user.tokens.push(tokenObj);
    await user.save();

    return tokenObj;
  }

  static async createUser(fullName: string, email: string, password: string) {
    try {
      const user = await User.create({
        profile: { fullName },
        email,
        password,
        balance: 0,
        tasks: [] as Array<UserTask>,
      });

      return user;
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        throw new Error('user already exists');
      }

      throw error;
    }
  }

  static async getUser(headerToken: string): Promise<UserDocument> {
    let token: any;
    try {
      token = jwt.verify(headerToken.replace(/bearer/gi, '').trim(), process.env.SECRET);
      const user = await this.userQuery(token.userId);

      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async getDevice(headerToken: string): Promise<Device> {
    let token: any;
    try {
      const tokenString = headerToken.replace(/bearer/gi, '').trim();
      token = jwt.verify(tokenString, process.env.SECRET);
      const user = await this.userQuery(token.userId);

      if (!user) {
        return null;
      }

      const tokenItem: AuthToken = _.first(user.tokens.filter((t: AuthToken) => t.accessToken === tokenString));

      if (tokenItem) {
        const deviceItem: Device = _.first(user.devices.filter((d: Device) => d.id === tokenItem.deviceId));

        return deviceItem;
      }

      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  static async userQuery(userId: string) {
    return await User.findOne({ _id: userId });
  }

  // Recovers a user from an export token and removes token and devices for that user.
  static async recoverUserFromExportToken(exportToken: string): Promise<UserDocument> {
    let token: any;
    try {
      token = jwt.verify(exportToken.trim(), process.env.SECRET);
    } catch {
      throw new Error('invalid_export_token');
    }

    let user = await auth.userQuery(token.userId);

    if (!user) {
      throw new Error('invalid_export_token');
    } else {
      user.tokens = [];
      user.devices = [];
      await user.save();

      return user;
    }
  }
}

export default auth;
