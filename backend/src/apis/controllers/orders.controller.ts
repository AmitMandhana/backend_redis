import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/interfaces";
import { error, success } from "../../utils/response";
import { getAllOrdersService } from "../services/orders.service";

export async function getAllOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { user } = req;
        if (!user) {
            res.status(401).json(error("User not authenticated.", 401));
            return;
        }
        const orders = await getAllOrdersService(user.id);
        if (!orders) {
            res.status(404).json(error("No orders found.", 404));
            return;
        }
        res.status(200).json(success({
            message: "Orders fetched successfully",
            orders: orders
        }, 200));
    } catch (err) {
        console.error('Error in getAllOrders:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}