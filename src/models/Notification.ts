import { NotificationDeliveryStatus, NotificationType } from '@models';
import { Document, Schema, model, Types } from 'mongoose';

export type Notification = Document & {
  user: string;
  type: NotificationType;
  status: NotificationDeliveryStatus;
  payload: object;
};

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    type: String,
    status: String,
    payload: Object,
  },
  { timestamps: true }
);

export const NotificationModel = model<Notification>('Notification', schema);
