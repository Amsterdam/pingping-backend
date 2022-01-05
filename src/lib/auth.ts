import _ from 'lodash';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import bcrypt from 'bcrypt-nodejs';
import cache from './cache';

import { UserDocument, User, AuthToken, AuthTokenKind, Device } from '../models/User';
import { NotificationStatus, UserRole } from '@models';
import AuthenticationError from 'errors/AuthenticationError';
import { DATA_SET_NONE } from 'models/User';
import { DATA_SET_AMSTERDAM, DATA_SET_ROTTERDAM } from 'models/User';

const TOKEN_VALIDITY_MINUTES = process.env.TOKEN_VALIDITY_MINUTES || 180;

class auth {
  static signToken(user: UserDocument): string {
    const token = jwt.sign({ userId: user.id }, process.env.SECRET);

    return token;
  }

  static async createToken(user: UserDocument, deviceId: string): Promise<AuthToken> {
    let tokenObj: AuthToken = {
      kind: AuthTokenKind.auth,
      deviceId,
      accessToken: this.signToken(user),
      validUntil: moment().add(TOKEN_VALIDITY_MINUTES, 'minutes').toDate(),
    };

    user.tokens.push(tokenObj);
    await user.save();

    return tokenObj;
  }

  static async createAdminUser() {
    await auth.createUser(
      UserRole.Admin,
      'Admin Amsterdam',
      'admin-amsterdam@pingping.amsterdam.nl',
      process.env.ADMIN_PASSWORD,
      DATA_SET_AMSTERDAM
    );

    await auth.createUser(
      UserRole.Admin,
      'Admin Rotterdam',
      'admin-rotterdam@pingping.amsterdam.nl',
      process.env.ADMIN_PASSWORD,
      DATA_SET_ROTTERDAM
    );
  }

  static async login(ip: string, email: string, candidatePassword: string, deviceId: string) {
    if (cache.getIp(ip) > 7 || cache.getUsername(email) > 3) {
      throw new Error('too_many_attempts');
    }

    const user = await User.findOne({ email, role: { $ne: UserRole.User } });

    if (!user) {
      cache.registerIp(ip);
      throw new AuthenticationError();
    }

    const res = await bcrypt.compareSync(candidatePassword, user.password);

    if (!res) {
      cache.registerUsername(email);

      throw new AuthenticationError();
    }

    const token = await auth.createToken(user, deviceId);

    return {
      accessToken: token.accessToken,
      user,
    };
  }

  static async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err: any, salt: any) => {
        if (err) {
          return reject(err);
        }
        bcrypt.hash(password, salt, undefined, (err: Error, hash: string) => {
          if (err) {
            return reject(err);
          }
          return resolve(hash);
        });
      });
    });
  }

  static async createUser(role: UserRole, fullName: string, email: string, password: string, dataSet: string) {
    try {
      const user = await User.findOneAndUpdate(
        {
          email,
        },
        {
          profile: { fullName },
          role,
          dataSet,
          password: await auth.hashPassword(password),
          balance: 0,
          devices: [
            {
              id: 'admin',
              type: 'Admin',
              os: 'Admin',
              notificationStatus: NotificationStatus.Declined,
            },
          ],
        },
        { upsert: true, new: true }
      );

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
