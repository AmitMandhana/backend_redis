import express from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import { createSegmentRule, getAllSegmentRules } from '../controllers/segmentRules.controller';

const router = express.Router();

router.route("/create").post(
    isAuthenticated,
    createSegmentRule
)

router.route("/getAllSegmentRules").get(
    isAuthenticated,
    getAllSegmentRules
)

export default router;