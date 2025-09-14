import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/interfaces";
import { error, success } from "../../utils/response";
import { createSegmentRuleService, getAllSegmentRulesService } from "../services/segmentRules.service";

export async function createSegmentRule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const {user} = req;
        const { logicType, conditions} = req.body;

        const newSegmentRule = await createSegmentRuleService(user!.id, logicType, conditions);

        if (!newSegmentRule) {
            res.status(500).json(success({
                message: "Error creating segment rule",
            }, 500));
            return;
        }
        
        res.status(200).json(success({
            message: "Segment rule created successfully",
        }, 200));
    } catch (err) {
        console.error('Error in createSegmentRule:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}

export async function getAllSegmentRules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const {user} = req;
        const segmentRules = await getAllSegmentRulesService(user!.id);
        if (!segmentRules || segmentRules.length === 0) {
            res.status(404).json(error("No segment rules found", 404));
            return;
        }
        if (!segmentRules) {
            res.status(500).json(success({
                message: "Error fetching segment rules",
            }, 500));
            return;
        }
        
        res.status(200).json(success({
            message: "Segment rules fetched successfully",
            segmentRules: segmentRules
        }, 200));
    } catch (err) {
        console.error('Error in getAllSegmentRules:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}