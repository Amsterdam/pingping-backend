import { Document, Schema, model, Types } from 'mongoose';
import { UserTask } from './UserTask';
import { UserAchievement } from './UserAchievement';
import { UserReward } from './UserReward';
import { UserGoal } from './UserGoal';
import { UserTransaction } from './UserTransaction';
import { NotificationStatus, UserRole } from '@models';
import { UserRoute } from './UserRoute';

export type UserDocument = Document & {
  email?: string;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  exportToken?: string;

  tokens?: AuthToken[];
  devices?: Device[];

  profile: {
    fullName?: string;
    dateOfBirth?: Date;
  };

  role: UserRole;

  balance: number;

  transactions?: Types.Array<UserTransaction>;
  achievements?: Types.Array<UserAchievement>;
  goals?: Types.Array<UserGoal>;
  rewards?: Types.Array<UserReward>;
  tasks?: Types.Array<UserTask>;
  routes?: Types.Array<UserRoute>;
  // createdAt: any;
};

export enum AuthTokenKind {
  auth = 'auth',
}

export interface AuthToken {
  accessToken: string;
  deviceId: string;
  kind: AuthTokenKind;
  validUntil: Date;
}

export interface Device {
  id: string;
  os?: string;
  type?: string;
  token?: string;
  notificationStatus: NotificationStatus;
}

const userSchema = new Schema(
  {
    tokens: Array,
    devices: Array,
    exportToken: String,
    email: String,
    password: String,
    role: String,
    tasks: [
      {
        routeId: String,
        routeTaskId: String,
        taskId: String,
        answer: String,
        status: String,
      },
    ],

    routes: [
      {
        routeId: String,
        answer: String,
        status: String,
      },
    ],

    routeId: [
      {
        routeId: String,
        answer: String,
        status: String,
      },
    ],

    achievements: [
      {
        achievementId: String,
        createdAt: Date,
      },
    ],

    rewards: [
      {
        rewardId: String,
        price: Number,
        status: String,
        voucherId: String,
      },
    ],

    goals: [
      {
        amount: Number,
        title: String,
        description: String,
      },
    ],

    transactions: [
      {
        title: String,
        amount: Number,
        balance: Number,
      },
    ],

    balance: {
      type: Number,
      default: 0,
    },

    profile: {
      fullName: String,
      dateOfBirth: Date,
    },
  },
  { timestamps: true }
);

export const User = model<UserDocument>('User', userSchema);
