import { Document } from 'mongoose';

export type UserTransaction = Document & {
  title: string;
  amount: number;
  balance: number;
  reference: string;
};
