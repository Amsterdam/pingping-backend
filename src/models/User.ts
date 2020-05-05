import { Document, Schema, model, Types } from "mongoose";
import { UserResponse } from '../generated/graphql';
import { UserTask } from "./UserTask";
import { UserAchivement } from './UserAchivement';
import { UserReward } from "./UserReward";
import { UserRoute } from "./UserRoute";

export type UserDocument = Document & {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;

  facebook: string;
  tokens: AuthToken[];
  devices: Device[];

  profile: {
    fullName: string;
    dateOfBirth: Date
  };

  balance: number;

  routes: UserRoute[];
  achivements: UserAchivement[],
  goals: [],
  transactions: [],
  rewards: Types.Array<UserReward>,
  tasks: Types.Array<UserTask>;

  toResponse: toResponse
};

type toResponse = () => UserResponse;

const toResponse:toResponse = function ():UserResponse {
  return {
    id: this._id,
    profile: this.profile
  }
};

export enum AuthTokenKind {
  auth = 'auth'
}

export interface AuthToken {
  accessToken: string;
  deviceId: string;
  kind: AuthTokenKind;
  validUntil: Date;
}

export interface Device {
  id: string,
  os?: string,
  type?: string
}

const userSchema = new Schema(
  {
    tokens: Array,
    devices: Array,
    routes: Array,
    tasks: [{
      taskId: String,
      answer: String,
      status: String
    }],

    achivements: [{
      achivementId: String
    }],

    rewards: [{
      rewardId: String,
      price: Number,
      status: String
    }],

    balance: {
      type: Number,
      default: 0
    },

    profile: {
      fullName: String,
      dateOfBirth: Date
    },
  },
  { timestamps: true }
);

userSchema.methods.toResponse = toResponse;

export const User = model<UserDocument>("User", userSchema);
