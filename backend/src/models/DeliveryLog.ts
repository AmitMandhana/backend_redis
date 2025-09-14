import { Schema, model } from 'mongoose';
import { IDeliveryLog } from '../interfaces/interfaces';

const DeliveryLogSchema = new Schema<IDeliveryLog>({
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: ['queued','sent','failed'], required: true },
  errorMessage: String,
  sentAt: { type: Date },
  tryCount: { type: Number, default: 0 },
  messageId: String,
  lastTriedAt: Date,
});

export default model<IDeliveryLog>('DeliveryLog', DeliveryLogSchema);
