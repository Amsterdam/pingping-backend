import { Document, Schema, model, Types, SchemaTypes } from "mongoose";
import { UserResponse, UserTaskResponse, UserRouteResponse, TaskStatus } from '../generated/graphql';
import TaskUtil from "../utils/TaskUtil";
import { TaskDefinition } from '../types/global';

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
  achivements: [],
  goals: [],
  transactions: [],
  rewards: [],
  tasks: Types.Array<UserTask>;

  toResponse: toResponse
};

//  interface UserTaskDocument {
//   taskId: string
//   answer: string
//   status: TaskStatus
// }

export class UserTask {
  taskId: string
  answer: string
  status: TaskStatus
  task: TaskDefinition

  constructor(taskId:string, status:TaskStatus, answer:string = null) {
    this.taskId = taskId;
    this.status = status;
    this.answer = answer
  }

  toResponse ():UserTaskResponse {
    return {
      ...TaskUtil.getDefinition(this.taskId),
      taskId: this.taskId,
      status: this.status,
      answer: this.answer
    }
  }
}

export type UserRoute = {
  id: string
  title: string
  progress: number
  toResponse: toUserRouteResponse
}

type toResponse = () => UserResponse;
// type toUserTaskResponse = () => UserTaskResponse;
type toUserRouteResponse = () => UserRouteResponse;

const toResponse:toResponse = function ():UserResponse {
  return {
    id: this._id,
    profile: this.profile
  }
};

// const toUserTaskResponse:toUserTaskResponse = function ():UserTaskResponse {
//   return {
//     ...TaskUtil.getDefinition(this._id),
//     id: this.id,
//     status: this.status,
//     answer: this.answer
//   }
// };

const toUserRouteResponse:toUserRouteResponse = function ():UserRouteResponse {
  return {
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
    // tasks: SchemaTypes.Array<>,
    // tasks: Types.Array<UserTask>
    tasks: [{
      taskId: String,
      answer: String,
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
