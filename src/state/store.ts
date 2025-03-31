import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './reducers/workspaceReducer';
import agentReducer from './reducers/agentReducer';
import projectReducer from './reducers/projectReducer';
import workflowReducer from './reducers/workflowReducer';
import notificationReducer from './reducers/notificationReducer';
import helpReducer from './reducers/helpReducer';
import bossReducer from './reducers/bossReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    agents: agentReducer,
    projects: projectReducer,
    workflow: workflowReducer,
    notifications: notificationReducer,
    help: helpReducer,
    boss: bossReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
