import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const generateSustainableUseCase = createAsyncThunk(
  'aiSuggestion/generateUseCase',
  async (useCaseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/ai/generate-use-case', useCaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Generation failed');
    }
  }
);

const initialState = {
  currentSuggestion: null,
  loading: false,
  error: null,
};

const aiSuggestionSlice = createSlice({
  name: 'aiSuggestion',
  initialState,
  reducers: {
    resetSuggestion: (state) => {
      state.currentSuggestion = null;
      state.error = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateSustainableUseCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSustainableUseCase.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSuggestion = action.payload;
      })
      .addCase(generateSustainableUseCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetSuggestion, setLoading } = aiSuggestionSlice.actions;
export default aiSuggestionSlice.reducer;
