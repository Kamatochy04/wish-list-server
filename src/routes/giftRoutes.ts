import { Router } from 'express';
import * as giftController from '../controllers/giftController';
import * as giftReservationController from '../controllers/giftReservationController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticate, giftController.createGift);
router.put('/:id', authenticate, giftController.updateGift);
router.delete('/:id', authenticate, giftController.deleteGift);
router.post(
  '/:id/reserve',
  authenticate,
  giftReservationController.reserveGift
);
router.post('/:id/like', authenticate, giftController.addLike);
router.delete('/:id/like', authenticate, giftController.removeLike);
router.get('/all', authenticate, giftController.getAllGifts);
router.get('/user', authenticate, giftController.getUserGifts);
router.get('/popular', giftController.getPopularGifts);

export default router;
