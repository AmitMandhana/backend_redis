import express from 'express';
import { isAuthenticated } from '../../middlewares/auth.middleware';
import { checkError } from '../../utils/response';
import { createOrUpdateCustomer, getAllCustomers } from '../controllers/customers.controller';
import { body } from 'express-validator';

const router = express.Router();

router.route("/getAllCustomers").get(
    isAuthenticated,
    getAllCustomers
)

router.route('/createOrUpdate').post(
  isAuthenticated,
  [
    body('name').isString().notEmpty(),
    body('email').isEmail().notEmpty(),
    body('phone').optional().isString(),
    body('location').optional().isString(),
    body('externalId').optional().isString(),
  ],
  checkError,
  createOrUpdateCustomer
)

export default router;