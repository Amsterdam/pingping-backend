import { Document, Schema, model } from 'mongoose';

// Model used to write down statistics values per day for a specific key.
export type Statistic = Document & {
  type: string;
  key: string;
  value: string;
};

const schema = new Schema(
  {
    type: String,
    key: String,
    value: String,
  },
  { timestamps: false, _id: false }
);

export const StatisticModel = model<Statistic>('Statistic', schema);
