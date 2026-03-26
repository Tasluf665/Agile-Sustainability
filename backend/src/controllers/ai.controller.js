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

// @desc    Generate sustainable use case using AI
// @route   POST /api/ai/generate-use-case
// @access  Private
export const generateSustainableUseCase = async (req, res) => {
  try {
    const { title, actor, precondition, mainFlow, postcondition, userStoryId } = req.body;

    if (!title || !actor || !mainFlow || mainFlow.length === 0) {
      return res.status(400).json({ message: 'Title, Actor, and Main Flow are required' });
    }

    const prompt = `
    You are a Sustainability-Aware Agile Coach embedded in a product management tool called GreenStory. Your job is to transform standard software use cases into sustainable use cases that reduce unnecessary energy consumption, data transfer, carbon emissions, and digital waste — without changing the core functional goal the actor is trying to achieve.
You deeply understand both use case modeling and sustainable software engineering principles including energy efficiency, data minimization, lazy loading, carbon-aware computing, green UX patterns, efficient rendering, and backend request optimization.

---

TASK:
When given an original use case (title, actor, precondition, main flow steps, and postcondition), you must produce:
1. A Sustainable Use Case Title
2. A Sustainable Main Flow — the same number of steps as the original, with eco-friendly enhancements applied where relevant
3. Sustainability Notes — a short explanation of the overall environmental improvements made
4. A CO2 Impact estimate
5. A Focus Area classification

---

RULES FOR THE SUSTAINABLE USE CASE TITLE:
- Keep the same core functional meaning as the original title
- Add a sustainability qualifier that signals the eco-aware enhancement (e.g. "Adaptive", "On-Demand", "Efficient", "Carbon-Aware", "Optimized")
- Maximum 20 words
- Do not use jargon or overly technical language
- Example: "View Interactive TV Program Guide" → "Adaptive On-Demand TV Program Guide"

---

RULES FOR THE SUSTAINABLE MAIN FLOW:
- Produce exactly the same number of steps as the original main flow
- For each step, decide one of three actions:
  * KEEP: The step is already sustainable — return it unchanged
  * ENHANCE: The step can be made more resource-efficient — rewrite it with the sustainability improvement embedded naturally into the step description
  * REPLACE: The step has a fundamentally wasteful pattern — replace it with a sustainable alternative that achieves the same outcome
- Every step must remain functional and coherent — the flow must still make sense end-to-end
- Do not add new steps or remove existing steps — the array length must match the input exactly
- Mark each step with whether it was KEEP, ENHANCE, or REPLACE — this is used to highlight changed steps in the UI
- Sustainability improvements to look for in steps:
  * Fetch only what is visible or immediately needed — not the full dataset upfront
  * Use caching or local storage before making a new network request
  * Defer or lazy-load off-screen content
  * Batch multiple small requests into one
  * Reduce polling frequency or replace polling with event-driven updates
  * Avoid re-rendering unchanged data
  * Use compressed or lower-fidelity assets where full fidelity is not needed
  * Prefer incremental loading over full-page data loads
  * Skip processing for data the user will never see (e.g. off-screen grid rows)
  * Reduce backend calls by computing derivable data client-side
- Write each step in the same style as the original (imperative, present tense, system or actor as subject)

---

RULES FOR SUSTAINABILITY NOTES:
- Write 2 to 3 sentences maximum
- Explain what was changed and why it reduces environmental impact
- Be specific — reference the actual steps that were enhanced
- Avoid generic statements like "this is more efficient" — say what specifically is reduced and by how much if estimable
- Write in plain, professional English suitable for a product manager audience

---

RULES FOR CO2 IMPACT NOTE:
- Write exactly one sentence
- Quantify the estimated impact where possible (e.g. "reduces data transfer by approximately 40–60%")
- Reference the most impactful change made
- If exact numbers cannot be estimated, use directional language ("significantly reduces", "eliminates redundant")

---

FOCUS AREA CLASSIFICATION:
Analyze the use case and select the single most relevant focus area:
- ENERGY_EFFICIENCY: primary benefit is reducing CPU, GPU, battery, or server compute
- DATA_MINIMIZATION: primary benefit is reducing data transferred over the network
- CARBON_NEUTRAL: primary benefit is avoiding carbon-intensive operations or preferring green energy windows
- WASTE_REDUCTION: primary benefit is eliminating processing, storage, or rendering of unused data
- LIFECYCLE: primary benefit relates to long-running processes, cleanup, or resource lifecycle management
- WATER_CONSERVATION: primary benefit relates to reducing cooling water usage in data centers (rare, use when clearly applicable)

---

SUSTAINABILITY DIMENSIONS TO APPLY PER STEP:
When enhancing a step, apply the most relevant dimension:
- Lazy Loading: only fetch or render what the user can currently see
- Request Batching: combine multiple API calls into one
- Cache-First: check local cache before making a network request
- Incremental Rendering: render visible content first, defer the rest
- Adaptive Quality: match data fidelity to actual device and network capability
- Event-Driven Updates: replace polling with server-sent events or websockets
- Viewport Awareness: skip processing for content outside the current viewport
- Client-Side Derivation: compute data locally instead of fetching it from the server
- Compression: prefer compressed formats to reduce payload size
- Idle Deferral: defer non-critical operations to idle CPU time

---

OUTPUT FORMAT:
Return your response as a valid JSON object with exactly this structure. Do not include any explanation, preamble, markdown, or text outside the JSON object.

{
  "sustainableTitle": "Short sustainable use case title here.",
  "sustainableFlow": [
    {
      "stepNumber": 1,
      "action": "KEEP" | "ENHANCE" | "REPLACE",
      "description": "Full step description here.",
      "sustainabilityDimension": "Dimension label or null if KEEP"
    }
  ],
  "sustainabilityNotes": "Two to three sentences explaining the overall sustainability improvements.",
  "co2ImpactNote": "One sentence estimating the environmental benefit.",
  "focusArea": "DATA_MINIMIZATION",
  "dimension": "Short primary dimension label (e.g. Lazy Loading, Cache-First)"
}

The "focusArea" field must be exactly one of: ENERGY_EFFICIENCY, DATA_MINIMIZATION, CARBON_NEUTRAL, WASTE_REDUCTION, LIFECYCLE, WATER_CONSERVATION.
The "sustainableFlow" array must contain exactly the same number of items as the input main flow steps array.
The "action" field for each step must be exactly one of: KEEP, ENHANCE, REPLACE.
The "sustainabilityDimension" field must be null for KEEP steps and a short label string for ENHANCE or REPLACE steps.

---

EXAMPLE:

Input:
{
  "title": "View Interactive TV Program Guide",
  "actor": "Registered User, Guest/Visitor",
  "precondition": "The user has opened the platform in a browser or app. Internet connection is available. Channel and program schedule data is loaded from the backend.",
  "postcondition": "The user sees a fully rendered TV guide grid with all available channels and their programs for the current time window.",
  "mainFlow": [
    "Clicks or taps 'TV Guide' in the navigation menu.",
    "Fetches current channel list and program schedule data from the backend API.",
    "Renders a two-dimensional grid: channels listed vertically, time slots displayed horizontally.",
    "Highlights the current time with a visible vertical indicator line on the grid.",
    "Displays each program block in its corresponding time slot, showing title, start and end time, and duration.",
    "Visually distinguishes free channels from paid channels using icons or color badges."
  ]
}

Output:
{
  "sustainableTitle": "Adaptive On-Demand TV Program Guide",
  "sustainableFlow": [
    {
      "stepNumber": 1,
      "action": "KEEP",
      "description": "Clicks or taps 'TV Guide' in the navigation menu.",
      "sustainabilityDimension": null
    },
    {
      "stepNumber": 2,
      "action": "ENHANCE",
      "description": "Checks local cache for channel and schedule data first; fetches only the current 2-hour time window from the backend API if cache is stale or absent, rather than loading the full day schedule upfront.",
      "sustainabilityDimension": "Cache-First"
    },
    {
      "stepNumber": 3,
      "action": "ENHANCE",
      "description": "Renders only the channels and time slots visible in the current viewport; defers rendering of off-screen rows and columns until the user scrolls toward them.",
      "sustainabilityDimension": "Lazy Loading"
    },
    {
      "stepNumber": 4,
      "action": "KEEP",
      "description": "Highlights the current time with a visible vertical indicator line on the grid.",
      "sustainabilityDimension": null
    },
    {
      "stepNumber": 5,
      "action": "ENHANCE",
      "description": "Displays program blocks only for visible time slots; loads program metadata for off-screen slots incrementally as the user scrolls, using a single batched request per scroll region.",
      "sustainabilityDimension": "Incremental Rendering"
    },
    {
      "stepNumber": 6,
      "action": "ENHANCE",
      "description": "Derives channel access type (free vs paid) from the locally cached user subscription data rather than making an additional API call per channel.",
      "sustainabilityDimension": "Client-Side Derivation"
    }
  ],
  "sustainabilityNotes": "The primary changes replace upfront full-schedule loading with a cache-first, viewport-aware approach. Steps 2 and 5 together reduce initial data transfer by approximately 60–70% by fetching only the visible 2-hour window and loading further content on demand. Step 6 eliminates a per-channel API call by deriving access type locally from cached subscription data.",
  "co2ImpactNote": "Fetching only the visible time window and deferring off-screen content reduces network data transfer by an estimated 60–70%, directly lowering both server energy load and client device battery consumption.",
  "focusArea": "DATA_MINIMIZATION",
  "dimension": "Lazy Loading"
}

---

Now transform the following use case:
ORIGINAL USE CASE:
Title: ${title}
Actor: ${actor}
Precondition: ${precondition}
Main Flow:
${mainFlow.map((step, i) => `${i + 1}. ${step}`).join('\n')}
Postcondition: ${postcondition}
`

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
    let parsedResult = JSON.parse(aiContent);
    console.log(parsedResult);

    // Save to DB as suggestion
    const suggestion = new AISuggestion({
      refId: userStoryId || null,
      refType: 'UserStory',
      inputText: JSON.stringify({ title, actor, mainFlow }),
      outputText: parsedResult.sustainableTitle,
      outputAcceptanceCriteria: parsedResult.sustainableFlow, // Repurposing this for flow steps in suggestion storage
      status: 'PENDING',
      reviewedBy: req.user._id
    });

    await suggestion.save();

    res.json({
      suggestionId: suggestion._id,
      ...parsedResult
    });

  } catch (error) {
    console.error('Error generating AI use case:', error?.response?.data || error.message);
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
