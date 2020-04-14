import _ from "lodash";
import Context from "./Context";
import ValidationError from "../errors/ValidationError";
import { User, Device, AuthToken, AuthTokenKind, UserTask } from "../models/User";
import auth from "../lib/auth";
import InitialDataUtil from "../utils/InitialDataUtil";
import TaskUtil from "../utils/TaskUtil";
import { RegisterDeviceResponse, UpdateTaskResponse } from '../generated/graphql';
import UnauthorizedError from '../errors/UnauthorizedError';
import {
  MutationResolvers,
  MutationRegisterDeviceArgs,
  MutationUpdateTaskArgs,
} from "../generated/graphql";

const PingPingMutations: MutationResolvers = {
  async registerDevice(
    root: any,
    args: MutationRegisterDeviceArgs
  ): Promise<RegisterDeviceResponse> {
    if (args.input.deviceId.length < 12) {
      throw new ValidationError("deviceId is should be at least 12 characters");
    }

    const userFound = await User.findOne({
      devices: { $elemMatch: { id: args.input.deviceId } },
    });

    if (userFound) {
      return {
        user: {
          id: userFound._id,
          profile: userFound.profile
        },
        ..._.last(userFound.tokens),
        currentTask: TaskUtil.getCurrentUserTask(userFound).toResponse(),
      };
    }

    const initialTasks = InitialDataUtil.getInitialUserTasks();
    console.log(initialTasks);

    const user = await User.create({
      tasks: initialTasks,
    });
    const device: Device = {
      id: args.input.deviceId,
      os: args.input.deviceOs,
      type: args.input.deviceType,
    };
    const token: AuthToken = {
      deviceId: args.input.deviceId,
      kind: AuthTokenKind.auth,
      validUntil: null,
      accessToken: await auth.signToken(user),
    };

    user.tokens.push(token);
    user.devices.push(device);
    user.save();

    const currentTask = <UserTask> TaskUtil.getCurrentUserTask(user)

    return {
      accessToken: token.accessToken,
      user: {
        id: user._id,
        profile: user.profile
      },
      currentTask: currentTask.toResponse(),
    };
  },

  async updateTask(root: any, args: MutationUpdateTaskArgs, context: Context):Promise<UpdateTaskResponse> {
    if (!context.user) {
      throw new UnauthorizedError()
    }

    const task = TaskUtil.getUserTask(context.user, args.input.taskId);

    if (!task) {
      throw new Error('task_not_found')
    }

    console.log(task)

    return {
      previousTask: task.toResponse(),
      nextTask: null,
    };
  },
};

export default PingPingMutations;
