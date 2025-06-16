import { Router } from "express";
import * as giftController from "../controllers/giftController";
import * as giftReservationController from "../controllers/giftReservationController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, giftController.createGift);
router.put("/:id", authenticate, giftController.updateGift);
router.delete("/:id", authenticate, giftController.deleteGift);
router.post("/:id/reserve", giftReservationController.reserveGift);

export default router;
