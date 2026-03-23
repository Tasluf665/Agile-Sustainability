import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stories: [],
  currentStory: null,
  loading: false,
  error: null,
};

const userStoriesSlice = createSlice({
  name: 'userStories',
  initialState,
  reducers: {
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setStories, setLoading, setError } = userStoriesSlice.actions;
export default userStoriesSlice.reducer;
