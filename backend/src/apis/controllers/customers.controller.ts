import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/interfaces";
import { error, success } from "../../utils/response";
import { createOrUpdateCustomerService, getAllCustomersService } from "../services/customers.service";

export async function getAllCustomers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { user } = req;
        if (!user || !user.id) {
            res.status(401).json(error("User not authenticated.", 401));
            return;
        }
        const customers = await getAllCustomersService(user.id);
        res.status(200).json(success({
            message: "Customers fetched successfully",
            customers: customers
        }, 200));
    } catch (err) {
        console.error('Error in getAllCustomers:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}

export async function createOrUpdateCustomer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { user } = req;
        if (!user || !user.id) {
            res.status(401).json(error("User not authenticated.", 401));
            return;
        }
        const { name, email, phone, location, externalId } = req.body || {};
        if (!name || !email) {
            res.status(422).json(error("name and email are required", 422));
            return;
        }
        const customer = await createOrUpdateCustomerService(user.id, { name, email, phone, location, externalId });
        res.status(201).json(success({
            message: "Customer saved successfully",
            customer
        }, 201));
    } catch (err) {
        console.error('Error in createOrUpdateCustomer:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}