import _ from "lodash";
import Context from "./Context";
import ValidationError from "../errors/ValidationError";
import { UserTask } from "../models/UserTask";
import TaskUtil from "../utils/TaskUtil";
import UnauthorizedError from "../errors/UnauthorizedError";
import UserUtil from "../utils/UserUtil";
import RewardUtil from "../utils/RewardUtil";
import {
  UserReward,
  toResponse as getUserRewardResponse,
} from "../models/UserReward";
import { UserGoal } from "../models/UserGoal";
import GoalUtil from "../utils/GoalUtil";
import InitialDataUtil from "../utils/InitialDataUtil";
import RouteUtil from '../utils/RouteUtil';
import { ModuleContext } from '@graphql-modules/core';

const PingPingMutations: MutationResolvers = {
  async startRoute(root: any, args: MutationStartRouteArgs, context:ModuleContext) {
    if (!context.user) {
      throw new UnauthorizedError();
    }

    // Check if exists
    let routeDef = InitialDataUtil.getRouteById(args.routeId);

    const userRoute = await RouteUtil.assignToUser(context.user, args.routeId)

    return userRoute.toResponse(context.user)
  },

  async updateTask(
    root: any,
    args: MutationUpdateTaskArgs,
    context: ModuleContext
  ): Promise<UpdateTaskResponse> {
    if (!context.user) {
      throw new UnauthorizedError();
    }

    let task = TaskUtil.getUserTask(context.user, args.input.taskId);

    if (!task) {
      throw new Error("task_not_found_on_user");
    }

    task = await TaskUtil.handleTask(
      context.user,
      args.input.taskId,
      args.input.answer
    );

    const nextTask = TaskUtil.getNextTask(context.user);

    return {
      previousTask: task.toResponse(),
      nextTask: nextTask ? nextTask.toResponse() : undefined,
    };
  },

  async claimReward(
    root: any,
    args: MutationClaimRewardArgs,
    context: ModuleContext
  ): Promise<UserRewardResponse> {
    if (!context.user) {
      throw new UnauthorizedError();
    }

    const userReward: UserReward = await RewardUtil.claim(
      context.user,
      args.rewardId
    );

    return getUserRewardResponse(userReward);
  },

  async createGoal(
    root: any,
    args: MutationCreateGoalArgs,
    context: ModuleContext
  ): Promise<UserGoalResponse> {
    if (!context.user) {
      throw new UnauthorizedError();
    }

    const userGoal: UserGoal = await GoalUtil.create(
      context.user,
      args.input.title,
      args.input.description,
      args.input.amount
    );

    return {
      _id: userGoal._id,
      title: userGoal.title,
      description: userGoal.description,
      amount: userGoal.amount,
    };
  },
};

export default PingPingMutations;
