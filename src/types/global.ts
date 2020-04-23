import { TaskType } from "../generated/graphql"

// export type UserTask = {
//   id: string
//   type: TaskType
//   status: TaskStatus
//   title: string
//   description: string
//   icon: string
//   answer: any
// }

// export type NullableUserTask = UserTask | null

export type TaskDefinition = {
  id: string
  routeTask?: string
  type: TaskType
  title: string
  description: string
  icon: string
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