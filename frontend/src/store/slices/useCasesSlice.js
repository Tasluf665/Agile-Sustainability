import { createSlice } from '@reduxjs/toolkit';

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
    setUseCases: (state, action) => {
      state.useCases = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUseCases, setLoading, setError } = useCasesSlice.actions;
export default useCasesSlice.reducer;
