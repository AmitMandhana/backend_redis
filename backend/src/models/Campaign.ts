import { Schema, model } from 'mongoose';
import { ICampaign } from '../interfaces/interfaces';

const CampaignSchema = new Schema<ICampaign>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  intent: { type: String },
  ruleId: { type: Schema.Types.ObjectId, ref: 'SegmentRule', required: true },
  customerIds: [{ type: Schema.Types.ObjectId, ref: 'Customer' }], 
  status: { type: String, enum: ['draft','queued','processing','sending','sent','partial_failed','failed'], default: 'draft' },
  queuedAt: Date,
  processingStartedAt: Date,
  sentAt: Date,
  ttlMs: { type: Number, default: 3600000 },
  failReason: String,
  batchSize: { type: Number, default: 100 },
  totalCount: { type: Number, default: 0 },
  deliveredCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
}, { timestamps: true });

export default model<ICampaign>('Campaign', CampaignSchema);
