import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateId } from '../../utils/helpers';
import { Project } from '../../types/projects';
import { Notification } from '../../types/notifications';

export interface NotificationState {
  toasts: Notification[];
  completedProject: Project | null;
}

const initialState: NotificationState = {
  toasts: [],
  completedProject: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ type: "info" | "success" | "error", message: string }>) => {
      state.toasts.push({
        id: generateId(),
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    
    hideToast: (state, action: PayloadAction<{ id: string }>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload.id);
    },
    
    showCompletionDialog: (state, action: PayloadAction<{ project: Project }>) => {
      state.completedProject = action.payload.project;
    },
    
    hideCompletionDialog: (state) => {
      state.completedProject = null;
    }
  }
});

export const { 
  showToast,
  hideToast,
  showCompletionDialog,
  hideCompletionDialog
} = notificationSlice.actions;

export default notificationSlice.reducer;
