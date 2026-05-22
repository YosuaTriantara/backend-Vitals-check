import express from 'express';
import {
  createScreening,
  getScreenings,
  getScreening,
  deleteScreening,
} from '../controllers/screening.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createScreeningSchema } from '../validators/screening.schema.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createScreeningSchema), createScreening);
router.get('/', getScreenings);
router.get('/:id', getScreening);
router.delete('/:id', deleteScreening);

export default router;