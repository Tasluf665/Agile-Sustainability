import UserStory from '../models/UserStory.model.js';
import UseCase from '../models/UseCase.model.js';
import AISuggestion from '../models/AISuggestion.model.js';

// @desc    Get all user stories for a project
// @route   GET /api/user-stories?projectId=...
// @access  Private
export const getUserStories = async (req, res) => {
  try {
    const { projectId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const stories = await UserStory.find({ projectId }).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error(`Error in getUserStories: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single user story
// @route   GET /api/user-stories/:id
// @access  Private
export const getUserStory = async (req, res) => {
  try {
    const story = await UserStory.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!story) {
      return res.status(404).json({ message: 'User Story not found' });
    }
    
    res.json(story);
  } catch (error) {
    console.error(`Error in getUserStory: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a user story
// @route   POST /api/user-stories
// @access  Private
export const createUserStory = async (req, res) => {
  try {
    const { 
      projectId, 
      originalDescription, 
      priority, 
      feature, 
      sustainableDescription, 
      acceptanceCriteria,
      focusArea,
      co2ImpactNote,
      aiGenerated 
    } = req.body;

    if (!projectId || !originalDescription) {
      return res.status(400).json({ message: 'Project ID and Original Description are required' });
    }

    const newStory = new UserStory({
      projectId,
      createdBy: req.user._id,
      originalDescription,
      sustainableDescription: sustainableDescription || '',
      acceptanceCriteria: acceptanceCriteria || [],
      focusArea: focusArea || '',
      co2ImpactNote: co2ImpactNote || '',
      aiGenerated: aiGenerated || false,
      priority: priority || 'MEDIUM',
      feature: feature || '',
      status: 'DRAFT',
    });

    const savedStory = await newStory.save();
    
    // Repopulate explicitly before returning
    const populated = await UserStory.findById(savedStory._id).populate('createdBy', 'name email');
    
    res.status(201).json(populated);
  } catch (error) {
    console.error(`Error in createUserStory: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a user story
// @route   PUT /api/user-stories/:id
// @access  Private
export const updateUserStory = async (req, res) => {
  try {
    const { 
      originalDescription, 
      priority, 
      feature, 
      status,
      sustainableDescription,
      acceptanceCriteria,
      focusArea,
      co2ImpactNote,
      aiGenerated
    } = req.body;

    const story = await UserStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'User Story not found' });
    }

    // Optional constraint: Only creator or project owner can update
    // We assume any authorized user in the project can update for now

    story.originalDescription = originalDescription !== undefined ? originalDescription : story.originalDescription;
    story.priority = priority !== undefined ? priority : story.priority;
    story.feature = feature !== undefined ? feature : story.feature;
    story.status = status !== undefined ? status : story.status;
    story.sustainableDescription = sustainableDescription !== undefined ? sustainableDescription : story.sustainableDescription;
    story.acceptanceCriteria = acceptanceCriteria !== undefined ? acceptanceCriteria : story.acceptanceCriteria;
    story.focusArea = focusArea !== undefined ? focusArea : story.focusArea;
    story.co2ImpactNote = co2ImpactNote !== undefined ? co2ImpactNote : story.co2ImpactNote;
    story.aiGenerated = aiGenerated !== undefined ? aiGenerated : story.aiGenerated;

    const updatedStory = await story.save();
    res.json(updatedStory);
  } catch (error) {
    console.error(`Error in updateUserStory: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a user story
// @route   DELETE /api/user-stories/:id
// @access  Private
export const deleteUserStory = async (req, res) => {
  try {
    const story = await UserStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'User Story not found' });
    }

    // Cascade delete any associated use cases
    await UseCase.deleteMany({ userStoryId: req.params.id });
    
    // Delete AI Suggestions corresponding to this story
    await AISuggestion.deleteMany({ refId: req.params.id, refType: 'UserStory' });

    await UserStory.findByIdAndDelete(req.params.id);

    res.json({ message: 'User story removed successfully' });
  } catch (error) {
    console.error(`Error in deleteUserStory: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Apply a sustainable alternative to a UserStory
// @route   POST /api/user-stories/:id/sustainable
// @access  Private
export const applySustainableUserStory = async (req, res) => {
  try {
    const { sustainableDescription, acceptanceCriteria, sustainabilityNotes, co2Impact, dimension } = req.body;
    
    const story = await UserStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'User Story not found' });
    }

    // Create an AISuggestion record to track this conversion
    const suggestion = new AISuggestion({
      refId: story._id,
      refType: 'UserStory',
      inputText: story.originalDescription,
      outputText: sustainableDescription,
      outputAcceptanceCriteria: acceptanceCriteria || [],
      sustainabilityNotes: sustainabilityNotes || '',
      co2Impact: co2Impact || '',
      dimension: dimension || '',
      status: 'ACCEPTED',
      reviewedBy: req.user._id,
      reviewedAt: Date.now()
    });

    await suggestion.save();

    // Update the story fields
    story.sustainableDescription = sustainableDescription;
    story.acceptanceCriteria = acceptanceCriteria || [];
    story.aiGenerated = true;
    
    const updatedStory = await story.save();
    
    // Returning both story and suggestion 
    res.json({ story: updatedStory, suggestion });
  } catch (error) {
    console.error(`Error in applySustainableUserStory: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
