import { Router } from 'express';
import { getCampaignStatus, getAllCampaignsStatus } from '../controllers/status.controller';
import { isAuthenticated } from '../../middlewares/auth.middleware';

const router = Router();

// Get status of a specific campaign
router.get('/campaign/:campaignId', isAuthenticated, getCampaignStatus);

// Get status of all campaigns for the user
router.get('/campaigns', isAuthenticated, getAllCampaignsStatus);

export default router;
