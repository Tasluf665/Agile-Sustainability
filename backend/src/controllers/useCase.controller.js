import UseCase from '../models/UseCase.model.js';
import UserStory from '../models/UserStory.model.js';
import AISuggestion from '../models/AISuggestion.model.js';

// @desc    Get all use cases (optionally filtered by userStoryId or projectId)
// @route   GET /api/use-cases
// @access  Private
export const getUseCases = async (req, res) => {
  try {
    const { userStoryId, projectId } = req.query;
    let query = {};
    if (userStoryId) query.userStoryId = userStoryId;
    if (projectId) query.projectId = projectId;

    const useCases = await UseCase.find(query).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(useCases);
  } catch (error) {
    console.error(`Error in getUseCases: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single use case
// @route   GET /api/use-cases/:id
// @access  Private
export const getUseCase = async (req, res) => {
  try {
    const useCase = await UseCase.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!useCase) {
      return res.status(404).json({ message: 'Use Case not found' });
    }
    
    res.json(useCase);
  } catch (error) {
    console.error(`Error in getUseCase: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a use case
// @route   POST /api/use-cases
// @access  Private
export const createUseCase = async (req, res) => {
  try {
    const { userStoryId, projectId, title, actor, precondition, mainFlow, postcondition } = req.body;

    if (!userStoryId || !projectId || !title || !actor) {
      return res.status(400).json({ message: 'UserStory ID, Project ID, title, and actor are required' });
    }

    // Enforce 1-to-[0..1] mapping between UserStory and UseCase
    const existingUseCase = await UseCase.findOne({ userStoryId });
    if (existingUseCase) {
      return res.status(400).json({ message: 'A Use Case already exists for this User Story. Only one is allowed.' });
    }

    const newUseCase = new UseCase({
      userStoryId,
      projectId,
      createdBy: req.user._id,
      title,
      actor,
      precondition: precondition || '',
      mainFlow: mainFlow || [],
      postcondition: postcondition || '',
      status: 'ACTIVE',
    });

    const savedUseCase = await newUseCase.save();
    
    // Repopulate explicitly before returning
    const populated = await UseCase.findById(savedUseCase._id).populate('createdBy', 'name email');
    
    res.status(201).json(populated);
  } catch (error) {
    console.error(`Error in createUseCase: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a use case
// @route   PUT /api/use-cases/:id
// @access  Private
export const updateUseCase = async (req, res) => {
  try {
    const { title, actor, precondition, mainFlow, postcondition, status } = req.body;

    const useCase = await UseCase.findById(req.params.id);

    if (!useCase) {
      return res.status(404).json({ message: 'Use Case not found' });
    }

    useCase.title = title !== undefined ? title : useCase.title;
    useCase.actor = actor !== undefined ? actor : useCase.actor;
    useCase.precondition = precondition !== undefined ? precondition : useCase.precondition;
    useCase.mainFlow = mainFlow !== undefined ? mainFlow : useCase.mainFlow;
    useCase.postcondition = postcondition !== undefined ? postcondition : useCase.postcondition;
    useCase.status = status !== undefined ? status : useCase.status;

    const updatedUseCase = await useCase.save();
    res.json(updatedUseCase);
  } catch (error) {
    console.error(`Error in updateUseCase: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a use case
// @route   DELETE /api/use-cases/:id
// @access  Private
export const deleteUseCase = async (req, res) => {
  try {
    const useCase = await UseCase.findById(req.params.id);

    if (!useCase) {
      return res.status(404).json({ message: 'Use Case not found' });
    }

    // Delete AI Suggestions corresponding to this Use Case
    await AISuggestion.deleteMany({ refId: req.params.id, refType: 'UseCase' });

    await UseCase.findByIdAndDelete(req.params.id);

    res.json({ message: 'Use Case removed successfully' });
  } catch (error) {
    console.error(`Error in deleteUseCase: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Apply a sustainable alternative to a UseCase
// @route   POST /api/use-cases/:id/sustainable
// @access  Private
export const applySustainableUseCase = async (req, res) => {
  try {
    const { sustainableTitle, sustainableFlow, sustainabilityNotes, co2SavingPerHour, dimension, co2Impact } = req.body;
    
    const useCase = await UseCase.findById(req.params.id);

    if (!useCase) {
      return res.status(404).json({ message: 'Use Case not found' });
    }

    // Create an AISuggestion record to track this conversion
    const suggestion = new AISuggestion({
      refId: useCase._id,
      refType: 'UseCase',
      inputText: `Title: ${useCase.title}\nFlow: ${useCase.mainFlow?.join(' \\n ')}`,
      outputText: sustainableTitle || useCase.sustainableTitle,
      outputMainFlow: sustainableFlow || [],
      sustainabilityNotes: sustainabilityNotes || '',
      co2Impact: co2Impact || '',
      dimension: dimension || '',
      status: 'ACCEPTED',
      reviewedBy: req.user._id,
      reviewedAt: Date.now()
    });

    await suggestion.save();

    // Update the Use Case fields
    useCase.sustainableTitle = sustainableTitle !== undefined ? sustainableTitle : useCase.sustainableTitle;
    useCase.sustainableFlow = sustainableFlow !== undefined ? sustainableFlow : useCase.sustainableFlow;
    useCase.sustainabilityNotes = sustainabilityNotes !== undefined ? sustainabilityNotes : useCase.sustainabilityNotes;
    useCase.co2SavingPerHour = co2SavingPerHour !== undefined ? co2SavingPerHour : useCase.co2SavingPerHour;
    useCase.dimension = dimension !== undefined ? dimension : useCase.dimension;
    
    const updatedUseCase = await useCase.save();
    
    // Returning both the updated Use Case and the Suggestion record
    res.json({ useCase: updatedUseCase, suggestion });
  } catch (error) {
    console.error(`Error in applySustainableUseCase: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
