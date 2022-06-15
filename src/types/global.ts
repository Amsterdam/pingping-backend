import { MediaType, RewardType, TaskType } from '@models';

export type Definition = {
  id: string;
  dataSet: string;
};

export type AchievementDefinition = Definition & {
  title: string;
  description: string;
  points: number;
  icon: string;
};

export type TaskDefinition = Definition & {
  routeTaskId?: string;
  type: TaskType;
  disabled: boolean;
  headerTitle: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  progress: number;
  media?: MediaType;
  defaultValue: string;
  choices?: object;
  initial?: boolean;
  meta?: any;
  nextTaskId?: string | object;
  nextRoute?: string | object;
};

export type RewardDefinition = Definition & {
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  cover: MediaType;
  vendor: string;
  active: boolean;
  type: RewardType;
  price: number;
  availablePerUser: number;
  available: number;
};

export type RouteDefinition = Definition & {
  key: string;
  title: string;
  description?: string;
  isSuggested: boolean;
  imageUrl?: string;
  cover: MediaType;
  thumbnailUrl?: string;
  tasks: Array<TaskDefinition>;
  tips: Array<RouteTipsDefinition>;
  targetAudience: string;
};

export type RouteTipsDefinition = {
  title: string;
  description: string;
};
