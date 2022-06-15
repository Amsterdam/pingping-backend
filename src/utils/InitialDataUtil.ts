import _ from 'lodash';
import { TaskDefinition, RouteDefinition, AchievementDefinition, RewardDefinition } from '../types/global';
import { TaskStatus } from '../generated-models';
import { ENV_TEST } from '../config/index';
import { ONBOARDING_PREFIX } from 'utils/TaskUtil';
import { DATA_SET_NONE, DATA_SET_AMSTERDAM, DATA_SET_ROTTERDAM } from 'models/User';

if (process.env.ENVIRONMENT === ENV_TEST) {
  // Load test data instead?
}

let initialData: InitialData = {
  onboardingTasks: [],
  routes: {},
  achievements: [],
  rewards: [],
};

type InitialData = {
  onboardingTasks: Array<TaskDefinition>;
  routes: {
    [key: string]: RouteDefinition;
  };
  achievements: Array<AchievementDefinition>;
  rewards: Array<RewardDefinition>;
};

type OnboardingTaskDefinition = TaskDefinition & {
  nextTaskId?: string | object;
  nextRoute?: string | object;
  progress: number;
};

type TaskIdObject = {
  routeId: string;
  taskId: string;
};

const tenants = [DATA_SET_AMSTERDAM, DATA_SET_ROTTERDAM, DATA_SET_NONE];

type Def = RouteDefinition | RewardDefinition | TaskDefinition | AchievementDefinition;

class InitialDataUtil {
  static loadAllTenants(): void {
    let rewards: Array<RewardDefinition> = [];
    let onboarding: Array<TaskDefinition> = [];
    let achievements: Array<AchievementDefinition> = [];

    for (const tenant of tenants) {
      let rewardItems: Array<RewardDefinition> = InitialDataUtil.loadDefTypeForTenant<RewardDefinition>(
        tenant,
        'rewards'
      );
      rewards = [...rewards, ...rewardItems];

      let routeItems: Array<RouteDefinition> = InitialDataUtil.loadDefTypeForTenant<RouteDefinition>(tenant, 'routes');

      for (const route of routeItems) {
        initialData.routes[route.id] = route;
      }

      let onboardingItems: Array<TaskDefinition> = InitialDataUtil.loadDefTypeForTenant<TaskDefinition>(
        tenant,
        'onboarding'
      );
      onboarding = [...onboarding, ...onboardingItems];

      let achievementItems: Array<AchievementDefinition> = InitialDataUtil.loadDefTypeForTenant<AchievementDefinition>(
        tenant,
        'achievements'
      );
      achievements = [...achievements, ...achievementItems];
    }

    initialData.rewards = rewards;
    initialData.onboardingTasks = onboarding;
    initialData.achievements = achievements;
  }

  static loadDefTypeForTenant<T extends Def>(tenant: string, type: string): Array<T> {
    try {
      const items: Array<T> = require(`../../defs/${tenant}/${type}.json`) || [];

      for (const item of items) {
        item.dataSet = tenant;
      }

      return items;
    } catch (e) {
      console.info(`No ${type}.json found for tenant ${tenant}`);

      return [];
    }
  }

  // Task id does contain a reference to a route like this Route.taskId. Here we deconstruct it.
  static deconstructTaskId(id: string): TaskIdObject {
    const [routeId, taskId] = id.split('.');

    return {
      routeId,
      taskId,
    };
  }

  static getTaskFromArray(id: string, items: Array<TaskDefinition>): TaskDefinition {
    const tasks = items.filter((i: TaskDefinition) => i.id === id);

    return _.first(tasks);
  }

  static getRoutes(dataSet: string = null): Array<RouteDefinition> {
    return Object.values(initialData.routes)
      .map((r: RouteDefinition, index: number) => {
        return {
          ...r,
        };
      })
      .filter((r: RouteDefinition) => (dataSet ? r.dataSet === dataSet : true));
  }

  static getRouteById(id: string): RouteDefinition {
    const route = _.get(initialData, `routes.${id}`);

    if (!route) {
      throw new Error(`route_not_defined:${id}`);
    }

    route.id = id;

    return route;
  }

  static getRoute(key: string, dataset: string): RouteDefinition {
    const routes = InitialDataUtil.getRoutes(dataset).filter((r: RouteDefinition) => r.key === key);

    if (!routes.length) {
      throw new Error(`route_not_defined:${key}`);
    }

    return _.first(routes);
  }

  static getAchievementById(id: string): AchievementDefinition {
    const achievements = initialData.achievements.filter((i: AchievementDefinition) => i.id === id);
    let achievement: AchievementDefinition = _.first(achievements);

    if (!achievement) {
      throw new Error(`achievement_not_defined`);
    }

    return achievement;
  }

  static getAchievements(): Array<AchievementDefinition> {
    return initialData.achievements;
  }

  static getTaskById(id: string): TaskDefinition {
    const tasks = initialData.onboardingTasks.filter((i: TaskDefinition) => i.id === id);
    let task: TaskDefinition = _.first(tasks);

    // If onboarding task is not found, look for a route task
    if (id.indexOf(ONBOARDING_PREFIX) == -1 && !task) {
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

  static getReward(id: string, dataset: string): RewardDefinition {
    const rewards = initialData.rewards.filter((r: RewardDefinition) => r.id === id && r.dataSet === dataset);

    let reward: RewardDefinition = _.first(rewards);

    if (!reward) {
      throw new Error(`reward_not_defined:${id}:${dataset}`);
    }

    return reward;
  }
}

export default InitialDataUtil;
