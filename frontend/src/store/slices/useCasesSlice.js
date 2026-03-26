import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUseCasesByStory = createAsyncThunk(
  'useCases/fetchByStory',
  async ({ projectId, storyId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/use-cases?projectId=${projectId}&userStoryId=${storyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch use cases');
    }
  }
);

export const fetchUseCasesByProject = createAsyncThunk(
  'useCases/fetchByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/use-cases?projectId=${projectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch use cases');
    }
  }
);

export const createUseCase = createAsyncThunk(
  'useCases/create',
  async (useCaseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/use-cases', useCaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create use case');
    }
  }
);

export const fetchUseCaseById = createAsyncThunk(
  'useCases/fetchById',
  async ({ projectId, storyId, useCaseId }, { rejectWithValue }) => {
    try {
      // The API endpoint is just /use-cases/:id
      const response = await api.get(`/use-cases/${useCaseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch use case');
    }
  }
);

export const updateUseCase = createAsyncThunk(
  'useCases/update',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/use-cases/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update use case');
    }
  }
);

export const acceptSustainableUseCase = createAsyncThunk(
  'useCases/acceptSustainable',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/use-cases/${id}/accept`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept sustainable use case');
    }
  }
);

export const rejectSustainableUseCase = createAsyncThunk(
  'useCases/rejectSustainable',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/use-cases/${id}/reject`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject sustainable use case');
    }
  }
);

export const deleteUseCase = createAsyncThunk(
  'useCases/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/use-cases/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete use case');
    }
  }
);

const initialState = {
  useCases: [],
  currentUseCase: null,
  loading: false,
  error: null,
};

const useCasesSlice = createSlice({
  name: 'useCases',
  initialState,
  reducers: {
    clearCurrentUseCase: (state) => {
      state.currentUseCase = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUseCasesByStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUseCasesByStory.fulfilled, (state, action) => {
        state.loading = false;
        state.useCases = action.payload;
      })
      .addCase(fetchUseCasesByStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By Project
      .addCase(fetchUseCasesByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUseCasesByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.useCases = action.payload;
      })
      .addCase(fetchUseCasesByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createUseCase.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUseCase.fulfilled, (state, action) => {
        state.loading = false;
        state.useCases.push(action.payload);
      })
      .addCase(createUseCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteUseCase.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteUseCase.fulfilled, (state, action) => {
        state.useCases = state.useCases.filter(uc => uc.id !== action.payload && uc._id !== action.payload);
        if (state.currentUseCase && (state.currentUseCase._id === action.payload || state.currentUseCase.id === action.payload)) {
          state.currentUseCase = null;
        }
      })
      .addCase(deleteUseCase.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchUseCaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUseCaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUseCase = action.payload;
        // Optionally update it in the list if it exists
        const index = state.useCases.findIndex(uc => uc._id === action.payload._id || uc.id === action.payload.id);
        if (index !== -1) {
          state.useCases[index] = action.payload;
        }
      })
      .addCase(fetchUseCaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateUseCase.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUseCase.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUseCase = action.payload;
        const index = state.useCases.findIndex(uc => uc._id === action.payload._id || uc.id === action.payload.id);
        if (index !== -1) {
          state.useCases[index] = action.payload;
        }
      })
      .addCase(updateUseCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept
      .addCase(acceptSustainableUseCase.fulfilled, (state, action) => {
        state.currentUseCase = action.payload;
        const index = state.useCases.findIndex(uc => uc._id === action.payload._id || uc.id === action.payload.id);
        if (index !== -1) {
          state.useCases[index] = action.payload;
        }
      })
      // Reject
      .addCase(rejectSustainableUseCase.fulfilled, (state, action) => {
        state.currentUseCase = action.payload;
        const index = state.useCases.findIndex(uc => uc._id === action.payload._id || uc.id === action.payload.id);
        if (index !== -1) {
          state.useCases[index] = action.payload;
        }
      });
  }
});

export const { clearCurrentUseCase, setError } = useCasesSlice.actions;
export default useCasesSlice.reducer;
