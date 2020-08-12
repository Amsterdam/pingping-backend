import { TaskType } from '@models';

export type AchivementDefinition = {
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
  headerTitle: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  media?: string;
  choices?: object;
  initial?: boolean;
  nextTaskId?: string | object;
  nextRouteId?: string;
};

export type RewardDefinition = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  vendor: string;
  price: number;
  availablePerUser: number;
  available: number;
};

export type RouteDefinition = {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  tasks: Array<TaskDefinition>;
  tips: Array<RouteTipsDefinition>;
  targetAudience: string;
};

export type RouteTipsDefinition = {
  title: string;
  description: string;
};
