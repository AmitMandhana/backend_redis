import Campaign from '../models/Campaign';
import { kafka, topics } from '../utils/kafka';

export async function startDispatcher() {
  try {
    const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'amit-crm-dispatcher' });
    await consumer.connect();
    await consumer.subscribe({ topic: topics.campaignsDispatch });
    console.log('📦 AMIT CRM Dispatcher Worker started');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value!.toString());
      const campaign = await Campaign.findById(payload.campaignId);
      if (!campaign) return;

      // TTL check
      if (campaign.queuedAt && campaign.ttlMs && Date.now() - campaign.queuedAt.getTime() > campaign.ttlMs) {
        campaign.status = 'failed';
        campaign.failReason = 'TTL_EXPIRED';
        await campaign.save();
        return;
      }

      // Transition to processing
      if (campaign.status === 'queued') {
        campaign.status = 'processing';
        campaign.processingStartedAt = new Date();
        await campaign.save();
      }

      const producer = kafka.producer();
      await producer.connect();

      const ids = campaign.customerIds || [];
      const batchSize = campaign.batchSize || 100;
      const totalBatches = Math.ceil(ids.length / batchSize);
      
      console.log(`📦 Dispatching campaign ${campaign.name} in ${totalBatches} batches of ${batchSize} customers each`);
      
      for (let i = 0; i < ids.length; i += batchSize) {
        const slice = ids.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        
        await producer.send({
          topic: topics.campaignsDelivery,
          messages: [{ 
            key: campaign.id, 
            value: JSON.stringify({ 
              campaignId: campaign.id, 
              customerIds: slice,
              batchNumber,
              totalBatches
            }) 
          }],
        });
        
        console.log(`📤 Sent batch ${batchNumber}/${totalBatches} to delivery queue`);
      }

      await producer.disconnect();
    },
  });
  } catch (error) {
    console.error('❌ Error starting dispatcher worker:', error);
    // Retry after 5 seconds
    setTimeout(() => startDispatcher(), 5000);
  }
}


