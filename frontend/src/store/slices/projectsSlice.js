import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: '1',
          name: 'Video Streaming Platform',
          industry: 'Tech',
          description: 'Optimizing data transfer for sustainable streaming...',
          focusAreas: [
            { label: 'ENERGY', color: '#10b981' },
            { label: 'DATA', color: '#3b82f6' }
          ],
          userStoriesCount: 12,
          useCasesCount: 5
        },
        {
          id: '2',
          name: 'E-commerce Engine',
          industry: 'Retail',
          description: 'Circular logistics and packaging reduction strategies...',
          focusAreas: [
            { label: 'LOGISTICS', color: '#f59e0b' },
            { label: 'LIFECYCLE', color: '#6366f1' }
          ],
          userStoriesCount: 8,
          useCasesCount: 3
        }
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: Date.now().toString(),
        ...projectData,
        userStoriesCount: 0,
        useCasesCount: 0
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
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
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setProjects, setCurrentProject, addProject, updateProject, setLoading, setError } = projectsSlice.actions;
export default projectsSlice.reducer;
