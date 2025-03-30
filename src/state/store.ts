import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './reducers/workspaceReducer';
import agentReducer from './reducers/agentReducer';
import projectReducer from './reducers/projectReducer';
import workflowReducer from './reducers/workflowReducer';
import notificationReducer from './reducers/notificationReducer';
import helpReducer from './reducers/helpReducer';

const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    agents: agentReducer,
    projects: projectReducer,
    workflow: workflowReducer,
    notifications: notificationReducer,
    help: helpReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
