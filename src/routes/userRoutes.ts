import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/me', authenticate, userController.getCurrentUser);
router.get('/settings', authenticate, userController.getUserSettings);
router.put('/settings', authenticate, userController.updateUserSettings);

export default router;
