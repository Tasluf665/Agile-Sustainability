import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data matching the design
const MOCK_STORIES = [
  {
    id: '1',
    projectId: 'demo-1',
    title: 'Optimize Video Encoding for Mobile Devices',
    focusArea: 'ENERGY',
    status: 'ACCEPTED',
    useCaseCount: 3,
    assignees: [
      { name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
      { name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=2' }
    ]
  },
  {
    id: '2',
    projectId: 'demo-1',
    title: 'Server Migration to Green Data Centers',
    focusArea: 'CARBON',
    status: 'PENDING REVIEW',
    useCaseCount: 1,
    assignees: [
      { name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=3' }
    ]
  },
  {
    id: '3',
    projectId: 'demo-1',
    title: 'Automated Deletion of Stale Media Assets',
    focusArea: 'WASTE',
    status: 'IN PROGRESS',
    useCaseCount: 5,
    assignees: [
      { name: 'David', avatarUrl: 'https://i.pravatar.cc/150?u=4' },
      { name: 'Eve', avatarUrl: 'https://i.pravatar.cc/150?u=5' },
      { name: 'Frank', avatarUrl: 'https://i.pravatar.cc/150?u=6' },
      { name: 'Grace', avatarUrl: 'https://i.pravatar.cc/150?u=7' }
    ]
  }
];

export const fetchUserStoriesByProject = createAsyncThunk(
  'userStories/fetchUserStoriesByProject',
  async (projectId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_STORIES;
  }
);

export const generateSustainableStory = createAsyncThunk(
  'userStories/generateSustainableStory',
  async (originalDescription) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI generation
    return `Enhanced sustainable version of: ${originalDescription}\n\nKey additions:\n- Measured energy reduction targets\n- Optimized data transfer constraints\n- Cloud compute scheduling during off-peak hours`;
  }
);

export const createUserStory = createAsyncThunk(
  'userStories/createUserStory',
  async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      ...payload,
      status: 'DRAFT',
      focusArea: 'ENERGY',
      useCaseCount: 0,
      assignees: []
    };
  }
);

const userStoriesSlice = createSlice({
  name: 'userStories',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    aiSuggestion: {
      isGenerating: false,
      result: null,
      error: null
    }
  },
  reducers: {
    clearAiSuggestion(state) {
      state.aiSuggestion.result = null;
      state.aiSuggestion.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStoriesByProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserStoriesByProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserStoriesByProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(generateSustainableStory.pending, (state) => {
        state.aiSuggestion.isGenerating = true;
        state.aiSuggestion.error = null;
      })
      .addCase(generateSustainableStory.fulfilled, (state, action) => {
        state.aiSuggestion.isGenerating = false;
        state.aiSuggestion.result = action.payload;
      })
      .addCase(generateSustainableStory.rejected, (state, action) => {
        state.aiSuggestion.isGenerating = false;
        state.aiSuggestion.error = action.error.message;
      })
      .addCase(createUserStory.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { clearAiSuggestion } = userStoriesSlice.actions;
export default userStoriesSlice.reducer;
