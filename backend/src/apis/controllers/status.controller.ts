import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../interfaces/interfaces';
import { getCampaignStatusService, getAllCampaignsStatusService } from '../services/status.service';
import { success, error } from '../../utils/response';

export async function getCampaignStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { campaignId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json(error('Unauthorized', 401));
            return;
        }

        const result = await getCampaignStatusService(userId, campaignId);
        if (!result) {
            res.status(404).json(error('Campaign not found', 404));
            return;
        }

    res.status(200).json(success(result, 200));
    } catch (err) {
        console.error('Error in getCampaignStatus:', err);
        res.status(500).json(error('Internal server error', 500));
    }
}

export async function getAllCampaignsStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json(error('Unauthorized', 401));
            return;
        }

        const campaigns = await getAllCampaignsStatusService(userId);
    res.status(200).json(success({ campaigns }, 200));
    } catch (err) {
        console.error('Error in getAllCampaignsStatus:', err);
        res.status(500).json(error('Internal server error', 500));
    }
}
