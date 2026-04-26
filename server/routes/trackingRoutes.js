import { Router } from "express";
import { getTrackingByProblemId } from "../controllers/trackingController.js";

const router = Router();

router.get('/:problemId', getTrackingByProblemId);

export default router;