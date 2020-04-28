import { Document, Schema, model, Types } from "mongoose";
import { UserResponse, UserRouteResponse } from '../generated/graphql';
import { UserTask } from "./UserTask";
import { UserAchivement } from './UserAchivement';

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

  routes: UserRoute[];
  achivements: UserAchivement[],
  goals: [],
  transactions: [],
  rewards: [],
  tasks: Types.Array<UserTask>;

  toResponse: toResponse
};

export type UserRoute = {
  id: string
  title: string
  progress: number
  toResponse: toUserRouteResponse
}

type toResponse = () => UserResponse;
type toUserRouteResponse = () => UserRouteResponse;

const toResponse:toResponse = function ():UserResponse {
  return {
    id: this._id,
    profile: this.profile
  }
};

const toUserRouteResponse:toUserRouteResponse = function ():UserRouteResponse {
  return {
    routeId: 'tempTest',
    title: 'Howdy'
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
      status: String
    }],

    profile: {
      fullName: String,
      dateOfBirth: Date
    },
  },
  { timestamps: true }
);

userSchema.methods.toResponse = toResponse;

export const User = model<UserDocument>("User", userSchema);
