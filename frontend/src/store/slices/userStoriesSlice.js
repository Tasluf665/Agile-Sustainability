import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const formatStory = (story) => ({
  id: story._id,
  projectId: story.projectId,
  title: story.originalDescription ? story.originalDescription.substring(0, 50) + (story.originalDescription.length > 50 ? '...' : '') : 'Untitled Story',
  description: story.originalDescription,
  originalDescription: story.originalDescription,
  sustainableDescription: story.sustainableDescription,
  acceptanceCriteria: story.acceptanceCriteria || [],
  priority: story.priority,
  feature: story.feature,
  status: story.status,
  focusArea: story.focusArea || '',
  co2ImpactNote: story.co2ImpactNote || '',
  aiGenerated: story.aiGenerated || false,
  useCaseCount: 0,
  assignees: story.createdBy ? [{ name: story.createdBy.name, avatarUrl: 'https://i.pravatar.cc/150?u=' + story.createdBy._id }] : []
});

export const fetchUserStoriesByProject = createAsyncThunk(
  'userStories/fetchUserStoriesByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user-stories?projectId=${projectId}`);
      return response.data.map(formatStory);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserStoryById = createAsyncThunk(
  'userStories/fetchUserStoryById',
  async ({ projectId, storyId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user-stories/${storyId}`);
      return formatStory(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const generateSustainableStory = createAsyncThunk(
  'userStories/generateSustainableStory',
  async (originalDescription, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/generate-user-story', {
        originalDescription
      });
      // Return the object containing the new fields from the openrouter prompt
      return {
        description: response.data.sustainableStory,
        criteria: response.data.acceptanceCriteria || [],
        focusArea: response.data.focusArea,
        co2ImpactNote: response.data.co2ImpactNote,
        dimension: response.data.dimension
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createUserStory = createAsyncThunk(
  'userStories/createUserStory',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/user-stories', {
        projectId: payload.projectId,
        originalDescription: payload.description,
        sustainableDescription: payload.sustainableDescription,
        acceptanceCriteria: payload.acceptanceCriteria,
        focusArea: payload.focusArea,
        co2ImpactNote: payload.co2ImpactNote,
        aiGenerated: payload.aiGenerated,
        priority: payload.priority || 'MEDIUM',
        feature: payload.feature || ''
      });
      return formatStory(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const acceptSustainableStory = createAsyncThunk(
  'userStories/acceptSustainableStory',
  async (storyId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const aiResult = state.userStories.aiSuggestion.result;
      
      const sustainableDescription = aiResult?.description 
        || state.userStories.currentStory?.sustainableDescription;
        
      const acceptanceCriteria = aiResult?.criteria 
        || state.userStories.currentStory?.acceptanceCriteria || [];

      await api.post(`/user-stories/${storyId}/sustainable`, {
        sustainableDescription,
        acceptanceCriteria
      });
      
      const updateRes = await api.put(`/user-stories/${storyId}`, { status: 'APPROVED' });
      return formatStory(updateRes.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const rejectSustainableStory = createAsyncThunk(
  'userStories/rejectSustainableStory',
  async (storyId, { rejectWithValue }) => {
    try {
      const updateRes = await api.put(`/user-stories/${storyId}`, { status: 'DRAFT' });
      return formatStory(updateRes.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userStoriesSlice = createSlice({
  name: 'userStories',
  initialState: {
    items: [],
    currentStory: null,
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
        state.error = action.payload;
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
      })
      .addCase(fetchUserStoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserStoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStory = action.payload;
      })
      .addCase(fetchUserStoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(acceptSustainableStory.fulfilled, (state, action) => {
        if (state.currentStory && state.currentStory.id === action.payload.id) {
          state.currentStory = action.payload;
        }
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(rejectSustainableStory.fulfilled, (state, action) => {
        if (state.currentStory && state.currentStory.id === action.payload.id) {
          state.currentStory = action.payload;
        }
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearAiSuggestion } = userStoriesSlice.actions;
export default userStoriesSlice.reducer;
