import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectsReducer from './slices/projectsSlice';
import userStoriesReducer from './slices/userStoriesSlice';
import useCasesReducer from './slices/useCasesSlice';
import aiSuggestionReducer from './slices/aiSuggestionSlice';
import uiReducer from './slices/uiSlice';
import activityReducer from './slices/activitySlice';
import analyticsReducer from './slices/analyticsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectsReducer,
  userStories: userStoriesReducer,
  useCases: useCasesReducer,
  aiSuggestion: aiSuggestionReducer,
  ui: uiReducer,
  activity: activityReducer,
  analytics: analyticsReducer,
});

export default rootReducer;
