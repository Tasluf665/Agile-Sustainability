import express from 'express';
import {
  getUserStories,
  getUserStory,
  createUserStory,
  updateUserStory,
  deleteUserStory,
  applySustainableUserStory
} from '../controllers/userStory.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getUserStories)
  .post(createUserStory);

router
  .route('/:id')
  .get(getUserStory)
  .put(updateUserStory)
  .delete(deleteUserStory);

router.post('/:id/sustainable', applySustainableUserStory);

export default router;
