import { Document, Schema, model } from 'mongoose';

export type RouteFeedbackDocument = Document & {
  routeId?: string;
  rating: number;
  feedback: string;
  userId: string;
};

const schema = new Schema(
  {
    routeId: String,
    rating: Number,
    feedback: String,
    userId: String,
  },
  { timestamps: true }
);

export const RouteFeedback = model<RouteFeedbackDocument>('RouteFeedback', schema);
