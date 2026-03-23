import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjectActivity = createAsyncThunk(
  'activity/fetchProjectActivity',
  async (projectId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      { type: 'approved', description: 'Sustainability suggestion approved', timeAgo: '2 hours ago', author: 'Marcus Chen' },
      { type: 'new_story', description: 'New User Story: Low Latency Edge Delivery', timeAgo: '5 hours ago', author: 'Aiden Walsh' },
      { type: 'new_use_case', description: "New use case added to 'Mobile Optimization'", timeAgo: 'Yesterday', author: 'Felix Graham' }
    ];
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectActivity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjectActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default activitySlice.reducer;
