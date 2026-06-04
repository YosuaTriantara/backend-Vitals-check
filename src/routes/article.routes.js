import express from 'express';
import { getArticles } from '../controllers/article.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getArticles);

export default router;
