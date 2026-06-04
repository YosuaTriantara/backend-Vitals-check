import express from 'express';
import { getModelStatus } from '../controllers/model.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// GET /api/model/status - cek apakah AI model sudah siap (handle cold start)
router.get('/status', getModelStatus);

export default router;
