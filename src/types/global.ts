import { MediaType, RewardType, TaskType } from '@models';

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
};

export type TaskDefinition = {
  id: string;
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
  nextRouteId?: string | object;
};

export type RewardDefinition = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  dataSet: string;
  cover: MediaType;
  vendor: string;
  active: boolean;
  type: RewardType;
  price: number;
  availablePerUser: number;
  available: number;
};

export type RouteDefinition = {
  id?: string;
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
