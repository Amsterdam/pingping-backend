import { Document, Schema, model } from "mongoose";

type VendorDocument = {
  name: string
}

export type RewardDocument = Document & {
  title: string,
  description: string,
  cost: number,
  vendor: VendorDocument
  // @todo: There are some other fields in the original PingPing, but we should see if they are necessary
}

const rewardSchema = new Schema(
  {
    title: String,
    description: String,
    const: Number,
    vendr: {
      name: String
    }
  },
  { timestamps: true }
);

export const Reward = model<RewardDocument>("Reward", rewardSchema);
