import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as passwordResetController from '../controllers/passwordResetController';

const router = Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgot-password', passwordResetController.requestPasswordReset);
router.post('/verify-code', passwordResetController.verifyResetCode);
router.post('/reset-password', passwordResetController.resetPassword);
export default router;
