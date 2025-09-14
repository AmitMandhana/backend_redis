import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/interfaces";
import { error, success } from "../../utils/response";
import { createCampaignService, queueCampaignService, getCampaignStatusService } from "../services/campaign.service";

export async function createCampaign(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { name, ruleId, customerIds, message, intent} = req.body;
        const {user} = req;
        
        if(!name || !ruleId || !customerIds || !message ){
            res.status(400).json(error("Please provide all required fields", 400));
            return;
        }

        const newCampaign = await createCampaignService(user!.id, name, ruleId, customerIds, message, intent);
        if (!newCampaign) {
            res.status(500).json(error("Error creating campaign", 500));
            return;
        }

        console.log(name, ruleId, customerIds, message, intent);

        res.status(200).json(success({
            message: "Campaign created successfully",
            campaign: newCampaign
        }, 200));
    } catch (err) {
        console.error('Error in createCampaign:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}

export async function queueCampaign(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params as any;
        const { user } = req;
        const updated = await queueCampaignService(user!.id, id);
        if (!updated) {
            res.status(400).json(error("Unable to queue campaign", 400));
            return;
        }
        res.status(200).json(success({ message: 'Campaign queued', campaign: updated }, 200));
    } catch (err) {
        console.error('Error in queueCampaign:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}

export async function getCampaignStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params as any;
        const { user } = req;
        const status = await getCampaignStatusService(user!.id, id);
        if (!status) {
            res.status(404).json(error("Campaign not found", 404));
            return;
        }
        res.status(200).json(success(status, 200));
    } catch (err) {
        console.error('Error in getCampaignStatus:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}