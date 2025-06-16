import { Router } from "express";
import * as eventController from "../controllers/eventController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, eventController.createEvent);
router.delete("/:id", authenticate, eventController.deleteEvent);
router.put("/:id", authenticate, eventController.updateEvent);
router.get("/", authenticate, eventController.getUserEvents);
// router.post("/:id/share", authenticate, eventController.shareEvent);
router.get("/public/:shortId", eventController.getPublicEvent);

export default router;
