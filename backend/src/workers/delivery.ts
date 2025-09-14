import Campaign from '../models/Campaign';
import Customer from '../models/Customer';
import DeliveryLog from '../models/DeliveryLog';
import { kafka, topics } from '../utils/kafka';
import { createTransport } from '../utils/mailer';

export async function startDeliveryWorker() {
  try {
    const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'amit-crm-delivery' });
    await consumer.connect();
    await consumer.subscribe({ topic: topics.campaignsDelivery });
    const transporter = createTransport();

    console.log('🚀 AMIT CRM Delivery Worker started');

  await consumer.run({
    eachMessage: async ({ message }: { message: { value: Buffer | null } }) => {
      try {
        const payload = JSON.parse(message.value!.toString()) as { 
          campaignId: string; 
          customerIds: string[];
          batchNumber: number;
          totalBatches: number;
        };
        
        console.log(`📧 Processing delivery batch ${payload.batchNumber}/${payload.totalBatches} for campaign ${payload.campaignId}`);
        
        const campaign = await Campaign.findById(payload.campaignId);
        if (!campaign) {
          console.error(`❌ Campaign ${payload.campaignId} not found`);
          return;
        }

        // Update campaign status to sending if this is the first batch
        if (campaign.status === 'processing' && payload.batchNumber === 1) {
          campaign.status = 'sending';
          await campaign.save();
          console.log(`📤 Campaign ${campaign.name} status updated to sending`);
        }

        let batchDelivered = 0;
        let batchFailed = 0;

        // Process each customer in the batch
        for (const customerId of payload.customerIds) {
          const customer = await Customer.findById(customerId);
          if (!customer) {
            console.warn(`⚠️ Customer ${customerId} not found`);
            continue;
          }

          // Check if delivery log already exists (prevent duplicates)
          const existingLog = await DeliveryLog.findOne({
            campaignId: campaign._id,
            customerId: customer._id
          });

          if (existingLog) {
            console.log(`⏭️ Delivery already processed for customer ${customer.email}`);
            continue;
          }

          try {
            // Simulate email sending (replace with actual email service)
            const info = await transporter.sendMail({
              from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@amitcrm.com',
              to: customer.email,
              subject: campaign.intent || `AMIT CRM: ${campaign.name}`,
              text: campaign.message,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #2563eb;">AMIT CRM Management</h2>
                  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    ${campaign.message.replace(/\n/g, '<br>')}
                  </div>
                  <p style="color: #64748b; font-size: 12px;">
                    This message was sent via AMIT CRM Management System
                  </p>
                </div>
              `
            });

            await DeliveryLog.create({
              campaignId: campaign._id,
              customerId: customer._id,
              status: 'sent',
              sentAt: new Date(),
              messageId: info.messageId,
              lastTriedAt: new Date(),
              tryCount: 1,
            });

            batchDelivered++;
            console.log(`✅ Message sent to ${customer.email}`);

          } catch (e: any) {
            console.error(`❌ Failed to send to ${customer.email}:`, e.message);
            
            await DeliveryLog.create({
              campaignId: campaign._id,
              customerId: customer._id,
              status: 'failed',
              errorMessage: e.message,
              lastTriedAt: new Date(),
              tryCount: 1,
            });

            batchFailed++;
          }
        }

        // Update campaign statistics
        const totalDelivered = await DeliveryLog.countDocuments({ 
          campaignId: campaign._id, 
          status: 'sent' 
        });
        const totalFailed = await DeliveryLog.countDocuments({ 
          campaignId: campaign._id, 
          status: 'failed' 
        });

        campaign.deliveredCount = totalDelivered;
        campaign.failedCount = totalFailed;

        // Check if all batches are complete
        if ((totalDelivered + totalFailed) >= (campaign.totalCount || 0)) {
          campaign.sentAt = new Date();
          campaign.status = totalFailed > 0 ? 'partial_failed' : 'sent';
          console.log(`🎉 Campaign ${campaign.name} completed: ${totalDelivered} sent, ${totalFailed} failed`);
        }

        await campaign.save();

        // Send status update to Kafka
        const producer = kafka.producer();
        await producer.connect();
        await producer.send({
          topic: topics.campaignsStatus,
          messages: [{
            key: campaign.id,
            value: JSON.stringify({
              campaignId: campaign.id,
              status: campaign.status,
              deliveredCount: totalDelivered,
              failedCount: totalFailed,
              totalCount: campaign.totalCount,
              batchNumber: payload.batchNumber,
              totalBatches: payload.totalBatches,
              timestamp: new Date().toISOString()
            })
          }]
        });
        await producer.disconnect();

        console.log(`📊 Batch ${payload.batchNumber}/${payload.totalBatches} completed: ${batchDelivered} sent, ${batchFailed} failed`);

      } catch (error) {
        console.error('❌ Error in delivery worker:', error);
      }
    },
  });
  } catch (error) {
    console.error('❌ Error starting delivery worker:', error);
    // Retry after 5 seconds
    setTimeout(() => startDeliveryWorker(), 5000);
  }
}