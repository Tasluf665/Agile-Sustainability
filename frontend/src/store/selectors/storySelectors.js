import { createSelector } from '@reduxjs/toolkit';

export const selectAllUserStories = (state) => state.userStories.items || [];
export const selectUserStoriesLoading = (state) => state.userStories.isLoading;

// Memoized selectors
export const selectStoryCount = createSelector(
  [selectAllUserStories],
  (stories) => stories.length
);

export const selectAcceptedSuggestionCount = createSelector(
  [selectAllUserStories],
  (stories) => stories.filter(story => story.status === 'ACCEPTED' || story.status === 'APPROVED').length
);

export const selectTotalUseCaseCount = createSelector(
  [selectAllUserStories],
  (stories) => stories.reduce((total, story) => total + (story.useCaseCount || 0), 0)
);

export const selectActiveUserStories = createSelector(
  [selectAllUserStories],
  (stories) => stories.filter(story => story.status !== 'ARCHIVED')
);
