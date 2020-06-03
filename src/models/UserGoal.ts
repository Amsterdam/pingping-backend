import { Document } from 'mongoose';

export type UserGoal = Document & {
  title: string
  description: string
  amount: number,
}

// export const toResponse = (goal:UserGoal):UserGoalResponse => {
//   return {
//     goalId: goal._id,
//     title: goal.title,
//     description: goal.description,
//     amount: goal.amount
//   }
// }