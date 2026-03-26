import express from 'express';
import { generateSustainableUserStory, generateSustainableUseCase, updateAISuggestion } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate-user-story', generateSustainableUserStory);
router.post('/generate-use-case', generateSustainableUseCase);
router.put('/suggestions/:id', updateAISuggestion);

export default router;
