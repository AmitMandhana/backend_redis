import Campaign from '../../models/Campaign';
import DeliveryLog from '../../models/DeliveryLog';

export async function getCampaignStatusService(userId: string, campaignId: string) {
    try {
        const campaign = await Campaign.findOne({ _id: campaignId, userId });
        if (!campaign) {
            return null;
        }

        // Get delivery statistics
        const deliveryStats = await DeliveryLog.aggregate([
            { $match: { campaignId: campaign._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = {
            sent: 0,
            failed: 0,
            queued: 0
        };

        deliveryStats.forEach(stat => {
            stats[stat._id as keyof typeof stats] = stat.count;
        });

        return {
            campaign,
            stats,
            totalProcessed: stats.sent + stats.failed,
            successRate: stats.sent + stats.failed > 0 ? (stats.sent / (stats.sent + stats.failed)) * 100 : 0
        };
    } catch (error) {
        console.error('Error getting campaign status:', error);
        return null;
    }
}

export async function getAllCampaignsStatusService(userId: string) {
    try {
        const campaigns = await Campaign.find({ userId }).sort({ createdAt: -1 });
        
        const campaignsWithStats = await Promise.all(
            campaigns.map(async (campaign) => {
                const deliveryStats = await DeliveryLog.aggregate([
                    { $match: { campaignId: campaign._id } },
                    {
                        $group: {
                            _id: '$status',
                            count: { $sum: 1 }
                        }
                    }
                ]);

                const stats = {
                    sent: 0,
                    failed: 0,
                    queued: 0
                };

                deliveryStats.forEach(stat => {
                    stats[stat._id as keyof typeof stats] = stat.count;
                });

                return {
                    ...campaign.toObject(),
                    stats,
                    totalProcessed: stats.sent + stats.failed,
                    successRate: stats.sent + stats.failed > 0 ? (stats.sent / (stats.sent + stats.failed)) * 100 : 0
                };
            })
        );

        return campaignsWithStats;
    } catch (error) {
        console.error('Error getting all campaigns status:', error);
        return [];
    }
}
