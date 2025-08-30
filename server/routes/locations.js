import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { createLocation, getMyHistory, getUserHistory } from "../controllers/locationController.js";

const router = express.Router();

 
router.post('/', requireAuth, createLocation);

 
router.get('/me/history', requireAuth, getMyHistory);

 
router.get('/:userId/history', getUserHistory);

export default router;
