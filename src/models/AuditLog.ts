import { Document, Schema, model, Types } from 'mongoose';

export type AuditLogDocument = Document & {
  user: string;
  type: string;
  description: string;
  linkId?: string;
};

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    type: String,
    description: String,
    linkId: String,
  },
  { timestamps: true }
);

export const AuditLog = model<AuditLogDocument>('AuditLog', schema);
