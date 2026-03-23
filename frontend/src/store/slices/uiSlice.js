import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: {},
  toasts: [],
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      const { modalName, isOpen } = action.payload;
      state.modals[modalName] = isOpen;
    },
    addToast: (state, action) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleModal, addToast, removeToast, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
