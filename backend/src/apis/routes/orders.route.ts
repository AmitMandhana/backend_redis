import express from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import { getAllOrders } from '../controllers/orders.controller';

const router = express.Router();
router.route("/getAllOrders").get(
    isAuthenticated,
    getAllOrders
)
export default router;