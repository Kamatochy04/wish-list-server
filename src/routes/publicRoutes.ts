import { Router } from 'express';
import * as publicContentController from '../controllers/publicContentController';
import * as giftReservationController from '../controllers/giftReservationController';
import * as giftController from '../controllers/giftController';
const router = Router();

router.get('/gifts', publicContentController.getPublicGiftsForSlideshow);
router.post(
  '/gifts/reserve/confirm',
  giftReservationController.confirmReservation
);
router.get('/random-gifts', giftController.getRandomGifts);

export default router;
