import { Document } from 'mongoose';

export type UserGoal = Document & {
  title: string;
  description: string;
  amount: number;
};
