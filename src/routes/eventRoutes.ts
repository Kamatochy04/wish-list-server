import { Router } from 'express';
import * as eventController from '../controllers/eventController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, eventController.createEvent);
router.put('/:id', authenticate, eventController.updateEvent);
router.get('/', authenticate, eventController.getUserEvents);
router.get('/:id', authenticate, eventController.getEventById);
router.delete('/:id', authenticate, eventController.deleteEvent);

export default router;
