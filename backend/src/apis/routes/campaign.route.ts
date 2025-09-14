import express from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import { createCampaign, queueCampaign, getCampaignStatus } from '../controllers/campaign.controller';

const router = express.Router();

router.route("/create").post(
    isAuthenticated,
    createCampaign
)

router.route('/queue/:id').post(
    isAuthenticated,
    queueCampaign
)

router.route('/status/:id').get(
    isAuthenticated,
    getCampaignStatus
)

export default router;