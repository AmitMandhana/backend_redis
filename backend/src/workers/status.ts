import { kafka, topics } from '../utils/kafka';

export async function startStatusWorker() {
  try {
    const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'amit-crm-status' });
    await consumer.connect();
    await consumer.subscribe({ topic: topics.campaignsStatus });

    console.log('📊 AMIT CRM Status Worker started');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const statusUpdate = JSON.parse(message.value!.toString());
        console.log(`📈 Status update for campaign ${statusUpdate.campaignId}:`, {
          status: statusUpdate.status,
          delivered: statusUpdate.deliveredCount,
          failed: statusUpdate.failedCount,
          total: statusUpdate.totalCount,
          batch: `${statusUpdate.batchNumber}/${statusUpdate.totalBatches}`
        });

        // Here you could broadcast to WebSocket clients or update a real-time dashboard
        // For now, we'll just log the status updates
        
      } catch (error) {
        console.error('❌ Error in status worker:', error);
      }
    },
  });
  } catch (error) {
    console.error('❌ Error starting status worker:', error);
    // Retry after 5 seconds
    setTimeout(() => startStatusWorker(), 5000);
  }
}
