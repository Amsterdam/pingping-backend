import { Document, Schema, model, Types } from 'mongoose';

export type RewardVoucherDocument = Document & {
  rewardId: string;
  userId: string;
  data: any;
};

const schema = new Schema(
  {
    rewardId: String,
    userId: String,
    data: Object,
  },
  { timestamps: true }
);

export const RewardVoucher = model<RewardVoucherDocument>('RewardVoucher', schema);
