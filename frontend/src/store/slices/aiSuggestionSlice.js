import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suggestions: [],
  loading: false,
  error: null,
};

const aiSuggestionSlice = createSlice({
  name: 'aiSuggestion',
  initialState,
  reducers: {
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSuggestions, setLoading } = aiSuggestionSlice.actions;
export default aiSuggestionSlice.reducer;
