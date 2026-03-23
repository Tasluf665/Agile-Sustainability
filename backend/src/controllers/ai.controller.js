import axios from 'axios';
import AISuggestion from '../models/AISuggestion.model.js';

// @desc    Generate sustainable user story using AI
// @route   POST /api/ai/generate-user-story
// @access  Private
export const generateSustainableUserStory = async (req, res) => {
  try {
    const { originalDescription, storyId } = req.body;

    if (!originalDescription) {
      return res.status(400).json({ message: 'originalDescription is required' });
    }

    const prompt = `
      You are an expert in Agile methodology and Sustainable Software Engineering.
      Convert the following User Story into a Sustainable User Story.
      
      Original User Story:
      "${originalDescription}"
      
      Please provide:
      1. A revised sustainable user story description.
      2. 3-5 concrete acceptance criteria that focus on energy efficiency, carbon footprint reduction, or digital waste minimization.
      
      Format the output as a valid JSON object with the exact following structure:
      {
        "sustainableDescription": "...",
        "acceptanceCriteria": ["...", "..."]
      }
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'stepfun/step-3.5-flash:free',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiContent = response.data.choices[0].message.content;
    let parsedResult;
    try {
      parsedResult = JSON.parse(aiContent);
    } catch(e) {
      // Fallback if AI didn't return perfect JSON
      parsedResult = {
        sustainableDescription: aiContent,
        acceptanceCriteria: []
      }
    }

    // Save to DB
    const suggestion = new AISuggestion({
      refId: storyId || null,
      refType: storyId ? 'UserStory' : undefined,
      inputText: originalDescription,
      outputText: parsedResult.sustainableDescription,
      outputAcceptanceCriteria: parsedResult.acceptanceCriteria,
      status: 'PENDING',
      reviewedBy: req.user ? req.user._id : null
    });

    await suggestion.save();

    res.json({
      suggestionId: suggestion._id,
      ...parsedResult
    });

  } catch (error) {
    console.error('Error generating AI story:', error?.response?.data || error.message);
    res.status(500).json({ message: 'AI Generation Failed', error: error.message });
  }
};
