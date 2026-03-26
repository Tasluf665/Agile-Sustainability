import express from 'express';
import {
  getUseCases,
  getUseCase,
  createUseCase,
  updateUseCase,
  deleteUseCase,
  applySustainableUseCase,
  acceptSustainableUseCase,
  rejectSustainableUseCase
} from '../controllers/useCase.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getUseCases)
  .post(createUseCase);

router
  .route('/:id')
  .get(getUseCase)
  .put(updateUseCase)
  .delete(deleteUseCase);

router.post('/:id/sustainable', applySustainableUseCase);
router.patch('/:id/accept', acceptSustainableUseCase);
router.patch('/:id/reject', rejectSustainableUseCase);

export default router;
