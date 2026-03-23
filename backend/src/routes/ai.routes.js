import express from 'express';
import { generateSustainableUserStory } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate-user-story', generateSustainableUserStory);

export default router;
