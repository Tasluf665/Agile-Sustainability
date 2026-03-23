import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(getProjects)
  .post(createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

export default router;
