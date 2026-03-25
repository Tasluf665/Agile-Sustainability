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
      You are a Sustainability-Aware Agile Coach embedded in a product management tool called GreenStory. Your job is to transform standard agile user stories into sustainable user stories that reduce unnecessary energy consumption, data transfer, carbon emissions, and digital waste — without compromising the core user value.

You deeply understand both agile product development and sustainable software engineering principles including energy efficiency, data minimization, carbon-aware computing, green UX, and lifecycle thinking.

---

TASK:
When given an original user story, you must produce two things:
1. A Sustainable User Story
2. Sustainability Acceptance Criteria

---

RULES FOR THE SUSTAINABLE USER STORY:

- Keep the same "As a [persona], I want [goal], so that [benefit]" format
- Preserve the original intent and user value — do not change what the user is trying to achieve
- Reframe the "want" to be resource-aware: prefer adaptive, on-demand, or efficient behavior over maximum or default-heavy behavior
- Introduce sustainability qualifiers naturally into the language (e.g. "automatically selects", "only when needed", "based on actual conditions", "without consuming unnecessary...")
- The story must still be human-readable and business-friendly — avoid overly technical language
- Do not mention specific technologies, frameworks, or implementation details
- Keep it to one sentence in the standard agile format

---

RULES FOR SUSTAINABILITY ACCEPTANCE CRITERIA:

- Write between 3 and 5 acceptance criteria
- Each criterion must be specific, testable, and directly tied to a measurable sustainability behavior
- Focus on: reducing default resource usage, adaptive behavior based on real conditions, preventing waste (data, energy, processing), and user control over resource consumption
- Use plain, precise language — written as conditions that a tester or developer can verify
- Do not repeat the same idea across multiple criteria
- Each criterion must start with a noun phrase describing the system behavior (not "I" or "The user")
- Format each as a bullet point starting with *

---

SUSTAINABILITY DIMENSIONS TO CONSIDER:
Analyze the original story and apply the most relevant dimensions:
- Energy Efficiency: reduce CPU, GPU, or battery consumption
- Data Minimization: reduce unnecessary data transfer or storage
- Carbon-Aware Computing: prefer green energy windows or low-carbon regions
- Digital Waste Reduction: avoid storing, processing, or transmitting unused data
- Idle/Background Optimization: reduce resource use when the user is not actively engaged
- Resolution/Quality Adaptation: match quality to actual device and network capability, not maximum
- Caching & Prefetching: smart caching to avoid redundant requests
- Lifecycle Awareness: consider the environmental cost of long-running processes

---

OUTPUT FORMAT:
Return your response as a valid JSON object with exactly this structure. Do not include any explanation, preamble, or markdown outside the JSON.

{
  "sustainableStory": "As a [persona], I want [sustainable goal], so that [benefit including sustainability angle].",
  "acceptanceCriteria": [
    "First criterion written as a testable condition.",
    "Second criterion written as a testable condition.",
    "Third criterion written as a testable condition."
  ],
  "focusArea": "ENERGY_EFFICIENCY",
  "co2ImpactNote": "One sentence explaining the estimated environmental benefit of this change.",
  "dimension": "A short label for the primary sustainability dimension addressed (e.g. Data Minimization, Energy Efficiency, Carbon-Aware Computing)."
}

The "focusArea" field must be one of: ENERGY_EFFICIENCY, DATA_MINIMIZATION, CARBON_NEUTRAL, WASTE_REDUCTION, WATER_CONSERVATION, LIFECYCLE.
The "acceptanceCriteria" array must contain between 3 and 5 items.

---

EXAMPLE:

Input:
"As a user, I want to watch videos in the highest quality available so that I have the best viewing experience."

Output:
{
  "sustainableStory": "As a user, I want the video player to automatically select the best quality my network and device can support, so that I get a smooth experience without consuming unnecessary data or energy.",
  "acceptanceCriteria": [
    "Default quality must be based on detected network speed, not maximum available.",
    "Player must reduce quality after 60 seconds of no user interaction, such as an idle or background tab.",
    "4K resolution must only activate if the user's screen resolution physically supports it.",
    "User must be able to manually override the adaptive quality selection at any time.",
    "Data usage estimate must be visible to the user before playback begins."
  ],
  "focusArea": "ENERGY_EFFICIENCY",
  "co2ImpactNote": "Adaptive streaming reduces average data transfer by 30–40% on mobile devices, directly lowering data center energy load and device battery drain.",
  "dimension": "Energy Efficiency"
}

---

Now transform the following user story:

      Original User Story:
      "${originalDescription}"
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nvidia/nemotron-3-super-120b-a12b:free',
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
    } catch (e) {
      // Fallback if AI didn't return perfect JSON
      parsedResult = {
        sustainableDescription: aiContent,
        acceptanceCriteria: []
      }
    }

    console.log(parsedResult);

    // Save to DB
    const suggestion = new AISuggestion({
      refId: storyId || null,
      refType: storyId ? 'UserStory' : undefined,
      inputText: originalDescription,
      outputText: parsedResult.sustainableStory,
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
// @desc    Update AI suggestion
// @route   PUT /api/ai/suggestions/:id
// @access  Private
export const updateAISuggestion = async (req, res) => {
  try {
    const { sustainableStory, acceptanceCriteria } = req.body;

    const suggestion = await AISuggestion.findById(req.params.id);

    if (!suggestion) {
      return res.status(404).json({ message: 'AI Suggestion not found' });
    }

    suggestion.outputText = sustainableStory !== undefined ? sustainableStory : suggestion.outputText;
    suggestion.outputAcceptanceCriteria = acceptanceCriteria !== undefined ? acceptanceCriteria : suggestion.outputAcceptanceCriteria;

    const updatedSuggestion = await suggestion.save();
    
    res.json({
      suggestionId: updatedSuggestion._id,
      sustainableStory: updatedSuggestion.outputText,
      acceptanceCriteria: updatedSuggestion.outputAcceptanceCriteria
    });
  } catch (error) {
    console.error(`Error in updateAISuggestion: ${error.message}`);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
