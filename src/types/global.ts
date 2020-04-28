import { TaskType } from "../generated/graphql"

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
  initial?: boolean
  nextTaskId?: string
  nextRouteId?: string
}

export type RouteDefinition = {
  title: string
  tasks: Array<TaskDefinition>
}

// export type RouteStep = {
//   name: string
// }

// export type OnBoardingStep = {
//   name: string
// }

// export enum Locale {
//   nl_NL = 'nl_NL'
// }

// export enum TaskType {
//   DateOfBirth,
//   YesNoQuestion
// }

// export enum TaskStatus {
//   PendingUser = 'PendingUser',
//   Completed = 'Completed'
// }