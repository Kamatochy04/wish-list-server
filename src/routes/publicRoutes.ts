import { Router } from "express";
import * as publicContentController from "../controllers/publicContentController";
import * as giftReservationController from "../controllers/giftReservationController";

const router = Router();

router.get("/gifts", publicContentController.getPublicGiftsForSlideshow);
router.post(
  "/gifts/reserve/confirm",
  giftReservationController.confirmReservation
);

export default router;
