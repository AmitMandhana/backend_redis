import { Router } from 'express';
import { body } from 'express-validator';
import { checkError } from '../../utils/response';
import { createUser, getUserByEmail } from '../controllers/user.controller';

const router = Router();

router.route('/create')
.post(
  [
    body('token').isString().notEmpty().withMessage('token is required'),
  ],
  checkError,
  createUser
  )


router.route("/getUserByEmail").get(
  getUserByEmail
)

export default router;
