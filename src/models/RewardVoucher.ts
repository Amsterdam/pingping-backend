import { Document, Schema, model, Types } from 'mongoose';

export type RewardVoucherDocument = Document & {
  rewardId: string;
  userId: string;
  deviceId: string;
  validUntil?: Date;
  data: any;
};

const schema = new Schema(
  {
    rewardId: String,
    userId: String,
    deviceId: String,
    validUntil: Date,
    data: Object,
  },
  { timestamps: true }
);

export const RewardVoucher = model<RewardVoucherDocument>('RewardVoucher', schema);
