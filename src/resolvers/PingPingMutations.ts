import _ from "lodash";
import Context from "./Context";
import ValidationError from "../errors/ValidationError";
import { UserTask } from '../models/UserTask';
import TaskUtil from "../utils/TaskUtil";
import { RegisterDeviceResponse, UpdateTaskResponse, TaskStatus } from '../generated/graphql';
import UnauthorizedError from '../errors/UnauthorizedError';
import UserUtil from '../utils/UserUtil';
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

    const user = await UserUtil.createOrFindUser(args.input)
    const currentTask:UserTask = TaskUtil.getCurrentUserTask(user)

    return {
      user: {
        id: user._id,
        profile: user.profile
      },
      ..._.last(user.tokens),
      currentTask: currentTask.toResponse()
    };
  },

  async updateTask(root: any, args: MutationUpdateTaskArgs, context: Context):Promise<UpdateTaskResponse> {
    if (!context.user) {
      throw new UnauthorizedError()
    }

    let task = TaskUtil.getUserTask(context.user, args.input.taskId);

    if (!task) {
      throw new Error('task_not_found')
    }

    if (task.status !== TaskStatus.PendingUser) {
      throw new Error(`invalid task status: ${task.status}`)
    }

    task = await TaskUtil.handleTask(context.user, args.input.taskId, args.input.answer)

    const nextTask = TaskUtil.getNextTask(context.user)

    return {
      previousTask: task.toResponse(),
      nextTask: nextTask ? nextTask.toResponse() : undefined
    };
  },
};

export default PingPingMutations;
