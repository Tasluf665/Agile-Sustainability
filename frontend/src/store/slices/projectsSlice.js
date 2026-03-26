import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// Helper to map backend project to frontend structure
const formatProject = (project) => ({
  id: project._id,
  name: project.name,
  industry: project.industry,
  description: project.description,
  sustainabilityGoals: project.sustainabilityGoals,
  focusAreas: project.focusAreas.map(area => ({
    label: area,
    color: getFocusAreaColor(area)
  })),
  userStoriesCount: project.userStoriesCount || 0,
  useCasesCount: project.useCasesCount || 0,
  createdAt: project.createdAt
});

const getFocusAreaColor = (area) => {
  const colors = {
    'ENERGY': '#10b981',
    'WATER': '#3b82f6',
    'WASTE': '#ef4444',
    'DATA': '#8b5cf6',
    'LOGISTICS': '#f59e0b',
    'LIFECYCLE': '#6366f1'
  };
  return colors[area] || '#64748b';
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects');
      // Backend returns { success: true, count: X, data: [...] }
      return response.data.data.map(formatProject);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return formatProject(response.data.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      // projectData from form uses { name, industry, description, goals, focusAreas }
      // Backend expects { name, industry, description, sustainabilityGoals, focusAreas }
      const payload = {
        name: projectData.name,
        industry: projectData.industry,
        description: projectData.description,
        sustainabilityGoals: projectData.goals,
        focusAreas: projectData.focusAreas
      };
      
      const response = await api.post('/projects', payload);
      return formatProject(response.data.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProjectAsync = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      return formatProject(response.data.data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${projectId}`);
      return projectId;
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
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
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
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setProjects, setCurrentProject, addProject, updateProject, setLoading, setError } = projectsSlice.actions;
export default projectsSlice.reducer;
