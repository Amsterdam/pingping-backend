import { Document, Schema, model, Types } from 'mongoose';

export type AuditLogDocument = Document & {
  user: string;
  type: string;
  dataSet: string;
  description: string;
  linkId?: string;
};

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    type: String,
    dataSet: String,
    description: String,
    linkId: String,
  },
  { timestamps: true }
);

export const AuditLog = model<AuditLogDocument>('AuditLog', schema);
