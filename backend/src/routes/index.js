import express from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import userStoryRoutes from './userStory.routes.js';
import useCaseRoutes from './useCase.routes.js';
import aiRoutes from './ai.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/user-stories', userStoryRoutes);
router.use('/use-cases', useCaseRoutes);
router.use('/ai', aiRoutes);

export default router;
