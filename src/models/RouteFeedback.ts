import { Document, Schema, model, Types } from 'mongoose';

export type RouteFeedbackDocument = Document & {
  routeId?: string;
  routeName?: string;
  taskName?: string;
  feedback: string;
  userId: string;
};

const schema = new Schema(
  {
    routeId: String,
    taskName: String,
    routeName: String,
    feedback: String,
    userId: String,
  },
  { timestamps: true }
);

export const RouteFeedback = model<RouteFeedbackDocument>('RouteFeedback', schema);
