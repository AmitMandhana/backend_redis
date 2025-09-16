import Campaign from "../../models/Campaign";
import DeliveryLog from "../../models/DeliveryLog";
import { kafka, topics } from "../../utils/kafka";
import redis from "../../utils/redis";


export async function createCampaignService( 
    userId: string,
    name: string,
    ruleId: string,
    customerIds: string[],
    message: string,
    intent?: string
) 
{
  try {
    const newCampaign = await Campaign.create({
        userId,
        name,
        ruleId,
        customerIds,
        message,
        intent,
    });
    // Publish event to Redis for campaign creation
    await redis.publish('campaign:created', JSON.stringify(newCampaign));
    console.log('Published campaign:created event to Redis Pub/Sub for new campaign creation.');
    return newCampaign;
  } catch (error) {
    console.error("Error creating campaign:", error);
    return null;
  }

}
export async function queueCampaignService(userId: string, campaignId: string){
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if(!campaign) return null;
    if(campaign.status !== 'draft') return campaign; // idempotent
    campaign.status = 'queued';
    campaign.queuedAt = new Date();
    campaign.totalCount = campaign.customerIds?.length || 0;
    await campaign.save();

    const producer = kafka.producer();
    await producer.connect();
    await producer.send({ topic: topics.campaignsDispatch, messages: [{ key: campaign.id, value: JSON.stringify({ campaignId: campaign.id }) }] });
    await producer.disconnect();
  // Publish event to Redis for campaign queued
  await redis.publish('campaign:queued', JSON.stringify(campaign));
  console.log('Published campaign:queued event to Redis Pub/Sub for campaign queueing.');
    return campaign;
}

export async function getCampaignStatusService(userId: string, campaignId: string){
    const campaign = await Campaign.findOne({ _id: campaignId, userId }, { __v: 0 });
    if(!campaign) return null;
    const deliveredCount = await DeliveryLog.countDocuments({ campaignId, status: 'sent' });
    const failedCount = await DeliveryLog.countDocuments({ campaignId, status: 'failed' });
    return {
        status: campaign.status,
        queuedAt: campaign.queuedAt,
        processingStartedAt: campaign.processingStartedAt,
        sentAt: campaign.sentAt,
        totalCount: campaign.totalCount,
        deliveredCount,
        failedCount,
    };
}