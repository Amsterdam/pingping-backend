import _ from 'lodash';
// import { TaskStatus } from "@models";
import { TaskDefinition, RouteDefinition, AchivementDefinition, RewardDefinition } from '../types/global';
import { TaskStatus } from '../generated-models';
// import { TaskStatus } from "@models";
const initialData: InitialData = require('../../initialData.json');

type InitialData = {
  onboardingTasks: [TaskDefinition];
  routes: {
    [key: string]: RouteDefinition;
  };
  achivements: [AchivementDefinition];
  rewards: [RewardDefinition];
};

type OnboardingTaskDefinition = TaskDefinition & {
  nextTaskId?: string;
  nextRotueId?: string;
  progress: number;
};

type TaskIdObject = {
  routeId: string;
  taskId: string;
};

class InitialDataUtil {
  // Task id can conlude a refereice to a route like this Route.taskId. Here we deconstruct it.
  static deconstructTaskId(id: string): TaskIdObject {
    const [routeId, taskId] = id.split('.');

    return {
      routeId,
      taskId,
    };
  }

  static getRouteIdFromTaskId(id: string): string {
    const [routeId, taskId] = id.split('.');

    return routeId;
  }

  static getTaskFromArray(id: string, items: Array<TaskDefinition>): TaskDefinition {
    const tasks = items.filter((i: TaskDefinition) => i.id === id);

    return _.first(tasks);
  }

  static getRoutes(): Array<RouteDefinition> {
    const keys = Object.keys(initialData.routes);

    return Object.values(initialData.routes).map((r: RouteDefinition, index: number) => {
      return {
        id: keys[index],
        ...r,
      };
    });
  }

  static getRouteById(id: string): RouteDefinition {
    const route = _.get(initialData, `routes.${id}`);

    if (!route) {
      throw new Error(`route_not_defined`);
    }

    route.id = id;

    return route;
  }

  static getAchivementById(id: string): AchivementDefinition {
    const achivements = initialData.achivements.filter((i: AchivementDefinition) => i.id === id);
    let achivement: AchivementDefinition = _.first(achivements);

    if (!achivement) {
      throw new Error(`achivement_not_defined`);
    }

    return achivement;
  }

  static getAchivements(): Array<AchivementDefinition> {
    return initialData.achivements;
  }

  static getTaskById(id: string): TaskDefinition {
    const tasks = initialData.onboardingTasks.filter((i: TaskDefinition) => i.id === id);
    let task: TaskDefinition = _.first(tasks);

    // If onboarding task is not found, look for a rotue task
    if (!task) {
      const taskObj = this.deconstructTaskId(id);
      const route = this.getRouteById(taskObj.routeId);

      if (route) {
        task = this.getTaskFromArray(id, route.tasks);
      }
    }

    if (!task) {
      throw new Error(`task_not_defined`);
    }

    return task;
  }

  static getOnboardingProgress(taskId: string): number {
    const tasks = initialData.onboardingTasks.length;
    const index = initialData.onboardingTasks.map((i) => i.id).indexOf(taskId);

    return _.round((index + 1) / tasks, 2);
  }

  static getInitialUserOnboardingTasks(): Array<any> {
    const tasks = initialData.onboardingTasks.filter((i: any) => i.initial && i.initial === true);

    return tasks.map((i: OnboardingTaskDefinition) => {
      return {
        taskId: i.id,
        status: TaskStatus.PendingUser,
        type: i.type,
      };
    });
  }

  static getRewards(): Array<RewardDefinition> {
    const rewards = initialData.rewards;

    return rewards;
  }

  static getReward(id: string): RewardDefinition {
    const rewards = initialData.rewards.filter((r: RewardDefinition) => r.id === id);

    let reward: RewardDefinition = _.first(rewards);

    if (!reward) {
      throw new Error(`reward_not_defined`);
    }

    return reward;
  }
}

export default InitialDataUtil;
