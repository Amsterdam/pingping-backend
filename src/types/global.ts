import { TaskType } from "@models"

export type AchivementDefinition = {
  id: string,
  title: string,
  description: string,
  points: number,
  icon: string
}

export type TaskDefinition = {
  id: string
  routeTaskId?: string
  type: TaskType
  title: string
  description: string
  icon: string
  media?: string
  choices?: object,
  initial?: boolean
  nextTaskId?: string|object
  nextRouteId?: string
}

export type RewardDefinition = {
  id: string
  title: string
  description: string
  imageUrl: string
  vendor: string
  price: number
  availablePerUser: number
  available: number
}

export type RouteDefinition = {
  id?: string,
  title: string
  tasks: Array<TaskDefinition>
}
