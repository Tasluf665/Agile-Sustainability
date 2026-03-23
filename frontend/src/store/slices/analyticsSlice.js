import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSustainabilityScore = createAsyncThunk(
  'analytics/fetchSustainabilityScore',
  async (projectId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { month: 'Jan', score: 45 },
      { month: 'Feb', score: 52 },
      { month: 'Mar', score: 58 },
      { month: 'Apr', score: 65 },
      { month: 'May', score: 72 },
      { month: 'Jun', score: 86 }
    ];
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    sustainabilityScores: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSustainabilityScore.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSustainabilityScore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sustainabilityScores = action.payload;
      })
      .addCase(fetchSustainabilityScore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
