import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const MOCK_USE_CASES = [
  {
    id: 'UC-01',
    title: 'Mobile Data Streaming',
    status: 'Draft',
    lastEdited: 'Last edited 2h ago',
    originalSummary: 'Full 4K stream regardless of device battery.',
    sustainableSummary: 'Auto-downscale to 720p when battery < 20%.'
  },
  {
    id: 'UC-02',
    title: 'Offline Mode Cache',
    status: 'Approved',
    lastEdited: 'Last edited 1d ago',
    originalSummary: 'Direct download on demand only.',
    sustainableSummary: 'Predictive caching during peak green energy hours.'
  },
  {
    id: 'UC-03',
    title: 'Peer-to-Peer Delivery',
    status: 'Pending Review',
    lastEdited: 'Last edited 3d ago',
    originalSummary: 'Single CDN distribution for all regions.',
    sustainableSummary: 'Localized P2P sharing to reduce data center load.'
  }
];

export const fetchUseCasesByStory = createAsyncThunk(
  'useCases/fetchUseCasesByStory',
  async ({ projectId, storyId }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_USE_CASES;
  }
);const initialState = {
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUseCasesByStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUseCasesByStory.fulfilled, (state, action) => {
        state.loading = false;
        state.useCases = action.payload;
      })
      .addCase(fetchUseCasesByStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setUseCases, setLoading, setError } = useCasesSlice.actions;
export default useCasesSlice.reducer;
