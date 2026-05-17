import Project from '../models/Project.model.js';
import ProjectMember from '../models/ProjectMember.model.js';
import UserStory from '../models/UserStory.model.js';
import UseCase from '../models/UseCase.model.js';

// @desc    Get all projects for the current user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    // Find all project memberships for this user
    const memberships = await ProjectMember.find({ userId: req.user._id }).populate('projectId');
    
    let projects = memberships
      .filter(m => m.projectId !== null)
      .map(m => ({
        ...m.projectId._doc,
        userRole: m.role
      }));

    // Fetch counts for User Stories and Use Cases
    projects = await Promise.all(projects.map(async (p) => {
      const userStoriesCount = await UserStory.countDocuments({ projectId: p._id });
      const useCasesCount = await UseCase.countDocuments({ projectId: p._id });
      return {
        ...p,
        userStoriesCount,
        useCasesCount
      };
    }));

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is a member of this project
    const membership = await ProjectMember.findOne({
      projectId: req.params.id,
      userId: req.user._id
    });

    if (!membership && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
    }

    const userStoriesCount = await UserStory.countDocuments({ projectId: project._id });
    const useCasesCount = await UseCase.countDocuments({ projectId: project._id });

    res.status(200).json({
      success: true,
      data: {
        ...project._doc,
        userRole: membership ? membership.role : 'admin',
        userStoriesCount,
        useCasesCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { name, industry, description, sustainabilityGoals, focusAreas } = req.body;

    const project = await Project.create({
      name,
      industry,
      description,
      sustainabilityGoals,
      focusAreas,
      createdBy: req.user._id
    });

    // Automatically add creator as Product Owner in ProjectMember
    await ProjectMember.create({
      projectId: project._id,
      userId: req.user._id,
      role: 'product_owner'
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check membership and role
    const membership = await ProjectMember.findOne({
      projectId: req.params.id,
      userId: req.user._id
    });

    if ((!membership || membership.role !== 'product_owner') && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only Product Owners or Admins can update project details' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    const userStoriesCount = await UserStory.countDocuments({ projectId: project._id });
    const useCasesCount = await UseCase.countDocuments({ projectId: project._id });

    res.status(200).json({
      success: true,
      data: {
        ...project._doc,
        userStoriesCount,
        useCasesCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check membership and role
    const membership = await ProjectMember.findOne({
      projectId: req.params.id,
      userId: req.user._id
    });

    if ((!membership || membership.role !== 'product_owner') && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only Product Owners or Admins can delete projects' });
    }

    await project.deleteOne();
    
    // Also delete all memberships for this project
    await ProjectMember.deleteMany({ projectId: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
