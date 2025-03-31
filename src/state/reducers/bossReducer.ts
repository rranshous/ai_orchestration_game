import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { showToast } from './notificationReducer';
import modelService, { BossMessageType } from '../../services/modelService';
import { delay } from '../../utils/helpers';

export interface BossState {
  lastMessageTime: number;
  messageTimer: number | null;
  latestMessage: string | null;
  latestMessageType: BossMessageType | null;
}

const initialState: BossState = {
  lastMessageTime: 0,
  messageTimer: null,
  latestMessage: null,
  latestMessageType: null,
};

const bossSlice = createSlice({
  name: 'boss',
  initialState,
  reducers: {
    setLastMessageTime: (state, action: PayloadAction<number>) => {
      state.lastMessageTime = action.payload;
    },
    setMessageTimer: (state, action: PayloadAction<number | null>) => {
      state.messageTimer = action.payload;
    },
    setLatestMessage: (state, action: PayloadAction<{ message: string; messageType: BossMessageType }>) => {
      state.latestMessage = action.payload.message;
      state.latestMessageType = action.payload.messageType;
    },
  },
});

export const { setLastMessageTime, setMessageTimer, setLatestMessage } = bossSlice.actions;

// Thunk to start sending periodic boss messages
export const startBossMessages = () => async (dispatch: any) => {
  let isSendingMessage = false; // Flag to prevent duplicate messages
  
  // Send first message after a delay
  await delay(30000); // 30 seconds delay before first message
  
  // Send a message only if not already sending one
  if (!isSendingMessage) {
    await dispatch(sendBossMessage());
  }
  
  // Set up interval for future messages
  const timerId = window.setInterval(async () => {
    // Only send a message if not already sending one
    if (!isSendingMessage) {
      isSendingMessage = true;
      await dispatch(sendBossMessage());
      isSendingMessage = false;
    }
  }, 60000 + Math.random() * 120000); // Random interval between 1-3 minutes
  
  dispatch(setMessageTimer(timerId as unknown as number));
};

export const stopBossMessages = () => (dispatch: any, getState: any) => {
  const { messageTimer } = getState().boss;
  if (messageTimer) {
    clearInterval(messageTimer);
    dispatch(setMessageTimer(null));
  }
};

// Thunk to generate and send a boss message
export const sendBossMessage = () => async (dispatch: any, getState: any) => {
  const state = getState();
  const activeProject = state.projects.activeProjectId ? 
    state.projects.projects.find((p: any) => p.id === state.projects.activeProjectId) : 
    null;
  
  const completedProjects = state.projects.projects.filter((p: any) => p.status === 'completed');
  const abandonedProjects = state.projects.projects.filter((p: any) => p.status === 'abandoned');
  
  let messageType: BossMessageType;
  
  // Determine message type based on current state
  if (abandonedProjects.length > 1) {
    messageType = BossMessageType.CRITICISM;
  } else if (state.projects.projects.length > 3 && !activeProject) {
    messageType = BossMessageType.URGENT;
  } else if (completedProjects.length > 0 && Math.random() < 0.7) {
    messageType = BossMessageType.PRAISE;
  } else {
    messageType = BossMessageType.NEUTRAL;
  }
  
  try {
    // Generate boss message
    const message = await modelService.generateBossMessage(
      messageType,
      activeProject,
      {
        completedCount: completedProjects.length,
        avgTime: calculateAverageTime(completedProjects)
      }
    );
    
    // Display as toast with longer duration (10 seconds instead of 5)
    dispatch(showToast({ 
      type: "info", 
      message: `📱 BOSS: ${message}`,
      duration: 10000 // 10 seconds
    }));
    
    // Store the latest message
    dispatch(setLatestMessage({ 
      message: message,
      messageType: messageType
    }));
    
    // Update last message time
    dispatch(setLastMessageTime(Date.now()));
  } catch (error) {
    console.error('Error sending boss message:', error);
  }
};

// Helper to calculate average completion time
function calculateAverageTime(completedProjects: any[]): number {
  if (completedProjects.length === 0) return 0;
  
  const totalTime = completedProjects.reduce((sum, project) => {
    const startTime = project.startTime || 0;
    const endTime = project.endTime || Date.now();
    return sum + (endTime - startTime);
  }, 0);
  
  return Math.floor(totalTime / (completedProjects.length * 1000)); // Average in seconds
}

export default bossSlice.reducer;
